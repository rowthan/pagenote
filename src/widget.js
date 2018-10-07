import {  h,app } from "hyperapp"
import style from "./widget.css"
import constant from './constant'
import { getViewPosition,hightLightElement } from "./document";
export default function widget(easyshare){
  const state = {
    status: "",
    recordedSteps: easyshare.recordedSteps,
    mPos :{},
    runindex:null,
    ballPos:{},
    showBall:false
  }
    
  const actions = {
    refershState: value => state =>({
      status: easyshare.status,
      recordedSteps: easyshare.recordedSteps,
      mPos :{x:easyshare.mPos.x,y:easyshare.mPos.y},
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
          style={{display: "block",
                    position:"absolute",
                    right:0,
                    top:(index+1)*15+"px",
                    width: "8px",
                    height: "8px",
                    transform: `scale(${running?2:1})`,
                    background: running?"#cdef5b":"#ffc0cb",
                    overflow: "hidden",
                    borderRadius: "50%",
                    textAlign:"center",
                    transition:".5s",
                    cursor:"pointer"}}
          onclick={()=>{easyshare.replay(index,null,false)}}
    >
    </span>
  )

  const StepTag = ({step,running=false,index})=>(
    <div style={{position:"absolute",top:step.mPos.y+"px",left:step.mPos.x+"px"}}>
      <aside class="point"></aside>
      {
        step.isActive && <span className="box">{step.text}</span>
      }
    </div>
  )


  const view = (state, actions) => (
    <div oncreate={()=>{easyshare.onStateChange = function(){actions.refershState()};
    aftercreate(actions)}}>
      <div style={{position:"absolute",left:state.mPos.x+"px",top:state.mPos.y+"px",transition:".5s"}}>
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
              id="easyshare-menu"
              style={{
                      position:"absolute",
                      visibility:state.recordedSteps.length>0?"visible":"hidden",
                      right:0,
                      top:state.recordedSteps.length*15+20+"px",
                      width: "20px",
                      height: "18px",
                      transform: "scale(1)",
                      background: "#e6e6e6",
                      borderRadius: "25%",
                      textAlign:"center",
                      transition:".5s",
                        cursor:"pointer",
                        boxShadow:"0 2px 4px 0 rgba(0,0,0,.04)"}}
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