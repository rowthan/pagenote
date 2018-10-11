import {  h,app } from "hyperapp"
import style from "./widget.css"
import constant from './constant'
import { getViewPosition } from "./document";

var css = {
  menu:`.menu{
      position:absolute;
      right:0px;
      width: 20px;
      height: 18px;
      transform: scale(1);
      background: #e6e6e6;
      border-radius: 25%;
      text-align:center;
      transition:.5s;
      cursor:pointer;
      box-shadow:0 2px 4px 0 rgba(0,0,0,.04)
  }`,
  easyshare_highlight:`
    .easyshare_highlight{
      background:#f1f1f1;
    }
  `
}

var styles = document.createElement("style")
for(let c in css){
  styles.innerHTML += css[c].replace(/\s*/g,"");
}
document.head.appendChild(styles)

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
    }),
    toggleMenu: value=> state=>({
      showMenu:!state.showMenu
    })
  }

  const aftercreate = (actions)=>{
    setTimeout(()=>{
      actions.refershState()
      if(window.location.search.indexOf("autoreplay")>-1){
        easyshare.replay(0,false,true)
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

  const RecordButton = ({status,onclick}) =>(
    <button onclick={onclick}>
      {status===constant.WAITING && "记录此处"}
      {status===constant.REPLAYING && "结束播放后可进行记录"}
      {status===constant.PLAYANDWAIT && "结束播放后可进行记录"}
    </button>
  )

  const Menu = ({state,actions})=>(
    <div title="菜单"
      id="easyshare-menu"
      style={{
        position:"absolute",
        visibility:state.recordedSteps.length>0?"visible":"hidden",
        right:0,
        top:state.recordedSteps.length*15+20+"px",
      }}
    >
      <div className={style.menu} style="position:absolute;right:0;" onclick={actions.toggleMenu}>
        <svg  viewBox="0 0 8 16" version="1.1" width="20" height="16" aria-hidden="true">
          <path fill-rule="evenodd" d="M8 4v1H0V4h8zM0 8h8V7H0v1zm0 3h8v-1H0v1z"></path>
        </svg>
      </div>
    </div>
  )
  //TODO 在视口范围内则激活 否则关闭
  const StepSign = ({step,running=false,index})=>(
    <span title="点击"
          className={style.stepSign}
          style={{
            top:(index+1)*15+"px",
            transform: `scale(${running?2:1})`,
            //TODO running 增加动画效果
            background: step.isActive?"#cdef5b":"#b7b7b7",
          }}
          onclick={()=>{easyshare.replay(index,step.isActive)}}
    >
    </span>
  )

  const StepTag = ({step,running=false,index})=>(
    <div style={{position:"absolute",top:step.y+"px",left:step.x+"px"}}>
      <aside title="点击查看"  class={`${style.point} ${step.isActive?style.active:""}`}
        onclick={()=>{easyshare.replay(index,step.isActive)}} >
        <svg style={{position:"absolute",display:step.isActive?"":"none"}}  viewBox="0 0 1024 1024" version="1.1" width="10" height="10">
          <path d="M192 448l640 0 0 128-640 0 0-128Z" p-id="4227" fill="#fff"></path>
        </svg>
      </aside>
      {
        step.isActive && 
        <div className={style.box}>
          {step.text}
          <a className={style.delete} onclick={()=>easyshare.remove(index)} title="删除">
            <svg viewBox="0 0 1024 1024" version="1.1" width="20" height="20">
              <path d="M223.595474 318.284043l24.022113 480.742089c0 54.376445 44.989657 98.456383 100.485599 98.456383l331.963601 0c55.494918 0 100.489692-44.078914 100.489692-98.456383l23.109324-480.742089L223.595474 318.284043zM831.749418 284.181341c0.099261-20.274766 0.158612-21.623483 0.158612-22.981411 0-52.871161-31.298843-81.888032-73.29533-81.888032l-116.892267 0.122797c0-27.751041-27.105335-50.245358-54.855352-50.245358L441.349917 129.189338c-27.744901 0-55.727209 22.494317-55.727209 50.245358l-117.013017-0.122797c-46.387493 0-73.29533 35.359322-73.29533 81.888032 0 1.363044 0.054235 2.706645 0.158612 22.981411l636.281561 0L831.749418 284.181341zM614.168937 444.615287c0-15.32708 12.421914-27.750017 27.744901-27.750017 15.32708 0 27.750017 12.422937 27.750017 27.750017l0 317.882907c0 15.328104-12.422937 27.751041-27.750017 27.751041-15.322987 0-27.744901-12.422937-27.744901-27.751041L614.168937 444.615287 614.168937 444.615287zM485.85862 444.615287c0-15.32708 12.42703-27.750017 27.751041-27.750017 15.32708 0 27.750017 12.422937 27.750017 27.750017l0 317.882907c0 15.328104-12.422937 27.751041-27.750017 27.751041-15.322987 0-27.751041-12.422937-27.751041-27.751041L485.85862 444.615287 485.85862 444.615287zM357.63733 444.615287c0-15.32708 12.422937-27.750017 27.751041-27.750017 15.321964 0 27.750017 12.422937 27.750017 27.750017l0 317.882907c0 15.328104-12.42703 27.751041-27.750017 27.751041-15.328104 0-27.751041-12.422937-27.751041-27.751041L357.63733 444.615287 357.63733 444.615287zM357.63733 444.615287" fill="#fff"></path>
            </svg>
          </a>
        </div>
      }
    </div>
  )


  const view = (state, actions) => (
    <div oncreate={()=>{easyshare.onStateChange = function(){actions.refershState()};aftercreate(actions)}}>
      <div style={{position:"absolute",left:state.targetInfo.x+"px",top:state.targetInfo.y+"px",transition:".5s"}}>
        {
          (state.status === constant.WAITING || state.status === constant.PLAYANDWAIT)
          &&
          <RecordButton status={state.status} onclick={(e)=>{record(e,actions)}}></RecordButton>  
        }
      </div>
      <div className={`${style.recordBall} ${state.showBall?style.recording:""}`} 
          style={{top:state.ballPos.top+"px",left:state.ballPos.left+"px"
        }}>
      </div>
      {
        state.recordedSteps.map((record,index)=>(
          <StepTag step={record} index={index}></StepTag>
        ))
      }
      
      <aside style={{position:"fixed",right:0,top:window.innerHeight/2-(state.recordedSteps.length+1)*15/2+"px"}}>
          <div style={{position:"relative",right:"6px"}}>
            {
              state.recordedSteps.map((record,index)=>(
                <StepSign step = {record} running={index===state.runindex} index={index}/>
              ))
            }
          </div>
          <Menu state={state} actions={actions}/>
      </aside>
    </div>
  )
  app(state, actions, view, document.body)
}