import {  h,app } from "hyperapp"
import constant from './constant'
export default function widget(easyshare){
  const state = {
    status: "",
    recordedSteps: easyshare.recordedSteps,
    mPos :{},
    runindex:null
  }
    
  const actions = {
    refershState: value => state =>({
      status: easyshare.status,
      recordedSteps: easyshare.recordedSteps,
      mPos :{x:easyshare.mPos.x,y:easyshare.mPos.y},
      runindex:easyshare.runindex
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
      easyshare.record()
      actions.refershState()
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
          (state.status === constant.WAITING || state.status === constant.PLAYANDWAIT)
          &&
          <span>
            <RecordButton status={state.status} onclick={()=>{record(actions)}}></RecordButton>  
          </span>
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
          <span title="菜单"
            style={{display: "block",
                      position:"absolute",
                      right:0,
                      top:state.recordedSteps.length*15+20+"px",
                      width: "20px",
                      height: "18px",
                      transform: "scale(1)",
                      background: "#e6e6e6",
                      overflow: "hidden",
                      borderRadius: "25%",
                      textAlign:"center",
                      transition:".5s",
                      cursor:"pointer"}}
            
            onclick={()=>{easyshare.replay(index,null,false)}}
          >
            <svg viewBox="0 0 8 16" version="1.1" width="20" height="16" aria-hidden="true">
              <path fill-rule="evenodd" d="M8 4v1H0V4h8zM0 8h8V7H0v1zm0 3h8v-1H0v1z"></path>
            </svg>
          </span>
          {/* {
            state.recordedSteps.length>0 && 
              <div onclick={easyshare.makelink} 
              style={{position:"absolute",
                      background:"#f4f5f5",
                      boxShadow:"0 2px 4px 0 rgba(0,0,0,.04)",
                      height:"20px",
                      width:"20px",
              right:0,

              top:state.recordedSteps.length*15+"px"}}>
                s
              </div>
          } */}
        
      </aside>
    </div>
  )
  app(state, actions, view, document.body)
}