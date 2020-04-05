import {  h,app } from "hyperapp"
import style from "./widget.css"
import { getViewPosition } from "./document";
import {throttle} from './utils';
import {clipBoard} from './image-clipboard';

//TODO 增加dev 视图展示所有state信息 方便手机端调试
export default function widget(pagenote,colors){
  colors = colors || ['rgba(114,208,255,0.88)','#ffbea9','#c8a6ff','#6fe2d5','rgba(255,222,93,0.84)','rgba(251, 181, 214, 0.84)','rgba(0,0,0,0.5)'];

  const state = {
    //来自easyshare的状态
    status: "",
    steps: pagenote.recordedSteps,
    targetInfo: pagenote.target,
    runindex:null,
    url:pagenote.url,

    //自定义state
    ballPos:{},
    showBall:false,
    showMenu:false
  }

  const constant = pagenote.CONSTANT

  const actions = {
    refershState: value => state =>({
      status: pagenote.status,
      steps: pagenote.recordedSteps,
      targetInfo: pagenote.target,
      runindex:pagenote.runindex,
      url:pagenote.url
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

  const toggleAllLight = ()=>{
    pagenote.replay(0,false,pagenote.lastaction===pagenote.CONSTANT.DIS_LIGHT,true);
    // pagenote.highlightAll=!pagenote.highlightAll
  }

  const record = (e,actions)=>{
    e.stopPropagation()

    let {top:startTop,left : startLeft} = getViewPosition(e.currentTarget)
    let {top:targetTop,left: targetLeft} = getViewPosition(document.getElementById("pagenote-menu"))

    const a = (targetTop/targetLeft-startTop/startLeft)/(targetLeft - startLeft);
    const b = targetTop/targetLeft - a*targetLeft;


    actions.toggleShowBall(true)
    const move = setInterval(()=>{
      if(startLeft<=targetLeft){
        startLeft += targetLeft-startLeft<=10 ? 1 : 30;
        startTop = a*startLeft*startLeft + b*startLeft
        actions.setBallPos({left:startLeft,top:startTop})
      }
      else{
        actions.toggleShowBall(false);
        pagenote.record({
          bg:e.target.dataset.color || colors[0],
        });
        clearInterval(move)
    }
    },10)
  }


  const Menu = ({state,actions})=>(
    <div
      id="pagenote-menu"
      style={{
        zIndex:99999,
        position:"absolute",
        visibility:state.steps.length>0?"visible":"hidden",
        right:'0px',
        top:state.steps.length*15+20+"px",
      }}
    >
      <div style='cursor:pointer' onclick={actions.toggleMenu}>
        <svg t="1584782208424" className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
             p-id="6119" width="20" height="20">
          <path
              d="M844.8 883.2h-256c-19.2 0-38.4-19.2-38.4-38.4v-256c0-19.2 19.2-38.4 38.4-38.4h256c19.2 0 38.4 19.2 38.4 38.4v256c0 19.2-19.2 38.4-38.4 38.4z m0-403.2h-256c-19.2 0-38.4-19.2-38.4-38.4v-256c0-19.2 19.2-38.4 38.4-38.4h256c19.2 0 38.4 19.2 38.4 38.4v256c0 19.2-19.2 38.4-38.4 38.4zM435.2 883.2h-256c-19.2 0-38.4-19.2-38.4-38.4v-256c0-19.2 19.2-38.4 38.4-38.4h256c19.2 0 38.4 19.2 38.4 38.4v256c6.4 19.2-12.8 38.4-38.4 38.4z m0-403.2h-256c-19.2 0-38.4-19.2-38.4-38.4v-256c0-19.2 19.2-38.4 38.4-38.4h256c19.2 0 38.4 19.2 38.4 38.4v256c6.4 19.2-12.8 38.4-38.4 38.4z"
              p-id="6120" fill="#8a8a8a"></path>
        </svg>
      </div>
      {
        state.showMenu &&
        <div style='text-align:center' className={style.menuContainer}>
          <a href="javascript:;" className={style.close} onclick={actions.toggleMenu}></a>
          {/*TODO 可配置*/}
          {/*<div style="">*/}
          {/*  复制地址栏URL或 <a href="javascript:;" onclick={(e)=>{*/}
          {/*    const url = document.getElementById("pagenote-url");*/}
          {/*    url.focus();*/}
          {/*    url.setSelectionRange(0, url.value.length);*/}
          {/*    document.execCommand('copy', true);*/}
          {/*    e.target.innerText = "已复制"*/}
          {/*    }}>获取链接</a>*/}
          {/*</div>*/}

          <p style='text-align:left'>
            <div>
              初始化时：
              <label>
                <input type="radio" name='init-type' checked={pagenote.runningSetting.initType==='default'}
                       onclick={(e)=>{pagenote.runningSetting.initType = 'default';
                         actions.refershState()
                         pagenote.makelink()
                       }}
                />默认上次
              </label>
              <label>
                <input type="radio" name='init-type' checked={pagenote.runningSetting.initType==='light'}
                       onclick={(e)=>{pagenote.runningSetting.initType = 'light';
                         actions.refershState()
                         pagenote.makelink()
                       }}
                />点亮所有
              </label>
              <label>
                <input type="radio" name='init-type' checked={pagenote.runningSetting.initType==='off'}
                       onclick={(e)=>{pagenote.runningSetting.initType = 'off';
                         actions.refershState()
                         pagenote.makelink()
                       }}
                />不点亮
              </label>
            </div>
            <div>
              点亮速度：
              <label>
                <input type="radio" name='duration' checked={pagenote.runningSetting.dura == 50}
                       onclick={(e) => {
                         pagenote.runningSetting.dura = 50;
                         actions.refershState()
                         pagenote.makelink()
                       }}
                />快
              </label>
              <label>
                <input type="radio" name='duration' checked={pagenote.runningSetting.dura == 150}
                       onclick={(e) => {
                         pagenote.runningSetting.dura = 150;
                         actions.refershState()
                         pagenote.makelink()
                       }}
                />适中
              </label>
              <label>
                <input type="radio" name='duration' checked={pagenote.runningSetting.dura == 500}
                       onclick={(e) => {
                         pagenote.runningSetting.dura = 500;
                         actions.refershState()
                         pagenote.makelink()
                       }}
                />慢
              </label>
            </div>
          </p>
          {/* TODO 使用说明 使用手册 */}
          <p style='text-align:center'>
            <button className={style.menuButton} onclick={()=>{const result = window.confirm("确认删除所有标记？");if(result){pagenote.remove(-1);actions.toggleMenu()}}}>删除所有标记</button>
            <button className={style.menuButton}
                    style='margin-left:4px'
                    onclick={toggleAllLight}>
              {`${pagenote.lastaction===pagenote.CONSTANT.DIS_LIGHT?"点亮":"隐藏"}所有标记`}
            </button>
          </p>
          <div>
            <h4>赞助一下</h4>
            <div>
              <img width={200} height={100} src="https://logike.cn/images/zhifu.png" alt="支付"/>
            </div>
          </div>
          <input style='opacity:0;height:0' value={state.url} readonly id="pagenote-url"/>
        </div>
      }
    </div>
  )
  //TODO 在视口范围内则激活 否则关闭
  const StepSign = ({step,running=false,index})=>(
    <span title="点击"
          className={`${style.stepSign} ${running?style.running:""} ${step.isActive?style.isActive:""}`}
          style={{
            top:(index+1)*15+"px",
            '--color':step.bg || colors[0],
            //TODO running 增加动画效果
          }}
          onclick={()=>{pagenote.replay(index,true,!step.isActive)}}
    >
    </span>
  );

  const StepTag = ({step,index,actions})=>{
    const editStep = function(e) {
      pagenote.replay(index,false);
      setTimeout(()=>{e.target.focus();},100)
    };
    const pasteImage = (e)=>{
      clipBoard(e,function (result) {
        e.target.blur();
        const image = document.createElement('img');
        image.src = result;
        step.tip = step.tip + image.outerHTML;
        step.modify = undefined;
        pagenote.makelink();
        actions.refershState();
        e.target.focus();
      })
    };
    const color = step.bg || colors[0];
    return (
        <div className={`${style.stepTag}`}
             data-pagenotei={index}
             data-pagenotes={step.isActive?'active':''}
             style={{position:"absolute",top:step.y+"px",left:step.x+"px",textAlign:'left','--bg-color':color}}>
          <div title="点击激活/长按拖拽移动"
               class={`${style.point}  draggable ${step.isActive?style.active:style.common}` }
               data-index={index}
               data-active={step.isActive?1:0}
               data-moving='0'
               onclick={(e)=>{if(e.target.dataset.moving==='1'){return};pagenote.replay(index,!step.isActive,!step.isActive);actions.refershState()}} >
            {
              step.warn &&
                  <b style='position:absolute;top:-2px;left:5px;font-size:12px;font-weight:bold;color: #de1c1c;'>!</b>
            }
          </div>

          <div className={`${style.box} ${step.isActive? style.show :""}` }>
            <div className={`${style.handlebar}`} >
              {step.warn || '点击下方可修改'}
              <span className={style.deleteicon} onclick={() => {pagenote.remove(index)}} title="删除">
                <svg viewBox="0 0 1024 1024" width="20" height="20">
                  <path
                      d="M223.595 318.284l24.023 480.742c0 54.377 44.99 98.457 100.485 98.457h331.964c55.495 0 100.49-44.08 100.49-98.457l23.109-480.742h-580.07zm608.154-34.103c.1-20.274.159-21.623.159-22.981 0-52.871-31.299-81.888-73.295-81.888l-116.893.123c0-27.751-27.105-50.246-54.855-50.246H441.35c-27.745 0-55.727 22.495-55.727 50.246l-117.013-.123c-46.388 0-73.296 35.36-73.296 81.888 0 1.363.055 2.707.159 22.981h636.282-.006zM614.17 444.615c0-15.327 12.422-27.75 27.745-27.75 15.327 0 27.75 12.423 27.75 27.75v317.883c0 15.328-12.423 27.751-27.75 27.751-15.323 0-27.745-12.423-27.745-27.75V444.614zm-128.31 0c0-15.327 12.427-27.75 27.75-27.75 15.328 0 27.75 12.423 27.75 27.75v317.883c0 15.328-12.422 27.751-27.75 27.751-15.322 0-27.75-12.423-27.75-27.75V444.614zm-128.222 0c0-15.327 12.423-27.75 27.751-27.75 15.322 0 27.75 12.423 27.75 27.75v317.883c0 15.328-12.427 27.751-27.75 27.751-15.328 0-27.75-12.423-27.75-27.75V444.614zm0 0"
                      fill="#fff"/>
                </svg>
              </span>
            </div>
            {/*<div className={style.refer}>*/}
            {/*  {step.text}*/}
            {/*</div>*/}
            <div className={`${style.editcontent}`}
                 onfocus={editStep} contentEditable='true'
                 onpaste={pasteImage}
                 innerHTML={step.tip||'输入笔记'}
                // 节流处理 oninput
                 oninput={
                   (e)=>{
                     const value = e.target.innerHTML;
                     step.modify = value;
                   }
                 }
                 onblur={()=>{
                   const value = step.modify!==undefined?step.modify:step.tip ;
                   const originTip = step.tip;
                   step.tip = value;
                   const url = pagenote.makelink();
                   !url && alert('error')
                   // step.writing = !url;
                   step.tip = url?value:originTip;
                   actions.refershState()
                 }}
                >
            </div>
          </div>

        </div>
    )
  }


  const p = 38//360/(colors.length-1);
  const view = (state, actions) => (
    <div
      id='pagenote'
      oncreate={()=>{pagenote.addListener(actions.refershState); setTimeout(()=>{actions.refershState()},0)}}>
      <div style={{
        position:"absolute",
        zIndex:999999,
        left:state.targetInfo.x +"px",
        top:state.targetInfo.y+"px",
        transition:".5s",
        userSelect:"none",
        textAlign:'left'
        }}>
        {
          (state.status === constant.WAITING || state.status === constant.PLAYANDWAIT)
          &&
          <div className={style.recordContain}>
            {
              colors.map((color,index)=>{

                  const hudu = (2*Math.PI / 360) * p * (index-colors.length+1);
                  const offsetX = index===0?0:Number.parseFloat(20*Math.sin(hudu)).toFixed(3);
                  const offsetY = index===0?0:Number.parseFloat(20*Math.cos(hudu)).toFixed(3);
                  const translate = `translate(${offsetX}px,${offsetY}px)`;

                  return <div className={style.recordButton}
                              data-color={color}
                              style={{
                                '--color': color,
                                transform:translate,
                                top:(offsetY/-1)+'px',
                                left:(offsetX/-1)+'px'}}
                                onclick={(e) => {
                                record(e, actions)
                              }}>
                    {
                      index===0 &&
                      <svg t="1584087258159" className="icon" viewBox="0 0 1024 1024" version="1.1"
                           xmlns="http://www.w3.org/2000/svg" p-id="15434" width="26" height="26">
                        <path
                            d="M768 128h-32V96c0-19.2-12.8-32-32-32s-32 12.8-32 32v32H544V96c0-19.2-12.8-32-32-32s-32 12.8-32 32v32H352V96c0-19.2-12.8-32-32-32s-32 12.8-32 32v32h-32c-35.2 0-64 32-64 70.4v694.4c0 35.2 28.8 67.2 64 67.2h512c35.2 0 64-32 64-70.4V198.4c0-38.4-28.8-70.4-64-70.4z m-96 640H352c-19.2 0-32-12.8-32-32s12.8-32 32-32h320c19.2 0 32 12.8 32 32s-12.8 32-32 32z m0-192H352c-19.2 0-32-12.8-32-32s12.8-32 32-32h320c19.2 0 32 12.8 32 32s-12.8 32-32 32z m0-192H352c-19.2 0-32-12.8-32-32s12.8-32 32-32h320c19.2 0 32 12.8 32 32s-12.8 32-32 32z"
                            p-id="15435" fill="#ffffff"></path>
                      </svg>
                    }
                    {/*{status===constant.WAITING && "标记此处"}*/}
                    {/*{[constant.REPLAYING,constant.PLAYANDWAIT].indexOf(status)>-1 && "结束播放后可进行记录"}*/}
                  </div>
              })
            }
          </div>
        }
      </div>
      <div className={`${style.recordBall} ${state.showBall?style.recording:""}`}
          style={{top:state.ballPos.top+"px",left:state.ballPos.left+"px"
        }}>
      </div>
      {
        state.steps.map((record,index)=>(
          <StepTag key={index} step={record} index={index} actions={actions}></StepTag>
        ))
      }

      <aside style={{position:"fixed",right:'10px',
        zIndex:99999,
        top:window.innerHeight/2-(state.steps.length+7)*15/2+"px"}}>
          {
            state.steps.length > 0 &&
            <a href="javascript:;" className={`${style.esLight} ${pagenote.highlightAll?"":style.lightAll}`} onclick={toggleAllLight}>
              <svg viewBox="0 0 1000 1000" version="1.1" width="25" height="25">
              <path d="M634.9 770.3l-4.4 28H393.6l-4.4-28h245.7zM512 931c-30.4 0-55.9-21.6-62-50.2h124c-6.1 28.6-31.6 50.2-62 50.2z m103.5-79.3h-207c-3.4 0-6.4-2.2-7.4-5.5l-2.9-18.9H626l-3 18.9c-1 3.3-4 5.5-7.5 5.5zM384.7 741.3l-8.1-51.9-0.1-0.6c-7.4-30.4-22.6-58.6-43.8-81.7-42.5-46.2-65.9-106.1-65.9-168.7 0-135.1 109.9-245.1 245-245.3h0.3c134 0 244 108.9 245.3 242.9 0.6 62.7-22.5 122.6-65 168.6-21.5 23.2-36.8 51.7-44.3 82.4l-0.1 0.6-8.4 53.6H384.7z" fill="#FFFFFF" p-id="10480"></path>
                <g id={style.light}>
                  <path d="M357 741.1l-8-51.9-0.1-0.6c-7.4-30.4-22.4-58.6-43.5-81.7-42.2-46.2-65.4-106.1-65.4-168.7 0-135.1 109-245.1 243.1-245.3h0.3c133 0 242.1 108.9 243.3 242.9 0.6 62.7-22.3 122.6-64.5 168.6-21.3 23.2-36.5 51.7-43.9 82.4l-0.1 0.6-8.3 53.6H357z" p-id="10481"></path>
                </g>
                <path d="M605.8 770.8l-4.3 28H370.4l-4.3-28h239.7zM587 852.2H384.9c-3.3 0-6.3-2.2-7.2-5.5l-2.9-18.9h222.3l-2.9 18.9c-1 3.3-3.9 5.5-7.2 5.5z" fill="#E87A66" p-id="10482"></path>

                <path d="M484.9 931c-29 0-53.4-21.6-59.2-50.2H544c-5.8 28.6-30.1 50.2-59.1 50.2z" fill="#65D5EF" p-id="10483">
                </path>

                <path d="M512 164.1h-0.3c-73.2 0.1-142 28.6-193.7 80.4-51.7 51.8-80.2 120.6-80.2 193.9 0 35.2 6.6 69.7 19.7 102.6 12.7 31.8 30.8 60.7 53.8 85.7 17.8 19.3 30.5 42.9 36.8 68.4l24.5 157 0.1 0.6c4 16.5 18.7 28 35.7 28h12c6.4 44.7 45 79.2 91.5 79.2s85.1-34.5 91.5-79.2h12c17 0 31.7-11.5 35.7-28l0.1-0.6 5.6-35.7c0.2-0.9 0.4-1.8 0.4-2.7l18.9-120.4c6.4-25.7 19.3-49.6 37.3-69.1 47.5-51.5 73.3-118.5 72.7-188.6-0.7-72.6-29.6-140.9-81.5-192.2-51.6-51.1-120.1-79.3-192.6-79.3z m122.9 606.2l-4.4 28H393.6l-4.4-28h245.7zM512 931c-30.4 0-55.9-21.6-62-50.2h124c-6.1 28.6-31.6 50.2-62 50.2z m103.5-79.3h-207c-3.4 0-6.4-2.2-7.4-5.5l-2.9-18.9H626l-3 18.9c-1 3.3-4 5.5-7.5 5.5z m76.8-247c-21.5 23.2-36.8 51.7-44.3 82.4l-0.1 0.6-8.4 53.6h-113V570.8c0-8-6.5-14.5-14.5-14.5s-14.5 6.5-14.5 14.5v170.5H384.7l-8.1-51.9-0.1-0.6c-7.4-30.4-22.6-58.6-43.8-81.7-42.5-46.2-65.9-106.1-65.9-168.7 0-135.1 109.9-245.1 245-245.3h0.3c134 0 244 108.9 245.3 242.9 0.4 62.8-22.6 122.6-65.1 168.7z" fill="#274359" p-id="10484">
                </path>
                <g id={style.sunshine}>
                  <path d="M512 467c-8 0-14.5 6.5-14.5 14.5v29.7c0 8 6.5 14.5 14.5 14.5s14.5-6.5 14.5-14.5v-29.7c0-8-6.5-14.5-14.5-14.5zM511.4 146.9c8 0 14.5-6.5 14.5-14.5V78.5c0-8-6.5-14.5-14.5-14.5s-14.5 6.5-14.5 14.5v53.8c0 8.1 6.5 14.6 14.5 14.6zM281.4 234.1c2.8 2.8 6.5 4.3 10.3 4.3 3.7 0 7.4-1.4 10.3-4.3 5.7-5.7 5.7-14.9 0-20.5l-38.1-38.1c-5.7-5.7-14.9-5.7-20.5 0-5.7 5.7-5.7 14.9 0 20.5l38 38.1zM201 429.4h-53.8c-8 0-14.5 6.5-14.5 14.5s6.5 14.5 14.5 14.5H201c8 0 14.5-6.5 14.5-14.5 0.1-8-6.4-14.5-14.5-14.5zM282.3 653.4l-38.1 38.1c-5.7 5.7-5.7 14.9 0 20.5 2.8 2.8 6.5 4.3 10.3 4.3 3.7 0 7.4-1.4 10.3-4.3l38.1-38.1c5.7-5.7 5.7-14.9 0-20.5-5.8-5.7-14.9-5.7-20.6 0zM742.6 652.5c-5.7-5.7-14.9-5.7-20.5 0-5.7 5.7-5.7 14.9 0 20.5l38.1 38.1c2.8 2.8 6.5 4.3 10.3 4.3s7.4-1.4 10.3-4.3c5.7-5.7 5.7-14.9 0-20.5l-38.2-38.1zM876.8 428.2H823c-8 0-14.5 6.5-14.5 14.5s6.5 14.5 14.5 14.5h53.8c8 0 14.5-6.5 14.5-14.5s-6.5-14.5-14.5-14.5zM731.4 237.5c3.7 0 7.4-1.4 10.3-4.3l38.1-38.1c5.7-5.7 5.7-14.9 0-20.5-5.7-5.7-14.9-5.7-20.5 0l-38.1 38.1c-5.7 5.7-5.7 14.9 0 20.5 2.8 2.9 6.5 4.3 10.2 4.3z" fill="#274359" p-id="10485">
                  </path>
                </g>
              </svg>
            </a>
          }

          <div style={{position:"relative",right:"6px"}}>
            {
              state.steps.map((record,index)=>(
                <StepSign  key={index} step = {record} running={index===state.runindex} index={index}/>
              ))
            }
          </div>
          <Menu state={state} actions={actions}/>
      </aside>
    </div>
  )
  const root = document.createElement("div");
  root.id = pagenote.id;
  root.dataset.pagenote = root.id;
  document.body.append(root)
  app(state, actions, view, root)


  let dragStepIndex;
  let timer;
  // let moving = false;
  let movingTarget;
  document.addEventListener('mousedown',function (e) {
    const target = e.target;
    // 点击过200ms后再设置
    setTimeout(()=>{
      if(target.classList.contains('draggable') && target.dataset.active==1){
        dragStepIndex = target.dataset.index;
        movingTarget = target;
      }
    },200)
  });

  // 清除移动标识
  document.addEventListener('mouseup',function (e) {
    setTimeout(()=>{
      document.body.style.userSelect='unset';
      dragStepIndex = -1;
    },200);
  });


  document.addEventListener('mousemove',throttle(function (e) {
    if(dragStepIndex>=0){
      document.body.style.userSelect='none';
      const step = pagenote.recordedSteps[dragStepIndex];
      step.x = e.pageX;
      step.y = e.pageY;
      pagenote.makelink();
      actions.refershState();
      movingTarget.dataset.moving = '1';
      clearTimeout(timer);
      timer = setTimeout(function () {
        movingTarget.dataset.moving = '0';
      }, 300);
    }
  },25));

  // document.addEventListener("scroll", throttle(function (e) {
  //   const tags = document.querySelectorAll('[data-pagenotei]');
  //   [].forEach.call(tags,function (tag) {
  //     if(tag.dataset['pagenotes']!=='active'){
  //       const index = +tag.dataset['pagenotei'];
  //       const position = tag.getBoundingClientRect();
  //       const scrollShow = position.top>0 && position.left>0 && position.left<window.innerWidth;
  //       if(scrollShow){
  //         pagenote.replay(index,false,true);
  //       }
  //     }
  //   })
  // }));
}