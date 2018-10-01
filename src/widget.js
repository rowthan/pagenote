import {  h,app } from "hyperapp"
import constant from './constant'
export default function widget(easyshare){
  const state = {
    status: "",
    recordedSteps: easyshare.recordedSteps,
    mPos :{}
  }
    
  const actions = {
    refershState: value => state =>({
      status: easyshare.status,
      recordedSteps: easyshare.recordedSteps,
      mPos :{x:easyshare.mPos.x,y:easyshare.mPos.y}
    })
  }

  const record = (actions)=>{
    easyshare.record()
    actions.refershState()
  }


  const RecordButton = ({status,onclick}) =>(
    <button onclick={onclick}>
      {status}
    </button>
  )
  
  const StepSign = ({step,running=false})=>(
    <span style={{display: "block",
                    width: "20px",
                    height: "20px",
                    background: running?"pink":"green",
                    overflow: "hidden",
                    borderRadius: "10px",
                    marginBottom:"5px",
                    textAlign:"center"}}>
                    {
                      step.text?step.text.substr(0,1):step.y
                    }
    </span>
  )


  const view = (state, actions) => (
    <div oncreate={()=>{easyshare.onStateChange = function(){actions.refershState()};
    setTimeout(function(){actions.refershState()},1000)}}>
      <div style={{position:"absolute",left:state.mPos.x+"px",top:state.mPos.y+"px",transition:".5s"}}>
        {
          state.status === constant.WAITING
          &&
          <span>
            <RecordButton status={state.status} onclick={()=>{record(actions)}}></RecordButton>  
          </span>
         
        }
      </div>
      <aside style={{position:"fixed",top:0,right:0}}>
        <div>
          {
            state.recordedSteps.map(record=>(
              <StepSign step = {record}/>
            ))
          }
        </div>
        {
          state.recordedSteps.length>0 && 
            <button onclick={easyshare.makelink}>
              生成链接
            </button>
        }
         
      </aside>
    </div>
  )
  app(state, actions, view, document.body)
}