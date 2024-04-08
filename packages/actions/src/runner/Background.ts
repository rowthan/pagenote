import jsYaml from 'js-yaml';
import {Job, Step, TaskState, WorkFlow, WorkflowOption, WorkFlowState} from "../typing";
import set from 'lodash/set'
import get from 'lodash/get'
import {generateMatrixTasks, replaceTemplates} from "../utils";
import {exprEval, ifCheck} from "../utils/expr-eval";
import {getAction} from "../actions";

/**
 * 适用于后台运行的运行器（service worker or nodejs，不依赖 DOM 结构）
 * */
export default class Background{
  /** 运行信息，基于配置文件解析的对象结构*/
  public workflowInfo:WorkFlow | null = null
  /** 全局的上下文变量，记录配置项、流水线的基础运行信息（触发源、时间、环境等信息）） */
  public context:{
    // 环境变量
    env: Object,
    trigger:{},
  }
  /** 流水线的全局状态*/
  public state : WorkFlowState
  /**
   * 运行时环境变量
   * * @type {Record<contextID 上下文ID, Map<string,any>>}
   * */
  public runtime: Map<string, Record<string,any>> = new Map<string, {
    steps: any,
    jobs: any,
    matrix: any,
    [key:string]: any,
  }>();

  public log: Map<string, any> = new Map<string, any>();

  /**运行期的配置信息*/
  private readonly  option: WorkflowOption;


  constructor(option:WorkflowOption) {
    this.option = option;
    this.updateYml(option?.yml || '');
    this.context = {
      env:{},
      trigger:{},
    //   todo 系统变量，如当前时间获取
    }

    this.state = WorkFlowState.waiting
  }

  /**
   * yml to object
   * https://nodeca.github.io/js-yaml/
   * */
  updateYml(yml: string | WorkFlow){
    try{
      this.workflowInfo = typeof yml === 'string' ? jsYaml.load(yml) as WorkFlow : yml;
    }catch (e) {
      throw e
    }
  }


  /**
   * 设置上下文空间的变量信息
   * */
  _setRuntime(id: string, value: any = {},contextId: string){
    const runtime = this.runtime.get(contextId) || this.runtime.set(contextId,{}).get(contextId) || {}
    set(runtime, id, value)
    this.log.set(id,value);
  }

  /**
   * 获取上下文空间的变量信息
   * */
  _getRuntime(contextId: string){
    return this.runtime.get(contextId) || this.runtime.set(contextId,{}).get(contextId);
  }

  /**
   * 获取 job/step 下可被读取的上下文内容
   * */
  _getContextVariables(contextId: string){
    return {
      env: this.context.env,
      steps: this._getRuntime(contextId)?.steps || {},
      jobs: this._getRuntime(contextId)?.jobs || {},
      matrix: this._getRuntime(contextId)?.matrix || {}
    }
  }

  /** 开始前的 环境变量准备*/
  async _prepareEnv() {
    const envKeys = (this.workflowInfo?.env || []).map(function (item) {
      return item.key;
    });
    const preparedEnv:Record<string, any> = await this.option.prepareEnv(envKeys) || {};
    const envObject: Record<string, any> = {}
    this.workflowInfo?.env?.forEach(function (item) {
      const value = get(preparedEnv, item.key) || item.default;
      set(envObject, item.key, value)
      if(item.id){
        set(envObject, item.id, value)
      }
    });
    this.context.env = envObject;
  }

  /**
   * 配置的测试用例，用于反馈配置是否合法，避免在正式运行时出现一些错误
   * */
  async runTest(){
    await this._prepareEnv();
    const testJobs = this.workflowInfo?.test || [];

    for(let i=0; i<testJobs.length; i++){
      await this._runJob(testJobs[i],`test${Date.now()}`)
    }

    return testJobs.every(function (job) {
      return job._state !== TaskState.fail
    })
  }


  /**
   * 运行 workflow
   * */
  async run(){
    this.state = WorkFlowState.running;
    /**1.环境变量准备*/
    await this._prepareEnv();
    /**2. 运行job*/
    const jobs = this.workflowInfo?.jobs || [];
    /**所有的 jobs 同一个上下文*/
    const contextId = Date.now()+ (this.workflowInfo?.name || '')
    for(let i=0; i<jobs.length; i++){
      await this._runJob(jobs[i],contextId)
    }
    this.state = WorkFlowState.finished;
  }

  /**
   * 执行 定义的单个 job
   * */
  async _runJob(job: Job,jobsContextId: string){
    if(!job) return;
    let jobResponse;
    job._state = TaskState.running;
    /**
     * 如果 job 是一个 matrix 任务，则要进行叉乘创建子 job。
     */
    const variables = this._getRuntime(jobsContextId) || {};
    job = replaceTemplates<Job>(job,variables)
    let markSuccess = true;
    // todo runjob 支持if 判断
    // todo jobs 之间取值？
    if(job.strategy?.matrix){
      const matrixVariables = generateMatrixTasks(job.strategy.matrix) || [];
      for (let i=0; i<matrixVariables.length; i++){
        for(let j=0; j<matrixVariables[i].length; j++){
          const contextId = (job.id || job.name) + 'matrix'+i+j;
          const stepVariable = matrixVariables[i][j];
          this._setRuntime('matrix',stepVariable,contextId)
          // 每一个 matrix 相互不受影响运行
          try{
            jobResponse = await this._runSteps(job.steps,contextId);
            this._setRuntime(`jobs.${job.id||job.name}.outputs`,jobResponse,jobsContextId)
          }catch (e) {
            markSuccess = false;
          }
        }
      }
    } else {
      const {id='',name='',} = job || {};
      const contextId = 'job_'+id + name // + Date.now();
      jobResponse = await this._runSteps(job.steps,contextId)
      this._setRuntime(`jobs.${id||name}.outputs`,jobResponse,jobsContextId)
    }

    job._state = markSuccess ? TaskState.complete : TaskState.fail;
    return jobResponse;
  }

  /**
   * 执行多个任务组；用于控制并发、串行、失败控制等
   * */
  async _runSteps(steps: Step[],contextId:string){
    let response;
    for (let i = 0; i < steps.length; i++) {
      try {
        // steps 集合的最终返回，取决于最后一个任务的执行结果
        response = await this._runStep(steps[i],contextId);
      }catch (e) {
        if(steps[i]['continue-on-error']){
          console.warn('允许失败，继续执行',e)
        }else{
          throw e;
        }
      }
    }
    return response;
  }

  /**
   * 执行单个 step 任务
   * */
  async _runStep(step: Step,stepsContextId:string){
    if(!step){
      return
    }
    const { uses='' } = step;

    step._state = TaskState.running;

    const variables = this._getContextVariables(stepsContextId)


    if(step.debug){
      console.debug('debug',step)
      debugger
    }
    let response = null;

    /**条件检测**/
    const ifCheckResult = step.if ? ifCheck(step.if,variables) : true;
    if(!ifCheckResult){
      step._state = TaskState.skip;
    } else{
      const withArgs = step.with ? replaceTemplates(step.with,variables) : undefined
      try{
        if(this.option.hooks?.beforeStep){
          this.option.hooks?.beforeStep(step,withArgs);
        }
        // 由用户自行提供 action or 系统默认 actions
        const action = await this.option.registerAction(uses || '') || await getAction(uses);
        if(uses && !action){
          step._state = TaskState.fail;
          throw Error('without action::'+ uses)
        }

        if(step.run && step.run.length){
          step.run.forEach(function (terminate) {
            response = exprEval(terminate,variables)
          })
        }else{
          try{
            response = action ? await action(withArgs) : withArgs;
          }catch (e) {
            step._state = TaskState.fail;
            throw e;
          }
        }

        this._setRuntime(`steps.${step.id || step.name}.outputs`, response,stepsContextId)
      }catch (e) {
        step._state = TaskState.fail;
        throw e;
      }
      step._state = TaskState.complete;
      if(this.option.hooks?.afterStep){
        this.option.hooks?.afterStep(step,response);
      }
    }

    /**由用户自行控制step 退出码*/
    let exitCode: unknown = 0;
    if(step.exit){
      if(typeof step.exit === 'number'){
        exitCode = step.exit;
      }else{
        exitCode = exprEval(step.exit,this._getContextVariables(stepsContextId))
      }

      if(exitCode!==0){
        step._state = TaskState.fail;
        throw Error((step.id || step.name) + ' exit code is not equal 0 :' + exitCode);
      }
    }
    return response;
  }
}
