import {  h,app } from "hyperapp"
export default function widget(easyshare){
  const state = {
    status: easyshare.status,
    recordedSteps: easyshare.recordedSteps,
    mousePosition :{x:easyshare.mousePosition.x,y:easyshare.mousePosition.y}
  }
    
  const actions = {
    refershState: value => state =>({
      status: easyshare.status,
      recordedSteps: easyshare.recordedSteps,
      mousePosition :{x:easyshare.mousePosition.x,y:easyshare.mousePosition.y}
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
  

  const view = (state, actions) => (
    <div oncreate={easyshare.onStateChange = function(){actions.refershState();console.log(state)}}>
      <div style={{position:"absolute",left:state.mousePosition.x+"px",top:state.mousePosition.y+"px",transition:".5s"}}>
        {
          state.status == "WAITING"
          &&
          <span>
            <RecordButton status={state.status} onclick={()=>{record(actions)}}></RecordButton>  
            <button onclick={easyshare.makelink}>
              生成链接
            </button>
          </span>
         
        }
      </div>
    </div>
  )
  app(state, actions, view, document.body)
}