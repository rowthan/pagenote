import jsYaml from 'js-yaml';
import {Job, Step, TaskState, WorkFlow, WorkFlowState} from "../typing";
import {IAction} from "../typing/IAction";
import set from 'lodash/set'
import get from 'lodash/get'
import {generateMatrixTasks, replaceTemplates} from "../utils";
import {exprEval, ifCheck} from "../utils/expr-eval";

interface WorkflowOption {
  yml?: string
  registerAction: (actions:string)=>Promise<IAction | null>;
  prepareEnv: (keys: string[])=>Promise<Object>;
  hooks?: {
    beforeJob?: ()=>void,
    afterJob?: ()=>void,
    beforeStep?: (step: Step, request: any)=>void,
    afterStep?: (step: Step, response:any)=>void,
    beforeTask?: ()=>void,
    afterTask?: ()=>void,
    beforeWorkflow?: ()=>void,
    afterWorkflow?: ()=>void,
  }
}


export default class Background{
  public workflowInfo:WorkFlow | null = null
  public context:{
    // 环境变量
    env: Object,
    trigger:{

    },
  }

  private actions: Map<string, IAction> = new Map();


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

  private readonly  option: WorkflowOption;

  public running: [number,number] = [-1,-1]

  constructor(option:WorkflowOption) {
    this.option = option;
    this._updateYml(option?.yml || '');
    this.context = {
      env:{},
      trigger:{},
    }

    this.state = WorkFlowState.waiting
  }

  /**
   * yml to object
   * https://nodeca.github.io/js-yaml/
   * */
  _updateYml(yml?: string){
    try{
      this.workflowInfo = yml ? jsYaml.load(yml) as WorkFlow : null;
    }catch (e) {
      throw e
    }
  }


  _setRuntime(id: string, value: any = {},contextId: string){
    const runtime = this.runtime.get(contextId) || this.runtime.set(contextId,{}).get(contextId) || {}
    set(runtime, id, value)
  }

  _getRuntime(contextId: string){
    return this.runtime.get(contextId) || this.runtime.set(contextId,{}).get(contextId);
  }

  async _getAction(uses: string){
    const cache = this.actions.get(uses);
    if(cache){
      return Promise.resolve(cache);
    }
    const action = await this.option.registerAction(uses||'');
    if(action){
      this.actions.set(uses,action);
    }
    return action;
  }

  getContextVariables(contextId: string){
    const variables = {
      env: this.context.env,
      steps: this._getRuntime(contextId)?.steps || {},
      jobs: this._getRuntime(contextId)?.jobs || {},
      matrix: this._getRuntime(contextId)?.matrix || {}
    }
    return variables
  }
  /**
   * 执行 step 任务
   * */
  async runStep(step: Step,stepsContextId:string){
    if(!step){
      return
    }
    const { uses='' } = step;

    step._state = TaskState.running;

    const variables = this.getContextVariables(stepsContextId)


    if(step.debug){
      debugger
    }
    let response;

    /**条件检测**/
    if(step.if){
      const checkResult = ifCheck(step.if,variables);
      if(!checkResult){
        step._state = TaskState.skip;
      }
    } else{
      const withArgs = step.with ? replaceTemplates(step.with,variables) : undefined
      try{
        if(this.option.hooks?.beforeStep){
          this.option.hooks?.beforeStep(step,withArgs);
        }
        const action = await this._getAction(uses);
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
    let exitCode: number | boolean = 0;
    if(step.exit){
      if(typeof step.exit === 'number'){
        exitCode = step.exit;
      }else{
        exitCode = exprEval(step.exit,this.getContextVariables(stepsContextId))
      }

      if(exitCode!==0){
        step._state = TaskState.fail;
        throw Error((step.id || step.name) + ' exit code is not equal 0 :' + exitCode);
      }
    }
    return response;
  }

  async _runSteps(steps: Step[],contextId:string){
    let response;
    for (let i = 0; i < steps.length; i++) {
      try {
        response = await this.runStep(steps[i],contextId);
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
   * 执行 定义的单个 job
   * */
  async runJob(job: Job,jobsContextId: string){
    if(!job) return;
    let jobResponse;
    job._state = TaskState.running;
    /**
     * 如果 job 是一个 matrix 任务，则要进行叉乘创建子 job。
     */
    const variables = this._getRuntime(jobsContextId) || {};
    job = replaceTemplates<Job>(job,variables)
    if(job.strategy?.matrix){
      const matrixVariables = generateMatrixTasks(job.strategy.matrix) || [];
      for (let i=0; i<matrixVariables.length; i++){
        for(let j=0; j<matrixVariables[i].length; j++){
          const contextId = Date.now()+ (job.id || job.name) + 'matrix'+i+j;
          const stepVariable = matrixVariables[i][j];
          this._setRuntime('matrix',stepVariable,contextId)
          jobResponse = await this._runSteps(job.steps,contextId);
          this._setRuntime(`jobs.${job.id||job.name}.outputs`,jobResponse,jobsContextId)
        }
      }
    } else {
      const {id='',name='',} = job || {};
      const contextId = id + name + Date.now();
      jobResponse = await this._runSteps(job.steps,contextId)
      this._setRuntime(`jobs.${id||name}.outputs`,jobResponse,jobsContextId)
    }

    job._state = TaskState.complete;
    return jobResponse;
  }

  async prepareEnv() {
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

  async run(){
    this.state = WorkFlowState.running;
    /**1.环境变量准备*/
    await this.prepareEnv();


    /**2. 运行job*/
    const jobs = this.workflowInfo?.jobs || [];
    /**所有的 jobs 同一个上下文*/
    const contextId = Date.now()+ (this.workflowInfo?.name || '')
    for(let i=0; i<jobs.length; i++){
      await this.runJob(jobs[i],contextId)
    }
    this.state = WorkFlowState.success;
  }

  async runTest(){
    await this.prepareEnv();
    const testJobs = this.workflowInfo?.test || [];

    for(let i=0; i<testJobs.length; i++){
      await this.runJob(testJobs[i],`test${Date.now()}`)
    }

    return testJobs.every(function (job) {
      return job._state !== TaskState.fail
    })
  }

  check(): Promise<boolean> {
    return Promise.resolve(false);
  }
}
