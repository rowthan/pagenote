import {  h,app } from "hyperapp"
import whatsPure from 'whats-element/pure'
import style from "./widget/widget.scss"
import { getViewPosition,getScroll } from "./document";
import {throttle} from './utils';
import {clipBoard} from './image-clipboard';
const whats = new whatsPure();
//TODO 增加dev 视图展示所有state信息 方便手机端调试 废弃 使用 preact
export default function widget(pagenote,root){
  const colors = pagenote.options.colors;

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
    showMenu:false,
    showMoreIcon: false,
    barStatus: localStorage.getItem('bar-status')||'left',
    barInfo:pagenote.runningSetting.barInfo,
    colors:[],
    autoLight: pagenote.runningSetting.autoLight,
    activeSteps: pagenote.recordedSteps.filter((step)=>{
      return step.isActive
    }),

  };

  const constant = pagenote.CONSTANT

  const actions = {
    refershState: value => state =>({
      status: pagenote.status,
      steps: pagenote.recordedSteps,
      targetInfo: pagenote.target,
      runindex:pagenote.runindex,
      url:pagenote.url,
      colors: Array.from(new Set(pagenote.recordedSteps.map((step)=>{
        return step.bg
      }))),
      barInfo:pagenote.runningSetting.barInfo,
      autoLight: pagenote.runningSetting.autoLight,
      activeSteps: pagenote.recordedSteps.filter((step)=>{
        return step.isActive
      })
    }),
    setBallPos: value=> state =>({
      ballPos: value
    }),
    toggleShowBall: value=> state => ({
      showBall:value
    }),
    toggleMenu: value=> state=>({
      showMenu:!state.showMenu
    }),
    toggleAutoLight: ()=> state=>{
      pagenote.runningSetting.autoLight = !pagenote.runningSetting.autoLight;
      return {
        autoLight: pagenote.runningSetting.autoLight
      };
    },
    showMore: ()=> state =>{
      return {
        showMoreIcon: !state.showMoreIcon
      }
    },
    toggleSideBar: (e)=> state =>{
      let result = '';
      if(typeof e === 'string'){
        result = e;
        if(state.barStatus.indexOf('hide')>-1){
          result += '-hide';
        }
      }else {
        switch (state.barStatus) {
          case "right":
            result = 'right-hide';
            break;
          case "right-hide":
            result = "right";
            break;
          case "left":
            result = 'left-hide';
            break;
          case "left-hide":
            result = "left";
            break;
        }
      }
      localStorage.setItem('bar-status',result)
      return {
        barStatus: result
      }
    },
  };

  const toggleAllLight = ()=>{
    pagenote.toggleAllLight();
  }

  const record = (e,actions, state)=>{
    e.stopPropagation();
    const color = e.target.dataset.color || colors[0];
    if(state.barStatus.indexOf('hide')>-1){
      pagenote.record({
        bg:color,
      });
      return;
    }

    let {top:startTop,left : startLeft} = getViewPosition(e.currentTarget);
    const targetTop = computeTop(startTop+getScroll().y);
    const targetLeft  = state.barStatus.indexOf('left')>-1?0:document.documentElement.clientWidth-160-10;

    // const a = Math.abs((targetTop/targetLeft-startTop/startLeft)/(targetLeft - startLeft));
    // const b = Math.abs(targetTop/targetLeft - a*targetLeft);

    actions.toggleShowBall(true);


    const xielu = Math.abs((targetTop - startTop)/(targetLeft-startLeft));


    const ratex = startLeft - targetLeft > 0 ? -1 : 1;
    const rateY = startTop - targetTop >0 ? -1 :1;

    const isLeft = startLeft - targetLeft > 0;

    const move = ()=>{
      const hasArrived = (isLeft? targetLeft - startLeft <=1 : startLeft-targetLeft<=1);
      if(hasArrived){
        // startLeft += Math.abs(tempLeft-startLeft)<=10 ? 1*rate : 30*rate;
        // startTop = a*startLeft*startLeft + b*startLeft;
        const stepNumber = Math.abs(targetLeft-startLeft)<=10 ? 1*ratex : 24*ratex;
        startLeft += stepNumber;
        startTop += rateY*Math.abs(stepNumber)*xielu;
        actions.setBallPos({left:startLeft,top:startTop,color:color,isLeft:isLeft,arrived:Math.abs(startLeft-targetLeft)<15});
        window.requestAnimationFrame(move);
      }
      else{
        setTimeout(()=>{
          const result = pagenote.record({
            bg:color,
          });
          if(result){
            actions.toggleShowBall(false);
            actions.setBallPos({
              arrived:false,
            });
          }
        },500)
      }
    };
    window.requestAnimationFrame(move);
  };


  const Menu = ({state,actions})=>(
    <div  id="pagenote-menu">
      <div style='text-align:center' className={style.menuContainer}>
        <a href="javascript:;" className={style.close} onclick={actions.toggleMenu}></a>
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
            初始化方式：
            <label>
              <input type="radio" name='init-type' checked={pagenote.runningSetting.initType === 'default'}
                     onclick={(e) => {
                       pagenote.runningSetting.initType = 'default';
                       actions.refershState()
                       pagenote.makelink()
                     }}
              />默认上次
            </label>
            <label>
              <input type="radio" name='init-type' checked={pagenote.runningSetting.initType === 'light'}
                     onclick={(e) => {
                       pagenote.runningSetting.initType = 'light';
                       actions.refershState()
                       pagenote.makelink()
                     }}
              />点亮所有
            </label>
            <label>
              <input type="radio" name='init-type' checked={pagenote.runningSetting.initType === 'off'}
                     onclick={(e) => {
                       pagenote.runningSetting.initType = 'off';
                       actions.refershState()
                       pagenote.makelink()
                     }}
              />不点亮
            </label>
            {/*<label>*/}
            {/*  <input type="radio" name='init-type' checked={pagenote.runningSetting.initType === 'read'}*/}
            {/*         onclick={(e) => {*/}
            {/*           pagenote.runningSetting.initType = 'read';*/}
            {/*           actions.refershState()*/}
            {/*           pagenote.makelink()*/}
            {/*         }}*/}
            {/*  />阅读模式*/}
            {/*</label>*/}
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

        <p style='text-align:center'>
          <button className={style.menuButton} onclick={() => {
            const result = window.confirm("确认删除所有标记？");
            if (result) {
              pagenote.remove(-1);
              actions.toggleMenu()
            }
          }}>删除所有标记
          </button>
          <button className={style.menuButton}
                  style='margin-left:4px'
                  onclick={toggleAllLight}>
            {`${pagenote.lastaction === pagenote.CONSTANT.DIS_LIGHT ? "点亮" : "隐藏"}所有标记`}
          </button>
        </p>
        <p>
          <a target='_blank' href="https://logike.cn/pagenote">更多介绍</a>
        </p>
        <input style='opacity:0;height:0' value={state.url} readOnly id="pagenote-url"/>
      </div>
    </div>
  )
  //TODO 在视口范围内则激活 否则关闭 <b>{step.text}</b>
  let lastTop = 0;
  let lastIndex = 0;
  function computeTop(top,index) {
    const containerHeight = document.documentElement.clientHeight-40-16;
    let result = top/document.documentElement.scrollHeight * containerHeight + 40+16;
    if(index-lastIndex===1 && lastTop && Math.abs(result-lastTop)<24){ // 同一行最多可以展示同样y值的4个，否则会被覆盖
      result = lastTop + 8;
    }
    result = Math.min(top,result,containerHeight);
    lastTop = result;
    lastIndex = index;
    return result
  }
  const StepSign = ({step,running=false,index})=>(
    <div title="点击"
          className={`${style.stepSign} ${running?style.running:""} ${step.isActive?style.isActive:""}`}
          style={{
            top:computeTop(step.y,index)+"px",
            '--color':step.bg || colors[0],
          }}
          onclick={(e)=>{pagenote.replay(index,true,!step.isActive)}}
    >
      {step.text}
    </div>
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
    const position ={
      x: step.x,
      y: step.y
    };
    const parentNode = whats.getTarget(step.id);
    const ele = parentNode?whats.getUniqueId(parentNode):null;
    if(parentNode && ele && step.offsetX && step.offsetY && step.parentW){
      position.x = ele.left + step.offsetX * parentNode.clientWidth/step.parentW;
      position.y = ele.top + step.offsetY;
    }
    position.x = Math.min(document.documentElement.scrollWidth-200,position.x);

    return (
        <div className={`${style.stepTag}`}
             data-pagenotei={index}
             data-pagenotes={step.isActive?'active':''}
             style={{position:"absolute",top:position.y+"px",left:position.x+"px",textAlign:'left','--bg-color':color}}>
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
              <div className={style.deleteicon} style='right:20px' data-position='top' data-tip='「单击」左边小圆点固定/取消固定；「长按」小圆点可拖拽移动位置。'>
                <svg t="1588584026260" className="icon" viewBox="0 0 1024 1024" version="1.1"
                     xmlns="http://www.w3.org/2000/svg" p-id="13625" width="20" height="20"><path
                    d="M511.44588 958.467471c69.545936 0 125.06132-53.439096 125.186163-119.397321H386.250506c0.124843 66.175165 56.125275 119.397321 125.195374 119.397321z m333.841367-238.668775c-41.733497 0-41.733497-158.00871-41.733496-158.00871V451.163423c0-139.288347-88.399329-256.921487-209.762422-295.096948a76.614935 76.614935 0 0 0 1.123591-13.048177c0-43.840484-37.365003-79.550801-83.468017-79.550801-45.995567 0-83.461877 35.616172-83.461877 79.550801 0 4.480035 0.390903 8.865925 1.140987 13.142321C313.872059 194.461947 219.330846 312.048015 219.330846 451.164447v109.532648s0 157.728324-40.658002 159.102625c-24.238031 0-42.802852 17.793248-42.802852 39.767725 0 22.132066 18.682501 39.766702 41.718147 39.766702h667.700132c23.162536 0 41.733497-17.792225 41.733496-39.766702-0.001023-22.13309-18.681478-39.768749-41.73452-39.768749z"
                    p-id="13626" fill="#ffffff"></path></svg>
              </div>
              <span className={style.deleteicon} onclick={() => {pagenote.remove(index)}} title="删除">
                <svg viewBox="0 0 1024 1024" width="20" height="20">
                  <path
                      d="M223.595 318.284l24.023 480.742c0 54.377 44.99 98.457 100.485 98.457h331.964c55.495 0 100.49-44.08 100.49-98.457l23.109-480.742h-580.07zm608.154-34.103c.1-20.274.159-21.623.159-22.981 0-52.871-31.299-81.888-73.295-81.888l-116.893.123c0-27.751-27.105-50.246-54.855-50.246H441.35c-27.745 0-55.727 22.495-55.727 50.246l-117.013-.123c-46.388 0-73.296 35.36-73.296 81.888 0 1.363.055 2.707.159 22.981h636.282-.006zM614.17 444.615c0-15.327 12.422-27.75 27.745-27.75 15.327 0 27.75 12.423 27.75 27.75v317.883c0 15.328-12.423 27.751-27.75 27.751-15.323 0-27.745-12.423-27.745-27.75V444.614zm-128.31 0c0-15.327 12.427-27.75 27.75-27.75 15.328 0 27.75 12.423 27.75 27.75v317.883c0 15.328-12.422 27.751-27.75 27.751-15.322 0-27.75-12.423-27.75-27.75V444.614zm-128.222 0c0-15.327 12.423-27.75 27.751-27.75 15.322 0 27.75 12.423 27.75 27.75v317.883c0 15.328-12.427 27.751-27.75 27.751-15.328 0-27.75-12.423-27.75-27.75V444.614zm0 0"
                      fill="#fff"/>
                </svg>
              </span>
            </div>
            <div className={`${style.editcontent} ${step.tip?style.showEdit:''}`}
                 onfocus={editStep} contentEditable='true'
                 onpaste={pasteImage}
                 innerHTML={step.tip}
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
                                record(e, actions, state)
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
      <div className={`${style.recordBall} ${state.showBall?style.recording:""} ${state.ballPos.arrived?style.arrived:''}`}
          style={{top:state.ballPos.top+"px",left:state.ballPos.left+"px",background:state.ballPos.color,textAlign: state.ballPos.isLeft?'right':'left'
        }}>
        {pagenote.target.text}
      </div>
      {
        state.steps.map((record,index)=>(
          <StepTag key={index+record.id} step={record} index={index} actions={actions}></StepTag>
        ))
      }
      {
        state.steps.length>0 &&
        <aside className={`${style.sideBar}`} data-status={state.barStatus}>
          {
            state.showMenu &&
            <Menu actions={actions} state={state} />
          }


          <section style='position:relative'>
            {/*<div style={`position:absolute;right:0;top:${computeTop(state.steps[0].y)-20}px`}>*/}
            {/*  {*/}
            {/*    state.colors.map((color)=>(*/}
            {/*        <div style={`display:inline-block;border-radius: 12px;;width:14px;height:14px;background:${color}`}></div>*/}
            {/*    ))*/}
            {/*  }*/}
            {/*</div>*/}
              <div className={style.icons} style={{right:state.barInfo.right+'px',top:state.barInfo.top+'px'}}>
                <div className={style.icon} data-tip='点亮/熄灭「标记」'>
                  <a href="javascript:;" className={`${style.esLight} ${pagenote.highlightAll ? "" : style.lightAll}`}
                     onclick={toggleAllLight}>
                    <svg viewBox="0 0 1000 1000" version="1.1" width="20" height="20">
                      <path
                          d="M634.9 770.3l-4.4 28H393.6l-4.4-28h245.7zM512 931c-30.4 0-55.9-21.6-62-50.2h124c-6.1 28.6-31.6 50.2-62 50.2z m103.5-79.3h-207c-3.4 0-6.4-2.2-7.4-5.5l-2.9-18.9H626l-3 18.9c-1 3.3-4 5.5-7.5 5.5zM384.7 741.3l-8.1-51.9-0.1-0.6c-7.4-30.4-22.6-58.6-43.8-81.7-42.5-46.2-65.9-106.1-65.9-168.7 0-135.1 109.9-245.1 245-245.3h0.3c134 0 244 108.9 245.3 242.9 0.6 62.7-22.5 122.6-65 168.6-21.5 23.2-36.8 51.7-44.3 82.4l-0.1 0.6-8.4 53.6H384.7z"
                          fill="#FFFFFF" p-id="10480"></path>
                      <g id={style.light} style={{opacity:state.activeSteps.length/state.steps.length}}>
                        <path
                            d="M357 741.1l-8-51.9-0.1-0.6c-7.4-30.4-22.4-58.6-43.5-81.7-42.2-46.2-65.4-106.1-65.4-168.7 0-135.1 109-245.1 243.1-245.3h0.3c133 0 242.1 108.9 243.3 242.9 0.6 62.7-22.3 122.6-64.5 168.6-21.3 23.2-36.5 51.7-43.9 82.4l-0.1 0.6-8.3 53.6H357z"
                            p-id="10481"></path>
                      </g>
                      <path
                          d="M605.8 770.8l-4.3 28H370.4l-4.3-28h239.7zM587 852.2H384.9c-3.3 0-6.3-2.2-7.2-5.5l-2.9-18.9h222.3l-2.9 18.9c-1 3.3-3.9 5.5-7.2 5.5z"
                          fill="#E87A66" p-id="10482"></path>

                      <path d="M484.9 931c-29 0-53.4-21.6-59.2-50.2H544c-5.8 28.6-30.1 50.2-59.1 50.2z" fill="#65D5EF"
                            p-id="10483">
                      </path>

                      <path
                          d="M512 164.1h-0.3c-73.2 0.1-142 28.6-193.7 80.4-51.7 51.8-80.2 120.6-80.2 193.9 0 35.2 6.6 69.7 19.7 102.6 12.7 31.8 30.8 60.7 53.8 85.7 17.8 19.3 30.5 42.9 36.8 68.4l24.5 157 0.1 0.6c4 16.5 18.7 28 35.7 28h12c6.4 44.7 45 79.2 91.5 79.2s85.1-34.5 91.5-79.2h12c17 0 31.7-11.5 35.7-28l0.1-0.6 5.6-35.7c0.2-0.9 0.4-1.8 0.4-2.7l18.9-120.4c6.4-25.7 19.3-49.6 37.3-69.1 47.5-51.5 73.3-118.5 72.7-188.6-0.7-72.6-29.6-140.9-81.5-192.2-51.6-51.1-120.1-79.3-192.6-79.3z m122.9 606.2l-4.4 28H393.6l-4.4-28h245.7zM512 931c-30.4 0-55.9-21.6-62-50.2h124c-6.1 28.6-31.6 50.2-62 50.2z m103.5-79.3h-207c-3.4 0-6.4-2.2-7.4-5.5l-2.9-18.9H626l-3 18.9c-1 3.3-4 5.5-7.5 5.5z m76.8-247c-21.5 23.2-36.8 51.7-44.3 82.4l-0.1 0.6-8.4 53.6h-113V570.8c0-8-6.5-14.5-14.5-14.5s-14.5 6.5-14.5 14.5v170.5H384.7l-8.1-51.9-0.1-0.6c-7.4-30.4-22.6-58.6-43.8-81.7-42.5-46.2-65.9-106.1-65.9-168.7 0-135.1 109.9-245.1 245-245.3h0.3c134 0 244 108.9 245.3 242.9 0.4 62.8-22.6 122.6-65.1 168.7z"
                          fill="#274359" p-id="10484">
                      </path>
                      <g id={style.sunshine}>
                        <path
                            d="M512 467c-8 0-14.5 6.5-14.5 14.5v29.7c0 8 6.5 14.5 14.5 14.5s14.5-6.5 14.5-14.5v-29.7c0-8-6.5-14.5-14.5-14.5zM511.4 146.9c8 0 14.5-6.5 14.5-14.5V78.5c0-8-6.5-14.5-14.5-14.5s-14.5 6.5-14.5 14.5v53.8c0 8.1 6.5 14.6 14.5 14.6zM281.4 234.1c2.8 2.8 6.5 4.3 10.3 4.3 3.7 0 7.4-1.4 10.3-4.3 5.7-5.7 5.7-14.9 0-20.5l-38.1-38.1c-5.7-5.7-14.9-5.7-20.5 0-5.7 5.7-5.7 14.9 0 20.5l38 38.1zM201 429.4h-53.8c-8 0-14.5 6.5-14.5 14.5s6.5 14.5 14.5 14.5H201c8 0 14.5-6.5 14.5-14.5 0.1-8-6.4-14.5-14.5-14.5zM282.3 653.4l-38.1 38.1c-5.7 5.7-5.7 14.9 0 20.5 2.8 2.8 6.5 4.3 10.3 4.3 3.7 0 7.4-1.4 10.3-4.3l38.1-38.1c5.7-5.7 5.7-14.9 0-20.5-5.8-5.7-14.9-5.7-20.6 0zM742.6 652.5c-5.7-5.7-14.9-5.7-20.5 0-5.7 5.7-5.7 14.9 0 20.5l38.1 38.1c2.8 2.8 6.5 4.3 10.3 4.3s7.4-1.4 10.3-4.3c5.7-5.7 5.7-14.9 0-20.5l-38.2-38.1zM876.8 428.2H823c-8 0-14.5 6.5-14.5 14.5s6.5 14.5 14.5 14.5h53.8c8 0 14.5-6.5 14.5-14.5s-6.5-14.5-14.5-14.5zM731.4 237.5c3.7 0 7.4-1.4 10.3-4.3l38.1-38.1c5.7-5.7 5.7-14.9 0-20.5-5.7-5.7-14.9-5.7-20.5 0l-38.1 38.1c-5.7 5.7-5.7 14.9 0 20.5 2.8 2.9 6.5 4.3 10.2 4.3z"
                            fill="#274359" p-id="10485">
                        </path>
                      </g>
                    </svg>
                  </a>
                </div>
                <div className={style.icon} onclick={actions.toggleSideBar} data-tip='显示/隐藏「大纲」'>
                  <svg t="1588559997149" className="icon" viewBox="0 0 1024 1024" version="1.1"
                       xmlns="http://www.w3.org/2000/svg" p-id="24444" width="20" height="20">
                    <path
                        d="M152.3 467.8v88.3h90.5v-88.3h-90.5zM64 602.5v-181h896v180.9H64z m178.8-315.6v-88.3h-90.5v88.3h90.5zM64 152.3h896v180.9H64V152.3z m88.3 584.8v88.3h90.5v-88.3h-90.5zM64 871.7V690.8h896v180.9H64z"
                        p-id="24445" fill={state.barStatus.indexOf('hide')===-1?'#03a9f4':'#515151'}></path>
                  </svg>
                </div>
                <div className={style.icon} onclick={actions.toggleAutoLight.bind(actions)} data-tip='开启/关闭「自动点亮模式」'>
                  <svg t="1588601864954" className="icon" viewBox="0 0 1024 1024" version="1.1"
                       xmlns="http://www.w3.org/2000/svg" p-id="25957" width="20" height="20">
                    <path
                        d="M510.677 83.529c60.891 0 119.75 13.191 174.046 38.055l-40.087 70.028 202.97-1.016-101.99-175.063-35.52 61.909c-61.908-29.433-129.903-44.657-199.419-44.657-257.266 0-466.833 209.566-466.833 466.833 0 93.368 27.4 183.69 79.668 261.326l42.116-28.415c-46.684-69.012-71.039-149.183-71.039-232.91 0-229.355 186.729-416.09 416.088-416.09z m425.225 223.774l-46.175 20.802c24.356 53.788 37.039 111.637 37.039 171.512 0 229.358-186.73 416.089-416.089 416.089-46.684 0-92.351-7.608-135.99-22.832l34-65.968-202.468 10.148 110.116 170.5 35.52-69.012c50.738 18.777 104.526 27.908 159.33 27.908 257.265 0 466.832-209.567 466.832-466.833-0.507-66.98-14.715-131.93-42.115-192.314z m0 0"
                        p-id="25958" fill={state.autoLight? '#03a9f4' : '#515151'} ></path>
                    <path
                        d="M317.096 1023.06L192.387 829.965 421.78 818.47l-36.039 69.924c40.06 12.971 82.045 19.543 124.936 19.543 225.147 0 408.317-183.17 408.317-408.317 0-58.417-12.23-115.043-36.348-168.305l-3.212-7.094 60.343-27.186 3.203 7.059c27.889 61.462 42.292 127.226 42.81 195.467 0 261.757-212.908 474.664-474.606 474.664-54.211 0-106.5-8.76-155.546-26.05l-38.54 74.885zM220.05 844.143l95.524 147.906 32.521-63.187 6.458 2.39c49.176 18.198 101.874 27.425 156.632 27.425 253.126 0 459.06-205.933 459.06-459.06-0.48-63.377-13.353-124.59-38.275-182.018l-32.013 14.422c22.95 53.205 34.582 109.55 34.582 167.595 0 233.719-190.143 423.862-423.862 423.862-47.682 0-94.297-7.828-138.55-23.266l-8.448-2.948 31.914-61.92-175.543 8.8z m-98.64-72.405l-4.345-6.455C64.08 686.583 36.071 594.717 36.071 499.617c0-261.698 212.907-474.605 474.605-474.605 68.724 0 134.705 14.25 196.232 42.368L745.564 0.005 861.09 198.301l-229.898 1.151 42.514-74.27c-51.835-22.486-106.64-33.88-163.03-33.88-225.147 0-408.317 183.17-408.317 408.316 0 82.11 24.104 161.145 69.705 228.556l4.36 6.445-55.014 37.12zM510.677 40.557c-253.126 0-459.06 205.934-459.06 459.06 0 89.396 25.578 175.828 74.053 250.495l29.221-19.715c-44.563-68.554-68.074-148.169-68.074-230.78 0-233.717 190.143-423.861 423.861-423.861 61.471 0 121.117 13.04 177.283 38.76l7.738 3.543-37.618 65.714 176.044-0.882-88.458-151.83-32.41 56.489-6.498-3.09C645.482 55.329 579.51 40.558 510.677 40.558z"
                        p-id="25959" fill={state.autoLight ? '#03a9f4' : '#515151'} ></path>
                    <path
                        d="M320.113 320.409h383.973v63.55H320.113z m0.184 127.952H704.27v63.55H320.297z m-0.184 127.803h383.973v63.55H320.113z"
                        p-id="25960" fill={state.autoLight ? '#03a9f4' : '#515151'} ></path>
                  </svg>
                </div>
                <div  className={`${style.moreIcons} ${state.showMoreIcon?style.showMore:''}`}>
                  {/*<div className={style.icon}>*/}
                  {/*  <svg t="1588649921056" className="icon" viewBox="0 0 1024 1024" version="1.1"*/}
                  {/*       xmlns="http://www.w3.org/2000/svg" p-id="19009" width="20" height="20">*/}
                  {/*    <path*/}
                  {/*        d="M874 150c-96.7-96.7-225.3-150-362-150s-265.3 53.3-362 150c-96.7 96.7-150 225.3-150 362 0 99.6 28.6 196.2 82.9 279.3 10.7 16.5 32.8 21.1 49.3 10.4 16.5-10.7 21.1-32.8 10.4-49.3-46.6-71.5-71.3-154.6-71.3-240.4 0-243 197.7-440.8 440.8-440.8s440.8 197.7 440.8 440.8c0 243-197.7 440.8-440.8 440.8-80.5 0-159.2-21.9-227.7-63.3-16.8-10.2-38.7-4.8-48.9 12-10.2 16.8-4.8 38.7 12.1 48.9 79.6 48.1 171.1 73.6 264.5 73.6 136.8 0 265.3-53.3 362-150 96.7-96.7 150-225.3 150-362-0.1-136.8-53.4-265.3-150.1-362zM220.6 778.9c0 19.7 15.9 35.6 35.6 35.6 19.7 0 35.6-15.9 35.6-35.6 0-120.8 98.2-219 219-219s219 98.2 219 219c0 19.7 15.9 35.6 35.6 35.6 19.7 0 35.6-15.9 35.6-35.6 0-119-72-221.4-174.6-266.2 55.3-37.3 91.7-100.5 91.7-172 0-114.3-93-207.3-207.3-207.3-114.3 0-207.3 93-207.3 207.3 0 71.5 36.4 134.7 91.7 172-102.6 44.8-174.6 147.2-174.6 266.2z m154.1-438.2c0-75 61-136.1 136.1-136.1s136.1 61 136.1 136.1-61 136.1-136.1 136.1-136.1-61.1-136.1-136.1z"*/}
                  {/*        p-id="19010" fill="#515151"></path>*/}
                  {/*  </svg>*/}
                  {/*</div>*/}
                  <div className={style.icon} onclick={() => actions.toggleSideBar('left')} data-tip='侧边栏移动至「左侧」'>
                    <svg t="1588558990021" className="icon" viewBox="0 0 1024 1024" version="1.1"
                         xmlns="http://www.w3.org/2000/svg" p-id="1442" width="20" height="20">
                      <path
                          d="M316.8 278.4h403.2c32 0 57.6-28.8 57.6-67.2V96c0-35.2-25.6-64-57.6-64H316.8c-32 0-57.6 28.8-57.6 64v118.4c0 35.2 25.6 64 57.6 64z m6.4-182.4h390.4v118.4H323.2V96zM121.6 32c-19.2 0-32 12.8-32 32v883.2c0 19.2 12.8 32 32 32s32-12.8 32-32V64c0-19.2-12.8-32-32-32zM876.8 348.8H326.4c-38.4 0-67.2 28.8-67.2 64v115.2c0 35.2 32 64 67.2 64h550.4c35.2 0 67.2-28.8 67.2-64v-115.2c0-35.2-32-64-67.2-64z m0 179.2H326.4h-3.2v-115.2H880v112c0 3.2-3.2 3.2-3.2 3.2zM908.8 780.8H358.4l89.6-89.6c12.8-12.8 12.8-32 0-44.8s-32-12.8-44.8 0l-144 144c-12.8 12.8-12.8 32 0 44.8l144 147.2c6.4 6.4 16 9.6 22.4 9.6 9.6 0 16-3.2 22.4-9.6 12.8-12.8 12.8-32 0-44.8l-89.6-92.8h550.4c19.2 0 32-12.8 32-32s-12.8-32-32-32z"
                          fill={state.barStatus.indexOf('left') > -1 ? '#03a9f4' : '#515151'} p-id="1443"></path>
                    </svg>
                  </div>
                  <div className={style.icon} onclick={() => actions.toggleSideBar('right')} data-tip='侧边栏移动至「右侧」'>
                    <svg t="1588559060117" className="icon" viewBox="0 0 1024 1024" version="1.1"
                         xmlns="http://www.w3.org/2000/svg" p-id="16821" width="20" height="20">
                      <path
                          d="M313.6 278.4h400c32 0 57.6-28.8 57.6-64V99.2c0-35.2-25.6-64-57.6-64H313.6c-32 0-57.6 28.8-57.6 64v115.2c0 35.2 25.6 64 57.6 64z m6.4-179.2h387.2v115.2H320V99.2zM908.8 35.2c-19.2 0-32 12.8-32 32v876.8c0 19.2 12.8 32 32 32s32-12.8 32-32V67.2c0-19.2-12.8-32-32-32zM160 592h547.2c35.2 0 67.2-28.8 67.2-64v-115.2c0-35.2-28.8-64-67.2-64H160c-35.2 0-67.2 28.8-67.2 64v115.2c0 35.2 32 64 67.2 64z m0-179.2H710.4v112l-3.2 3.2H160h-3.2V416c0-3.2 3.2-3.2 3.2-3.2zM630.4 643.2c-12.8-12.8-32-12.8-44.8 0-12.8 12.8-12.8 32 0 44.8l89.6 92.8H128c-19.2 0-32 12.8-32 32s12.8 32 32 32h544l-86.4 89.6c-12.8 12.8-12.8 32 0 44.8 6.4 6.4 12.8 9.6 22.4 9.6 9.6 0 16-3.2 22.4-9.6l140.8-144c12.8-12.8 12.8-32 0-44.8l-140.8-147.2z"
                          fill={state.barStatus.indexOf('right') > -1 ? '#03a9f4' : '#515151'} p-id="16822"></path>
                    </svg>
                  </div>
                  {/*<div className={style.icon} data-tip='加密数据'>*/}
                  {/*  <svg t="1588592660142" className="icon" viewBox="0 0 1024 1024" version="1.1"*/}
                  {/*       xmlns="http://www.w3.org/2000/svg" p-id="25118" width="20" height="20">*/}
                  {/*    <path*/}
                  {/*        d="M545.21304594 737.1963773v62.65074468a29.27604937 29.27604937 0 0 1-33.37469531 26.34844406 29.27604937 29.27604937 0 0 1-33.37469625-26.34844406v-62.65074469a77.28876938 77.28876938 0 1 1 67.04215218 0z m348.677745-162.18931219v-93.09783563a93.09783562 93.09783562 0 0 0-95.43992063-90.17023125H225.22583A93.09783562 93.09783562 0 0 0 129.78591031 481.90922948v414.54885469a92.80507594 92.80507594 0 0 0 95.43991969 90.17023125h573.22504031a93.09783562 93.09783562 0 0 0 95.43992063-90.17023125v-29.27604937h-125.00872969V817.11999136h125.00872969v-67.33491281h-125.00872969V700.01579479h125.00872969v-74.94668531h-125.00872969v-50.06204437z"*/}
                  {/*        fill="#515151" p-id="25119"></path>*/}
                  {/*    <path*/}
                  {/*        d="M313.05397719 264.38818542A150.47889187 150.47889187 0 0 1 463.24010937 114.49481386h97.19648251a150.47889187 150.47889187 0 0 1 150.47889187 150.47889187v105.39377719h106.56481875V231.59901042a204.93234375 204.93234375 0 0 0-204.93234375-204.93234375H412.00702344a204.93234375 204.93234375 0 0 0-204.93234375 204.93234375v137.30466938h105.9792975z"*/}
                  {/*        fill="#515151" p-id="25120"></path>*/}
                  {/*  </svg>*/}
                  {/*</div>*/}
                  {/*<div className={style.icon} data-tip='共享公开'>*/}
                  {/*  <svg t="1588592456193" className="icon" viewBox="0 0 1024 1024" version="1.1"*/}
                  {/*       xmlns="http://www.w3.org/2000/svg" p-id="24156" width="20" height="20">*/}
                  {/*    <path*/}
                  {/*        d="M637.86979 476.931641C637.86979 471.563628 633.486259 467.180096 628.128609 467.180096 626.076743 467.180096 624.190684 467.843325 622.646603 468.848533L561.919664 518.010409 527.680448 294.833727C527.680448 286.646989 521.037791 279.993968 512.851054 279.993968 504.591775 279.993968 497.938756 286.646989 497.938756 294.833727L445.263836 638.376178 371.707553 578.872068C369.676413 577.483432 367.220392 576.633668 364.577838 576.633668 357.613929 576.633668 351.945391 582.281482 351.945391 589.286841 351.945391 591.483789 352.556806 593.577106 353.593101 595.349173L353.541286 595.380261 353.924716 595.97095C354.059435 596.188572 354.163063 596.395831 354.318508 596.572002L433.284255 716.512889 391.801331 986.758131C391.55262 987.90842 391.397175 989.017257 391.293545 990.208997L391.283183 990.208997C391.189916 991.141663 391.138101 992.053604 391.138101 992.955182 391.138101 1009.121397 404.257607 1022.220177 420.403098 1022.220177L606.69801 1022.220177 606.780914 1022.116547C622.221723 1021.308237 634.512192 1008.592886 634.512192 992.955182 634.512192 992.053604 634.450014 991.141663 634.336021 990.240085L634.336021 990.167545C634.253119 989.017257 634.066584 987.90842 633.838599 986.758131L571.660846 581.307364 636.076999 482.538001C636.159902 482.403282 636.263532 482.268564 636.346436 482.123483L636.667688 481.636425 636.626236 481.636425C637.393095 480.206336 637.86979 478.600077 637.86979 476.931641"*/}
                  {/*        p-id="24157" fill="#515151"></path>*/}
                  {/*    <path*/}
                  {/*        d="M933.763356 273.724379C868.818694 137.783084 740.141833 38.049967 586.376247 13.344673L586.355521 13.344673C583.484982 12.753984 580.458998 12.401643 577.401926 12.401643 553.173328 12.401643 533.545883 32.049814 533.545883 56.299137 533.545883 76.786707 547.618782 93.95813 566.645174 98.735454L566.603722 98.901262C616.646451 106.186422 663.424848 123.254215 705.166847 148.021687 703.726394 147.990598 702.285943 147.85588 700.804041 147.886969 657.227797 148.757457 622.594789 184.748014 623.444551 228.324255 624.294315 271.879772 660.315959 306.574959 703.881839 305.673381 747.458081 304.833981 782.111817 268.812336 781.241327 225.267183 781.106608 217.847305 779.85269 210.665774 777.800825 203.940214 808.734258 234.282957 834.610566 269.755365 853.750952 309.227876 860.341793 326.813817 877.865556 338.83485 897.617357 337.612021 921.752688 336.088666 940.126214 315.248755 938.57177 291.071972 938.188341 284.802382 936.468089 278.94731 933.763356 273.724379"*/}
                  {/*        p-id="24158" fill="#515151"></path>*/}
                  {/*    <path*/}
                  {/*        d="M975.463903 415.624375 975.463903 415.624375C973.391312 391.99683 952.831202 374.224354 929.058574 375.768435 904.902517 377.260702 886.539354 398.090249 888.093797 422.277396 888.228516 424.46398 888.591219 426.629838 889.026463 428.723156 890.87107 443.946342 891.907366 459.480418 891.907366 475.232115 891.907366 516.124352 885.389065 555.524321 873.419847 592.426817 865.430006 554.767825 830.890264 527.627236 791.324487 530.135071 747.831148 532.912344 714.814761 570.40553 717.571308 613.909232 720.338217 657.43366 757.862492 690.387868 801.345468 687.631322 812.713634 686.905914 823.34603 683.765938 832.8385 678.822807 803.646044 724.741077 764.857489 764.006329 719.33301 793.789473 705.032128 800.99173 695.187317 815.758946 695.187317 832.909643 695.187317 857.127878 714.814761 876.734596 739.032996 876.734596 749.655029 876.734596 759.416936 872.972843 767.002621 866.630711 894.75718 783.188166 979.204932 638.925414 979.204932 474.952316 979.204932 454.879265 977.930288 435.023835 975.463903 415.624375"*/}
                  {/*        p-id="24159" fill="#515151"></path>*/}
                  {/*    <path*/}
                  {/*        d="M489.700204 56.299137C489.700204 32.049814 470.062397 12.401643 445.854524 12.401643 442.766363 12.401643 439.771467 12.753984 436.86984 13.344673L436.849114 13.344673C283.104255 38.049967 154.396304 137.783084 89.503455 273.724379 86.777997 278.94731 85.068109 284.802382 84.653591 291.071972 83.140599 315.248755 101.46231 336.088666 125.639093 337.612021 145.38053 338.83485 162.914657 326.813817 169.484773 309.227876 188.645884 269.755365 214.491103 234.282957 245.434898 203.940214 243.372669 210.665774 242.160203 217.774764 241.984033 225.225731 241.144633 268.812336 275.777643 304.833981 319.343522 305.673381 362.94049 306.574959 398.951772 271.879772 399.780809 228.324255 400.640934 184.748014 366.018288 148.757457 322.462773 147.886969 320.98087 147.85588 319.519691 147.990598 318.068878 148.021687 359.810876 123.254215 406.599636 106.186422 456.632001 98.901262L456.621639 98.735454C475.596217 93.95813 489.700204 76.786707 489.700204 56.299137"*/}
                  {/*        p-id="24160" fill="#515151"></path>*/}
                  {/*    <path*/}
                  {/*        d="M303.913075 793.789473C258.336782 764.006329 219.579317 724.741077 190.38686 678.822807 199.879332 683.765938 210.501365 686.905914 221.900619 687.631322 265.393957 690.387868 302.897506 657.43366 305.654053 613.909232 308.44169 570.40553 275.435665 532.912344 231.931964 530.135071 192.335097 527.627236 157.826444 554.767825 149.815876 592.426817 137.867385 555.524321 131.328358 516.124352 131.328358 475.232115 131.328358 459.480418 132.354291 443.946342 134.20926 428.723156 134.665231 426.629838 135.017571 424.46398 135.15229 422.277396 136.686007 398.090249 118.34357 377.260702 94.187513 375.768435 70.383796 374.224354 49.865138 391.99683 47.761457 415.624375 45.326162 435.023835 44.030792 454.879265 44.030792 474.952316 44.030792 638.925414 128.478544 783.188166 256.212376 866.630711 263.808425 872.972843 273.570332 876.734596 284.192366 876.734596 308.420964 876.734596 328.038044 857.127878 328.038044 832.909643 328.038044 815.758946 318.213959 800.99173 303.913075 793.789473"*/}
                  {/*        p-id="24161" fill="#515151"></path>*/}
                  {/*  </svg>*/}
                  {/*</div>*/}
                  <div className={style.icon} data-tip='「分享功能」敬请期待'>
                    <svg t="1588566551449" className="icon" viewBox="0 0 1024 1024" version="1.1"
                         xmlns="http://www.w3.org/2000/svg" p-id="18007" width="20" height="20">
                      <path
                          d="M838.284171 330.523147 837.725258 287.969701 714.845258 419.334273C703.255161 431.724638 703.903906 451.164645 716.294273 462.754742 728.684638 474.344839 748.124645 473.696094 759.714742 461.305727L882.594742 329.941156C893.854693 317.903731 893.608051 299.125248 882.035829 287.38771L759.155829 162.752281C747.244306 150.670594 727.793967 150.532649 715.712281 162.444171 703.630594 174.355693 703.492649 193.806032 715.404171 205.887719L838.284171 330.523147Z"
                          p-id="18008" fill="#515151"></path>
                      <path
                          d="M204.933213 153.6C142.666561 153.6 92.16 204.043003 92.16 266.254734L92.16 798.793535C92.16 861.000106 142.464635 911.448269 204.598858 911.448269L778.441148 911.448269C840.512004 911.448269 890.880006 860.966865 890.880006 798.91141L890.880006 563.023553C890.880006 546.057366 877.126193 532.303553 860.160006 532.303553 843.193819 532.303553 829.440006 546.057366 829.440006 563.023553L829.440006 798.91141C829.440006 827.065383 806.548658 850.008269 778.441148 850.008269L204.598858 850.008269C176.436258 850.008269 153.6 827.106855 153.6 798.793535L153.6 266.254734C153.6 237.992709 176.581629 215.04 204.933213 215.04L389.12 215.04C406.086187 215.04 419.84 201.286187 419.84 184.32 419.84 167.353813 406.086187 153.6 389.12 153.6L204.933213 153.6Z"
                          p-id="18009" fill="#515151"></path>
                      <path
                          d="M460.8 471.04C460.8 397.496685 520.297624 337.92 593.730632 337.92L839.68 337.92C856.646187 337.92 870.4 324.166187 870.4 307.2 870.4 290.233813 856.646187 276.48 839.68 276.48L593.730632 276.48C486.346971 276.48 399.36 363.58256 399.36 471.04L399.36 634.88C399.36 651.846187 413.113813 665.6 430.08 665.6 447.046187 665.6 460.8 651.846187 460.8 634.88L460.8 471.04Z"
                          p-id="18010" fill="#515151"></path>
                    </svg>
                  </div>

                  {/*<div>*/}
                  {/*  <svg t="1588559170914" className="icon" viewBox="0 0 1024 1024" version="1.1"*/}
                  {/*       xmlns="http://www.w3.org/2000/svg" p-id="3138" width="20" height="20">*/}
                  {/*    <path d="M512 512m-512 0a512 512 0 1 0 1024 0 512 512 0 1 0-1024 0Z" fill="#515151" opacity=".5"*/}
                  {/*          p-id="3139"></path>*/}
                  {/*    <path*/}
                  {/*        d="M332.105143 586.99581l-8.43581-27.221334a11.385905 11.385905 0 0 0-10.873904-8.009143h-24.149334a11.385905 11.385905 0 0 0-10.947047 8.228572l-7.692191 26.770285a11.385905 11.385905 0 0 1-10.947047 8.240762h-15.908572a11.385905 11.385905 0 0 1-10.776381-15.055238l48.88381-143.250285a11.385905 11.385905 0 0 1 10.776381-7.704381h17.444571c4.864 0 9.191619 3.08419 10.764191 7.68l49.310476 143.238095a11.385905 11.385905 0 0 1-10.764191 15.091809h-15.811047a11.385905 11.385905 0 0 1-10.873905-8.009142zM300.860952 479.451429l-11.239619 37.424761h21.991619l-10.752-37.424761z m89.063619-50.468572h15.238096c6.290286 0 11.398095 5.10781 11.398095 11.398095v85.101715c0 27.428571 11.946667 37.436952 28.68419 37.436952 16.737524 0 28.928-9.99619 28.928-36.973714v-85.577143c0-6.278095 5.10781-11.373714 11.385905-11.373714h14.774857c6.278095 0 11.385905 5.095619 11.385905 11.385904v84.175238c0 51.151238-26.782476 72.777143-66.474667 72.777143-39.92381 0-66.706286-21.162667-66.706285-72.082285v-84.870096c0-6.290286 5.095619-11.385905 11.385904-11.385904z m173.177905 154.636191v-108.129524a11.385905 11.385905 0 0 0-11.385905-11.385905h-21.942857a11.385905 11.385905 0 0 1-11.385904-11.385905v-12.336762c0-6.290286 5.095619-11.385905 11.385904-11.385904h104.667429c6.290286 0 11.385905 5.095619 11.385905 11.385904v12.336762a11.385905 11.385905 0 0 1-11.385905 11.385905h-22.186667a11.385905 11.385905 0 0 0-11.385905 11.385905v108.129524a11.385905 11.385905 0 0 1-11.373714 11.385904h-15.006476a11.385905 11.385905 0 0 1-11.385905-11.385904zM724.23619 426.666667c46.140952 0 80.335238 33.950476 80.335239 85.089523 0 51.858286-34.913524 85.577143-80.335239 85.577143-45.909333 0-80.091429-32.792381-80.091428-85.577143 0-50.44419 33.706667-85.089524 80.091428-85.089523z m0 35.108571c-25.819429 0-42.325333 20.699429-42.325333 49.980952 0 31.634286 16.505905 50.468571 42.325333 50.468572 25.58781 0 42.556952-19.065905 42.556953-50.468572 0-29.281524-16.018286-49.980952-42.556953-49.980952z"*/}
                  {/*        fill="#515151" p-id="3140"></path>*/}
                  {/*    <path*/}
                  {/*        d="M512 1024c282.770286 0 512-229.229714 512-512S794.770286 0 512 0 0 229.229714 0 512s229.229714 512 512 512z m0-24.380952C242.70019 999.619048 24.380952 781.29981 24.380952 512S242.70019 24.380952 512 24.380952s487.619048 218.319238 487.619048 487.619048-218.319238 487.619048-487.619048 487.619048z"*/}
                  {/*        fill="#515151" p-id="3141"></path>*/}
                  {/*  </svg>*/}
                  {/*</div>*/}
                  {/*<div>*/}
                  {/*  <svg t="1588559222371" className="icon" viewBox="0 0 1024 1024" version="1.1"*/}
                  {/*       xmlns="http://www.w3.org/2000/svg" p-id="4047" width="20" height="20">*/}
                  {/*    <path*/}
                  {/*        d="M399.9856 795.68v-52.192h-168.48c-28.288 0-37.696-10.048-37.696-37.728v-402.272c0-29.568 8.768-37.728 39.552-37.728h278.528v-83.584c0-4.448-8.192-9.44-13.856-11.936a62.88 62.88 0 1 1 48.416 0c-5.664 0-13.824 10.656-14.432 16.32v77.952h276.576c34.56 0 42.752 8.192 42.752 42.752v390.368c0 37.088-8.192 44.64-46.528 44.64h-150.848a31.168 31.168 0 0 0-8.8 0v54.688h54.048a28.992 28.992 0 0 1 32.704 32.064v111.264a30.24 30.24 0 0 1-33.952 33.984H346.5776a29.6 29.6 0 0 1-33.984-33.984v-108.736c0-25.76 8.768-33.952 35.232-34.56h47.776l4.384-1.312z m-87.392-291.68a62.88 62.88 0 0 0 125.728 0 62.848 62.848 0 0 0-62.848-58.432 58.432 58.432 0 0 0-62.88 58.432z m359.584-62.848a62.88 62.88 0 0 0-62.848 62.848 62.848 62.848 0 0 0 121.92 0 62.848 62.848 0 0 0-59.104-60.96v-1.888z m234.464 176v-226.272a112.544 112.544 0 0 1 117.504 110.624 113.6 113.6 0 0 1-117.504 115.648z m-770.656 0a115.008 115.008 0 1 1 0-226.304v226.304z"*/}
                  {/*        p-id="4048" fill="#515151"></path>*/}
                  {/*  </svg>*/}
                  {/*</div>*/}
                  <div className={style.icon} data-tip='打开/关闭菜单配置'>
                    <a href="javascript:;" onclick={actions.toggleMenu}>
                      <svg t="1584782208424" className="icon" viewBox="0 0 1024 1024" version="1.1"
                           xmlns="http://www.w3.org/2000/svg"
                           p-id="6119" width="20" height="20">
                        <path
                            d="M844.8 883.2h-256c-19.2 0-38.4-19.2-38.4-38.4v-256c0-19.2 19.2-38.4 38.4-38.4h256c19.2 0 38.4 19.2 38.4 38.4v256c0 19.2-19.2 38.4-38.4 38.4z m0-403.2h-256c-19.2 0-38.4-19.2-38.4-38.4v-256c0-19.2 19.2-38.4 38.4-38.4h256c19.2 0 38.4 19.2 38.4 38.4v256c0 19.2-19.2 38.4-38.4 38.4zM435.2 883.2h-256c-19.2 0-38.4-19.2-38.4-38.4v-256c0-19.2 19.2-38.4 38.4-38.4h256c19.2 0 38.4 19.2 38.4 38.4v256c6.4 19.2-12.8 38.4-38.4 38.4z m0-403.2h-256c-19.2 0-38.4-19.2-38.4-38.4v-256c0-19.2 19.2-38.4 38.4-38.4h256c19.2 0 38.4 19.2 38.4 38.4v256c6.4 19.2-12.8 38.4-38.4 38.4z"
                            p-id="6120" fill="#8a8a8a"></path>
                      </svg>
                    </a>
                  </div>
                  <div className={style.icon} data-tip='建议&反馈'>
                    <a target='_blank' href="https://addons.mozilla.org/zh-CN/firefox/addon/page-note/">
                      <svg t="1589452270027" className="icon" viewBox="0 0 1024 1024" version="1.1"
                           xmlns="http://www.w3.org/2000/svg" p-id="2360" width="20" height="20">
                        <path
                            d="M789.4528 1005.13792H234.5472c-57.6768 0-111.70816-22.41536-152.54528-63.13472-40.7296-40.72448-63.13472-94.8736-63.13472-152.5504V234.43456c0-57.56416 22.40512-111.70816 63.13472-152.43264C122.72128 41.27232 176.8704 18.8672 234.5472 18.8672H512a44.75392 44.75392 0 0 1 44.81536 44.82048A44.75904 44.75904 0 0 1 512 108.50816H234.5472c-33.67424 0-65.29536 13.0816-89.07264 36.85888-23.88992 23.88992-36.97152 55.51104-36.97152 89.06752V789.4528c0 33.66912 13.0816 65.29024 36.85888 89.07264 23.88992 23.87968 55.51104 36.9664 89.18528 36.9664h554.9056c33.66912 0 65.29024-13.08672 89.06752-36.9664 23.88992-23.78752 36.97664-55.40352 36.97664-89.07264V512c0-24.79616 20.01408-44.81536 44.81536-44.81536s44.8256 20.0192 44.8256 44.81536v277.45792c0 57.6768-22.41536 111.81568-63.13472 152.5504-40.7296 40.6016-94.8736 63.1296-152.5504 63.1296z m42.7776-676.39808v-0.11264l132.06528-132.0704-132.40832-132.41344-132.18816 132.06528-0.56832 0.68096-396.89728 396.77952-49.93536 153.92256c-4.21376 12.84608 15.81056 32.64512 28.55424 28.54912l153.91744-50.048 397.46048-397.35296z"
                            fill="#515151" p-id="2361"></path>
                      </svg>
                    </a>
                  </div>
                  {/*<div className={style.icon} data-tip='敬请期待...'>*/}
                  {/*  <svg t="1588557448430" className="icon" viewBox="0 0 1024 1024" version="1.1"*/}
                  {/*       xmlns="http://www.w3.org/2000/svg" p-id="4969" width="20" height="20">*/}
                  {/*    <path*/}
                  {/*        d="M635.67620506 384.69059696c-119.84190754 0-216.99978913 97.15788163-216.99978916 216.99978914s97.15788163 216.99978913 216.99978916 216.99978912c119.82850089 0 216.99978913-97.14447499 216.99978913-216.99978912-0.01340662-119.85531414-97.17128827-216.99978913-216.99978913-216.99978914z m5.17496099 394.9728647c-97.27854134 0-176.14977325-78.8712319-176.14977325-176.14977324 0-97.27854134 78.8712319-176.14977325 176.14977325-176.14977325S817.00093927 506.23514708 817.00093927 603.51368842c0 97.27854134-78.8712319 176.14977325-176.14977322 176.14977324z"*/}
                  {/*        p-id="4970" fill="#515151"></path>*/}
                  {/*    <path*/}
                  {/*        d="M771.3781614 763.40121377l35.01812983-36.0504407 150.85145357 146.53451721-35.01812982 36.05044067zM253.09107082 403.91571111h172.61042165v48.59905076H253.09107082zM253.09107082 221.25031341h439.06728618v53.62653876h-439.06728618zM252.24645283 578.20196211h107.25307754v50.27488011h-107.25307754zM253.09107082 752.48821313h149.14881095v46.92322141H253.09107082z"*/}
                  {/*        p-id="4971" fill="#515151"></path>*/}
                  {/*    <path*/}
                  {/*        d="M669.52795765 928.7318328c-2.92264637 0.1876929-5.81847947 0.44241893-8.76793908 0.44241895H286.13842532c-79.44771719 0-143.85319027 15.02883749-143.85319026-64.40547307V185.92383099c0-79.44771719 64.40547307-80.922447 143.85319026-80.922447h374.60818659c79.46112383 0 143.85319027 7.46749553 143.85319027 86.91521272v159.52554621h39.20099984V153.37252195c0-88.84576813-72.0338482-97.19810151-160.87961632-97.1981015H263.97725819c-88.84576813 0-160.87961633 1.64901605-160.87961633 90.49478418v759.17750274c0 88.84576813 72.0338482 72.0338482 160.87961633 72.0338482h405.55069946v-49.14872277z"*/}
                  {/*        p-id="4972" fill="#515151"></path>*/}
                  {/*  </svg>*/}
                  {/*</div>*/}
                  <div id='drag-bar' onmousedown={addMove} draggable='true' className={`${style.icon} ${style.moveIcon}`} data-tip='拖拽菜单栏位置'>
                    <svg t="1588585290337" className="icon" viewBox="0 0 1024 1024" version="1.1"
                         xmlns="http://www.w3.org/2000/svg" p-id="18962" width="20" height="20">
                      <path
                          d="M951.990857 512a30.317714 30.317714 0 0 1-9.691428 22.016l-124.964572 125.842286c-6.473143 6.473143-14.08 9.691429-22.893714 9.691428s-16.128-3.218286-22.016-9.691428-8.813714-13.787429-8.813714-22.016v-63.378286h-189.184v189.184h63.378285c8.228571 0 15.542857 2.925714 22.016 8.813714s9.691429 13.202286 9.691429 22.016-3.218286 16.128-9.691429 22.016l-125.842285 125.842286c-5.851429 6.473143-13.202286 9.691429-22.016 9.691429s-16.128-3.218286-22.016-9.691429l-125.842286-125.842286c-6.473143-5.851429-9.691429-13.202286-9.691429-22.016s3.218286-16.128 9.691429-22.016 13.787429-8.813714 22.016-8.813714h63.341714v-189.184H260.278857v63.378286c0 8.228571-2.925714 15.542857-8.813714 22.016s-13.202286 9.691429-22.016 9.691428-16.128-3.218286-22.016-9.691428l-125.842286-125.842286c-6.473143-6.473143-9.691429-13.787429-9.691428-22.016s3.218286-15.542857 9.691428-22.016l125.842286-125.842286c5.851429-6.473143 13.202286-9.691429 22.016-9.691428s16.128 3.218286 22.016 9.691428 8.813714 13.787429 8.813714 22.016v63.341715h189.184V260.315429h-63.341714c-8.228571 0-15.542857-2.925714-22.016-8.813715s-9.691429-13.202286-9.691429-22.016 3.218286-16.420571 9.691429-22.893714l125.842286-124.964571c6.473143-6.473143 13.787429-9.691429 22.016-9.691429s15.542857 3.218286 22.016 9.691429l125.842285 124.964571c6.473143 6.473143 9.691429 14.08 9.691429 22.893714s-3.218286 16.128-9.691429 22.016-13.787429 8.813714-22.016 8.813715h-63.341714v189.184h189.184v-63.341715c0-8.228571 2.925714-15.542857 8.813714-22.016s13.202286-9.691429 22.016-9.691428 16.420571 3.218286 22.893715 9.691428l124.964571 125.842286c6.473143 5.851429 9.691429 13.202286 9.691429 22.016z"
                          p-id="18963" fill="#707070"></path>
                    </svg>
                  </div>
                </div>

                <div className={style.icon} onclick={actions.showMore} data-tip='展开/收起「更多」'>
                  <svg t="1588562067087" className="icon" viewBox="0 0 1024 1024" version="1.1"
                       xmlns="http://www.w3.org/2000/svg" p-id="9034" width="20" height="20">
                    <path
                        d="M511.85863686 138.59041405c-206.05802536 0-373.10368537 167.04488754-373.10368538 373.1029129s167.04488754 373.1029129 373.10368538 373.1029129 373.1029129-167.04488754 373.1029129-373.1029129S717.91588974 138.59041405 511.85863686 138.59041405z m0 693.83966446c-177.138834 0-320.73829651-143.59791756-320.73829651-320.73752404S334.71980286 190.95503044 511.85863686 190.95503044 832.59616089 334.55449295 832.59616089 511.69332695 688.99747085 832.43007851 511.85863686 832.43007851z"
                        p-id="9035" fill="#515151"></path>
                    <path
                        d="M466.03921127 505.14736366a51.17268562 51.17268562 0 1 0 104.73077774 0 51.17268562 51.17268562 0 1 0-104.73077774 0zM308.94304466 505.14736366a51.17268562 51.17268562 0 1 0 104.73077775 0 51.17268562 51.17268562 0 1 0-104.73077775 0zM623.13460541 505.14736366a51.17268562 51.17268562 0 1 0 104.73155021 0 51.17268562 51.17268562 0 1 0-104.73077773 0z"
                        p-id="9036" fill="#515151"></path>
                  </svg>
                </div>
              </div>

            {
              state.steps.map((record, index) => (
                  <StepSign key={index + '-' + record.y} step={record} running={index === state.runindex}
                            index={index}/>
              ))
            }
          </section>
        </aside>
      }
    </div>
  )
  // root = document.createElement("div");
  root.id = pagenote.id;
  root.dataset.pagenote = root.id;

  app(state, actions, view, root)


  let dragStepIndex;
  let timer;
  let movingTarget;
  root.addEventListener('mousedown',function (e) {
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
      document.body.style.userSelect='auto';
      dragStepIndex = -1;
    },200);
  });


  // TODO 用requestAnimation 来处理
  document.addEventListener('mousemove',throttle(function (e) {
    if(dragStepIndex>=0){
      if(e.pageY<10||e.pageX<0){
        return;
      }
      document.body.style.userSelect='none';
      const step = pagenote.recordedSteps[dragStepIndex];
      step.x = e.pageX;
      step.y = e.pageY;
      const whatsEl = whats.getTarget(step.id);
      if(whatsEl){
        const elementinfo = whats.getUniqueId(whatsEl);
        step.offsetX = step.x - elementinfo.left;
        step.offsetY = step.y - elementinfo.top;
        step.parentW = whatsEl.clientWidth;
      }


      pagenote.makelink();
      actions.refershState();
      movingTarget.dataset.moving = '1';
      clearTimeout(timer);
      window.getSelection().removeAllRanges();
      timer = setTimeout(function () {
        movingTarget.dataset.moving = '0';
      }, 500);
    }
  },16));



  const addMove = function (event) {
    event.stopPropagation()
    event.currentTarget.ondrag = throttle(function(e){
      const origin = pagenote.runningSetting.barInfo;
      origin.right = Math.max(2,(document.documentElement.clientWidth-e.clientX-10));
      origin.right = Math.min(origin.right,document.documentElement.clientWidth-20)
      origin.top = Math.max(Math.min(document.documentElement.clientHeight-200, e.clientY-185),0);


      pagenote.makelink();
      actions.refershState();
    },30);
  }

  setTimeout(()=>{
    checkActive();
  },1000);
  // 所有的全局监听事件，放到core中，开放listener，
  document.addEventListener("scroll", throttle(function (e) {
    // 重新计算相对位置。
    checkActive()
  },200));
  window.addEventListener('resize',throttle(function () {
    pagenote.makelink();
    actions.refershState()
  },500));

  function checkActive() {
    const isReadMode = pagenote.runningSetting.autoLight;
    if(!isReadMode) return;
    const innerHeight = document.documentElement.clientHeight;
    pagenote.recordedSteps.forEach((step,index)=>{
      const element = whats.getTarget(step.id);

      let position = {};
      if(element){
        position = whats.compute(element)
      } else {
        position = {
          viewTop: step.y,
          viewLeft: step.x,
        }
      }

      const result = position.viewTop > 0 && position.viewTop < innerHeight && position.viewLeft>0//step.y > scroll.y && step.y < scroll.y + innerHeight;
      pagenote.replay(index,false,result,false)
    });
    actions.refershState();
  }
}
