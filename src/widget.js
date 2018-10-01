import {  h,app } from "hyperapp"
import constant from './constant'
export default function widget(easyshare){
  const state = {
    status: "",
    recordedSteps: easyshare.recordedSteps,
    mPos :{},
    running:null
  }
    
  const actions = {
    refershState: value => state =>({
      status: easyshare.status,
      recordedSteps: easyshare.recordedSteps,
      mPos :{x:easyshare.mPos.x,y:easyshare.mPos.y},
      running:easyshare.running
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

  const record = (actions)=>{
    if(easyshare.status!=constant.REPLAYING){
      easyshare.record()
      actions.refershState()
    }
  }


  const RecordButton = ({status,onclick}) =>(
    <button onclick={onclick}>
      {status}
    </button>
  )
  
  const StepSign = ({step,running=false,index})=>(
    <span style={{display: "block",
                    position:"absolute",
                    top:index*15+"px",
                    right:running?"10px":"0px",
                    width: running?"20px":"8px",
                    height: running?"20px":"8px",
                    background: running?"red":"pink",
                    overflow: "hidden",
                    borderRadius: "50%",
                    textAlign:"center",
                    transition:".5s"}}>
                    {
                      (running && step.text)?step.text.substr(0,1):""
                    }
    </span>
  )


  const view = (state, actions) => (
    <div oncreate={()=>{easyshare.onStateChange = function(){actions.refershState()};
    aftercreate(actions)}}>
      <div style={{position:"absolute",left:state.mPos.x+"px",top:state.mPos.y+"px",transition:".5s"}}>
        {
          (state.status === constant.WAITING || state.status === constant.REPLAYING)
          &&
          <span>
            <RecordButton status={state.status} onclick={()=>{record(actions)}}></RecordButton>  
          </span>
        }
      </div>
      <aside style={{position:"fixed",top:20,right:0}}>
        <div style={{position:"relative"}}>
          {
            state.recordedSteps.map((record,index)=>(
              <StepSign step = {record} running={index===state.running} index={index}/>
            ))
          }
          {
            state.recordedSteps.length>0 && 
              <button onclick={easyshare.makelink} style={{position:"absolute",right:0,top:state.recordedSteps.length*15+"px"}}>
                生成链接
              </button>
          }
        </div> 
      </aside>
    </div>
  )
  app(state, actions, view, document.body)
}