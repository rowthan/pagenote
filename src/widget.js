import {  h,app } from "hyperapp"
import style from "./widget.css"
import constant from './constant'
import { getViewPosition } from "./document";
//TODO 增加dev 视图展示所有state信息 方便手机端调试
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
    <span title="点击"
          className={style.stepSign}
          style={{
            top:(index+1)*15+"px",
            transform: `scale(${running?2:1})`,
            //TODO running 增加动画效果
            background: step.isActive?"#cdef5b":"#b7b7b7",
          }}
          onclick={()=>{easyshare.replay(index,null,false,step.isActive)}}
    >
    </span>
  )

  const StepTag = ({step,running=false,index})=>(
    <div style={{position:"absolute",top:step.y+"px",left:step.x+"px"}}>
      <aside title="点击查看"  class={style.point} style={{transform:`scale(${step.isActive?2:1})`}}
        onclick={()=>{easyshare.replay(index,null,false,step.isActive)}} >
      </aside>
      {/* //通过 css 控制显示与否 */}
      {
        step.isActive && <div className={style.box}>
        {step.text}
        <a className={style.delete} onclick={()=>easyshare.remove(index)}>
          <svg viewBox="0 0 1024 1024" version="1.1"  p-id="1051" width="20" height="20">
            <path d="M223.595474 318.284043l24.022113 480.742089c0 54.376445 44.989657 98.456383 100.485599 98.456383l331.963601 0c55.494918 0 100.489692-44.078914 100.489692-98.456383l23.109324-480.742089L223.595474 318.284043zM831.749418 284.181341c0.099261-20.274766 0.158612-21.623483 0.158612-22.981411 0-52.871161-31.298843-81.888032-73.29533-81.888032l-116.892267 0.122797c0-27.751041-27.105335-50.245358-54.855352-50.245358L441.349917 129.189338c-27.744901 0-55.727209 22.494317-55.727209 50.245358l-117.013017-0.122797c-46.387493 0-73.29533 35.359322-73.29533 81.888032 0 1.363044 0.054235 2.706645 0.158612 22.981411l636.281561 0L831.749418 284.181341zM614.168937 444.615287c0-15.32708 12.421914-27.750017 27.744901-27.750017 15.32708 0 27.750017 12.422937 27.750017 27.750017l0 317.882907c0 15.328104-12.422937 27.751041-27.750017 27.751041-15.322987 0-27.744901-12.422937-27.744901-27.751041L614.168937 444.615287 614.168937 444.615287zM485.85862 444.615287c0-15.32708 12.42703-27.750017 27.751041-27.750017 15.32708 0 27.750017 12.422937 27.750017 27.750017l0 317.882907c0 15.328104-12.422937 27.751041-27.750017 27.751041-15.322987 0-27.751041-12.422937-27.751041-27.751041L485.85862 444.615287 485.85862 444.615287zM357.63733 444.615287c0-15.32708 12.422937-27.750017 27.751041-27.750017 15.321964 0 27.750017 12.422937 27.750017 27.750017l0 317.882907c0 15.328104-12.42703 27.751041-27.750017 27.751041-15.328104 0-27.751041-12.422937-27.751041-27.751041L357.63733 444.615287 357.63733 444.615287zM357.63733 444.615287" p-id="1562" fill="#8a8a8a"></path>
          </svg>
        </a>
        </div>
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