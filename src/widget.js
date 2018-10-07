import {  h,app } from "hyperapp"
import style from "./widget.css"
import constant from './constant'
import { getViewPosition,hightLightElement } from "./document";
export default function widget(easyshare){
  const state = {
    //来自easyshare的状态
    status: "",
    recordedSteps: easyshare.recordedSteps,
    targetInfo: easyshare.targetInfo,
    runindex:null,

    //自定义state
    ballPos:{},
    showBall:false
  }
    
  const actions = {
    refershState: value => state =>({
      status: easyshare.status,
      recordedSteps: easyshare.recordedSteps,
      targetInfo: easyshare.targetInfo,
      runindex:easyshare.runindex
    }),
    setBallPos: value=> state =>({
      ballPos: value
    }),
    toggleShowBall: value=> state => ({
      showBall:value
    })
  }

  const aftercreate = (actions)=>{
    setTimeout(()=>{
      actions.refershState()
      if(window.location.search.indexOf("autoreplay")>-1){
        easyshare.replay()
      }
    },1000)
  }

  const record = (e,actions)=>{
    e.stopPropagation()
    e.preventDefault()

    let {top:startTop,left : startLeft} = getViewPosition(e.currentTarget)
    let {top:targetTop,left: targetLeft} = getViewPosition(document.getElementById("easyshare-menu"))
    
    const a = (targetTop/targetLeft-startTop/startLeft)/(targetLeft - startLeft);
    const b = targetTop/targetLeft - a*targetLeft;
    
    let inc = 15;
    actions.toggleShowBall(true)
    const move = setInterval(()=>{
      if(startLeft<=targetLeft){
        startLeft += targetLeft-startLeft<=10 ? 1 : inc;
        startTop = a*startLeft*startLeft + b*startLeft
        actions.setBallPos({left:startLeft,top:startTop})
      }
      else{
        actions.toggleShowBall(false)
        easyshare.record()
        clearInterval(move)
    }
    },10)
  }
  const getPosition = function(e){
    e.stopPropagation()
    e.preventDefault()
    const result = getViewPosition(e.currentTarget)
    console.log("result: "+ result)
  }


  const RecordButton = ({status,onclick}) =>(
    <button onclick={onclick}>
      {status===constant.WAITING && "记录此处"}
      {status===constant.REPLAYING && "结束播放后可进行记录"}
      {status===constant.PLAYANDWAIT && "结束播放后可进行记录"}
    </button>
  )
  
  const StepSign = ({step,running=false,index})=>(
    <span title={step.text?step.text:"点击"} 
          className={style.stepSign}
          style={{
            top:(index+1)*15+"px",
            transform: `scale(${step.isActive?2:1})`,
            //TODO running 增加动画效果
            background: step.isActive?"#cdef5b":"#ffc0cb",
          }}
          onclick={()=>{easyshare.replay(index,null,false,step.isActive)}}
    >
    </span>
  )

  const StepTag = ({step,running=false,index})=>(
    <div style={{position:"absolute",top:step.y+"px",left:step.x+"px"}}>
      <aside title="点击查看"  class={style.point}
        onclick={()=>{easyshare.replay(index,null,false,step.isActive)}} >
      </aside>
      {
        step.isActive && <span className={style.box}>{step.text}</span>
      }
    </div>
  )


  const view = (state, actions) => (
    <div oncreate={()=>{easyshare.onStateChange = function(){actions.refershState()};
    aftercreate(actions)}}>
      <div style={{position:"absolute",left:state.targetInfo.x+"px",top:state.targetInfo.y+"px",transition:".5s"}}>
        {
          (state.status === constant.WAITING || state.status === constant.PLAYANDWAIT)
          &&
          <span>
            <RecordButton status={state.status} onclick={(e)=>{record(e,actions)}}></RecordButton>  
          </span>
        }
      </div>
      {
        state.showBall &&
        <div style={{position:"fixed",top:state.ballPos.top+"px",left:state.ballPos.left+"px",
        height:"20px",width:"20px",background:"#f36b5d",borderRadius:"8px"}}>
        </div>
      }

      <div>
        {
          state.recordedSteps.map((record,index)=>(
            <StepTag step={record} index={index}></StepTag>
          ))
        }
      </div>
      
      <aside style={{position:"fixed",top:0,right:0}}>
          <div style={{position:"relative",right:"6px"}}>
            {
              state.recordedSteps.map((record,index)=>(
                <StepSign step = {record} running={index===state.runindex} index={index}/>
              ))
            }
           </div>
          {
            <div title="菜单"
              className={style.menu}
              id="easyshare-menu"
              style={{
                visibility:state.recordedSteps.length>0?"visible":"hidden",
                top:state.recordedSteps.length*15+20+"px",
              }}
              onclick={getPosition}
          >
            <svg viewBox="0 0 8 16" version="1.1" width="20" height="16" aria-hidden="true">
              <path fill-rule="evenodd" d="M8 4v1H0V4h8zM0 8h8V7H0v1zm0 3h8v-1H0v1z"></path>
            </svg>
              </div>
          }
      </aside>
    </div>
  )
  app(state, actions, view, document.body)
}