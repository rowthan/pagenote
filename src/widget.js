import {  h,app } from "hyperapp"
import constant from './constant'
export default function widget(easyshare){
  const state = {
    status: "",
    recordedSteps: [],
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
  

  const view = (state, actions) => (
    <div oncreate={easyshare.onStateChange = function(){actions.refershState()}}>
      <div style={{position:"absolute",left:state.mPos.x+"px",top:state.mPos.y+"px",transition:".5s"}}>
        {
          state.status === constant.WAITING
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