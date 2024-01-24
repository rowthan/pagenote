import jsYaml from 'js-yaml';
import {TaskState, WorkFlow, WorkFlowState} from "../typing";
import {IAction} from "../typing/IAction";
import set from 'lodash/set'
import get from 'lodash/get'
import {replaceTemplates} from "../utils/replace";

interface WorkflowOption {
  yml?: string
  registerAction: (actions:string)=>Promise<IAction>;
  prepareEnv: (keys: string[])=>Promise<Object>
}


export default class Workflows{
  public workflowInfo:WorkFlow | null = null
  public context:{
    // 环境变量
    env: Object,
    trigger:{

    },
  }

  private actions: Map<string, IAction> = new Map();


  public state : WorkFlowState

  public runtime: Record<string, any> = {};

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


  _setRuntime(id: string, value: Record<string, any> = {}){
    set(this.runtime, id, value)
  }

  async _getAction(uses: string){
    const cache = this.actions.get(uses);
    if(cache){
      return Promise.resolve(cache);
    }
    const action = await this.option.registerAction(uses||'');
    this.actions.set(uses,action);
    return action;
  }

  async runStep(jobIndex: number,stepIndex: number){
    this.running = [jobIndex,stepIndex]
    const step = this.workflowInfo?.jobs[jobIndex]?.steps[stepIndex];
    if(!step){
      return
    }
    const { uses='' } = step;
    if(step.debug){
      debugger
    }

    step._state = TaskState.running;
    const action = await this._getAction(uses);
    if(!action){
      step._state = TaskState.fail;
      throw Error('without action')
    }
    this._setRuntime(`steps.${step.id || step.name}`)

    const variables = {
      env: this.context.env,
      steps: this.runtime.steps,
      jobs: this.runtime.jobs,
    }

    const withArgs = step.with ? replaceTemplates(step.with,variables) : undefined
    console.log(withArgs)
    try{
      const response = await action.run(withArgs);
      this._setRuntime(`steps.${step.id || step.name}.outputs`, response)
    }catch (e) {
      step._state = TaskState.fail;
      throw e;
    }
    step._state = TaskState.complete;
  }

  async runJob(jobIndex: number){
    this.running = [jobIndex,-1]
    const job = this.workflowInfo?.jobs[jobIndex];
    if(!job) return;
    this._setRuntime(`jobs.${job.id || job.name}`,{});

    job._state = TaskState.running;
    for (let i = 0; i < job.steps.length; i++) {
      await this.runStep(jobIndex,i);
    }
    job._state = TaskState.complete;
  }

  async run(){
    this.state = WorkFlowState.running;
    // 环境变量准备
    const envKeys = (this.workflowInfo?.env || []).map(function (item) {
      return item.key;
    });
    const preparedEnv:Record<string, any> = await this.option.prepareEnv(envKeys) || {};
    const envObject: Record<string, any> = {}
    this.workflowInfo?.env?.forEach(function (item) {
      set(envObject, item.key, get(preparedEnv, item.key))
      if(item.id){
        set(envObject, item.id, get(preparedEnv, item.key))
      }
    });
    this.context.env = envObject;
    console.log(this.context.env,'env')
    // 运行job
    const jobs = this.workflowInfo?.jobs || [];
    for(let i=0; i<jobs.length; i++){
      await this.runJob(i)
    }
    this.state = WorkFlowState.success;
  }

  _resetState(){

  }

  check(): Promise<boolean> {
    return Promise.resolve(false);
  }
}
