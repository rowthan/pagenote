// @ts-nocheck // TODO enable
import md5 from "blueimp-md5";
import {highlightKeywordInElement, removeElementHighlight} from "./utils/highlight";
import { whats } from './utils/index'
import {convertColor} from "./utils/index";
import {gotoPosition, moveable} from "./utils/document";
import Draggable from 'draggable';
import {createElement} from "preact";

export interface StepProps {
  x: number, // 标记在文档中基于 body 的 x轴 位置
  y: number, // 标记在文档中基于 body 的 y轴 位置
  id: string, // 标记的元素节点，在文档中唯一标识符，取值参考 whats-element
  text?: string, // 标记的文本内容
  pre? : string, // 标记的文本内容 上文信息
  suffix?: string, // 标记的文本内容 下文信息
  tip?: string, // 标记的笔记（用户输入）
  bg: string, // 标记背景色
  isActive: boolean, // 是否为激活状态
  offsetX?: boolean, // 批注与高亮元素的相对偏移量
  offsetY?: boolean, // 批注与高亮元素的相对偏移量
  parentW?: number, // 高亮元素父节点宽度
  lightId?: string, // 每一条标记的唯一 hash id
  level: number, // 高亮层级
  images?: string[], // 图片高亮，待支持
  lightBg?: string, // 将废弃
  daskBg?: string, // 将废弃
  isFocus?: boolean, // 将废弃
  [other: string]: any,
}

class Step {
    private lightBg: string;
    private darkBg: string;
    private lightId: any;
    private relatedNode: any[];
    private isInview: boolean;
    private isFocus: boolean;
    constructor(info: StepProps,pagenote:object) {
      pagenote.CONSTANT.STORE_KEYS_VERSION_2_VALIDATE.forEach((key: string)=>{
        this[key] = info[key];
        });
        const {rgb}:object = convertColor(info.bg);
        this.lightBg = `rgb(${(rgb[0]+10)},${(rgb[1]+10)},${(rgb[2]+10)})`;
        this.darkBg = `rgb(${(rgb[0]-30)},${(rgb[1]-30)},${(rgb[2]-30)})`;
        this.lightId = md5(info.id+info.text);
        this.isFocus = false; // 是否 hover focus
        // noinspection JSConstantReassignment
        this.relatedNode = []; // 关联的dom元素
        this.isInview = false; // 是否在视野内
        this.level = info.level === undefined ? 1 : info.level
        this.pagenote = pagenote
    }

    protected pagenote;

    public delete (e: { stopPropagation: () => any; }) {
      const pagenote = this.pagenote;
      for(let i=0; i<pagenote.recordedSteps.length; i++){
        if(this.lightId===pagenote.recordedSteps[i].lightId){
          this.relatedNode.forEach((element: any)=>{
            removeElementHighlight(element);
          })
          pagenote.remove(i);
          break;
        }
      }
      e && e.stopPropagation();
    }

}

Step.prototype.toggle = function (isLight: Boolean,goto=true) {
  let light = typeof isLight=='boolean' ? isLight :!this.isActive;
  console.log(light,isLight,this.isActive)
  const pagenote = this.pagenote;
  for(let i=0; i<pagenote.recordedSteps.length; i++){
    if(this.lightId===pagenote.recordedSteps[i].lightId){
      pagenote.replay(i, goto, false, light);
      break;
    }
  }
};

Step.prototype.highlight = function (isActiveLight){
  const runStep = this;
  runStep.isActive = isActiveLight;

  if(this.relatedNode && this.relatedNode.length){
    this.relatedNode.forEach((element)=>{
      element.dataset.active = isActiveLight ? '1' : '0';
    })
    return;
  }

  const color = runStep.bg;
  // 高亮元素
  const warpFun = function (text,children){
    const light = document.createElement('light');
    const {textColor,rgb} = convertColor(color);
    const bottomColor = `rgb(${(rgb[0]-30)},${(rgb[1]-30)},${(rgb[2]-30)})`;
    const bgColor = `rgba(${rgb.toString()},1)`;
    light.style.backgroundColor=runStep.bg;
    light.style=`--bgcolor:${bgColor};--color:${textColor};--bgbottomcolor:${bottomColor}`;
    if(text){
      light.textContent = text;
    }
    if(children){
      // 已高亮过不再高亮
      if(children && children.parentNode.tagName==='LIGHT'){
        return children;
      }
      light.dataset.type='img'
      light.appendChild(children.cloneNode());
    }

    light.dataset.highlight = runStep.lightId;
    if(runStep.tip){
      light.dataset.note = '1'
    }
    if(color==='rgba(1,1,1,0.5)'){
      light.dataset.mask = '1';
    }
    light.dataset.active = isActiveLight ? '1' : '0';
    light.dataset.note = !!runStep.tip?'1':''

    light.onclick = function (e) {
      runStep.toggle.call(runStep,undefined,false);
      e.stopPropagation();
      runStep.renderAnnotation.call(runStep,true);
    };

    let entered = false;
    light.onmouseenter = ()=> {
      entered = true;
      setTimeout(()=>{
        entered && runStep.pagenote.toggleLightBar(true,runStep,runStep.relatedNode[0] || light);
      },100)
    }
    light.onmouseleave = function () {
      entered = false;
      // setTimeout(()=>{
      //   runStep.pagenote.toggleLightBar(false,runStep,light);
      // },1000)
    }

    light._light = runStep;
    return light;
  }
  let targetEl = null;
  let timer = null;
  (function findElement(times){
    targetEl = whats.getTarget(runStep.id);
    clearTimeout(timer);
    if(targetEl){
      highlightElement(targetEl);
      (runStep.images||[]).forEach((item)=>{
        const imageElement = whats.getTarget(item.id);
        if(imageElement){
          const lightedImg = warpFun('',imageElement);
          const parent = imageElement.parentNode;
          parent.replaceChild(lightedImg,imageElement);
          runStep.relatedNode.push(lightedImg);
        }
      })
    }else if(times<3){
      timer = setTimeout(()=>{
        findElement(++times)
      },3000)
    }else{
      highlightElement(document.body,true)
    }
  })(0)

  function highlightElement(target,missParent){
    if(!runStep.text){
      return;
    }
    const result = highlightKeywordInElement(target,runStep.text,runStep.pre,  runStep.suffix,null,warpFun,runStep.pagenote.blackNodes);
    runStep.warn = result.match ? '' : '未找到匹配内容';
    runStep.missParent = missParent;
    runStep.relatedNode.push(...result.lightsElement);
  }
}

function render(light) {
  const element = document.createElement('div');

  function setEditable(flag){
    element.contentEditable = flag? 'true' : ''
  }

  element.innerHTML =  `
    <div style="padding: 5px; font-size: 12px; color: #666;">${light.text}</div>
  `
  element.onclick = function () {
    setEditable(true);
    element.focus()
  };
  element.onblur = function () {
    setEditable(false)
  }
  return element
}

Step.prototype.renderAnnotation = function (show) {
  const step = this;
  if(show===true){
    if(this._annotationEle){
      return
    }
  } else if(show===false){
    if(this._annotationEle){
      this._annotationEle.parentNode.removeChild(this._annotationEle);
      return;
    }
  }

  const element = document.createElement('pagenote-annotation');
  element.style = `--color:${step.bg}`
  const customInner = document.createElement('pagenote-annotation-inner')

  const actionArray = document.createElement('pagenote-annotation-menus')
  actionArray.innerHTML = '<pagenote-icon aria-controls="light"></pagenote-icon>'
  customInner.appendChild(actionArray);
  customInner.appendChild(render(this));

  element.appendChild(customInner);
  var options = {
    grid: 10,
    setPosition: true,
    setCursor: false,
    handle: actionArray,
    onDragEnd: function(result,x,y){
      step.x = x;
      step.y = y;
      step.save();
    }
  };
  new Draggable (element, options).set(this.x,this.y);
  // TODO 将容器存储在 pagenoteCore 中，避免append错
  const container = document.querySelector('pagenote-annotations');
  container.appendChild(element);
  this._annotationEle = element;
}

Step.prototype.gotoView = function (callback=function(){}){
  let targetEl = this.relatedNode?this.relatedNode[0]:null;
  if(!targetEl){
    try{
      targetEl = whats.getTarget(this.id);
    }catch (e){

    }
  }
  return gotoPosition(targetEl,this.x-window.innerWidth/2,this.y-window.innerHeight/3,()=>{
    callback();
  })
}

Step.prototype.changeColor = function(color: string){
  this.bg = color;
  const {textColor: textColor, rgb: rgb} = convertColor(color);
  const bottomColor = `rgb(${(rgb[0]-30)},${(rgb[1]-30)},${(rgb[2]-30)})`;
  const bgColor = `rgba(${rgb.toString()},1)`;

  this.relatedNode.forEach((item: HTMLElement)=>{
    item.style=`--bgcolor:${bgColor};--color:${textColor};--bgbottomcolor:${bottomColor}`;
  });
  this.darkBg = bottomColor;
  this.lightBg = `rgb(${(rgb[0]+10)},${(rgb[1]+10)},${(rgb[2]+10)})`;
  this.save();
};

Step.prototype.save = function (callback: Function) {
  this.pagenote.makelink((...arg: any)=>{
    this.onChange()
    typeof callback==='function'&&callback(...arg)
  });
};

Step.prototype.checkInSign = function (){
  const result =  this.relatedNode.some((item: HTMLElement)=>{
   const position = item.getBoundingClientRect();
   const inSign =  position.top > 0 && position.top < window.innerHeight;
   return inSign;
  });
  this.pagenote.triggerListener();
  this.isInview = result;
  return result;
}

Step.prototype.onChange = function () {
}


function Steps(option: { max: number; }, pagenote: this) {
  this.option = option;
  this.__proto__.pagenote = pagenote;
}
Steps.prototype = Array.prototype;
Steps.prototype.add = function (item) {
  if(item.save){ // TODO  item instanceof Step 判断异常？
    this.push(item);
  }else{
    console.error('非法类型',item,item.prototype,item.__proto__,Step.constructor);
  }
};
// @ts-ignore-end


export {
  Step,
  Steps,
}
