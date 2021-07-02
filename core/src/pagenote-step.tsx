// @ts-nocheck // TODO enable
import md5 from "blueimp-md5";
import {highlightKeywordInElement} from "./utils/highlight";
import { whats } from './utils/index'
import {convertColor} from "./utils/index";
import {gotoPosition} from "./utils/document";
import Draggable from 'draggable';
import toggleLightMenu from "./light-menu";
import {wrapperLightAttr} from "./utils/light";

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
  lightStatus? : LightStatus,
  annotationStatus? : AnnotationStatus,
  lightBg?: string, // 将废弃
  daskBg?: string, // 将废弃
  isFocus?: boolean, // 将废弃
  [other: string]: any,
}

enum LightStatus{
  UN_LIGHT=0,
  LIGHT=1,
}

enum AnnotationStatus {
  HIDE=0,
  SHOW=1,
}

const STORE_KEYS_VERSION_2_VALIDATE = ["x","y","id","text","tip","bg","time","isActive","offsetX","offsetY","parentW","pre","suffix","images","level","lightStatus","annotationStatus"]
const Step = function (info: StepProps) {
  this.data = {
    lightStatus: LightStatus.LIGHT,
    annotationStatus: AnnotationStatus.SHOW,
    lightId : md5(info.id+info.text),
  }
  STORE_KEYS_VERSION_2_VALIDATE.forEach((key: string)=>{
    this.data[key] = info[key];
  });

  this.runtime = {
    warn: '',
    isInview: false,
    isFocus: false,
    relatedNode: [],
  }

  this.listeners = {};
  this.initKeywordTags();
  this.initAnnotation();
}


Step.prototype.initKeywordTags = function (){
  const step = this;
  const {bg,id,text,pre,suffix,lightId,lightStatus} = step.data;
  function highlightElement(target) {
    // 查找文字、高亮元素
    const result = highlightKeywordInElement(target,text,pre,suffix,null,function warpFun(text,children){
      const lightElement = document.createElement('light');
      lightElement.dataset.highlight = lightId;

      wrapperLightAttr(lightElement,bg,lightStatus===LightStatus.LIGHT)
      if(text){
        lightElement.textContent = text;
      }
      if(children){
        // 已高亮过不再高亮
        if(children && children.parentNode.tagName==='LIGHT'){
          return children;
        }
        lightElement.dataset.type='img'
        lightElement.appendChild(children.cloneNode());
      }

      step.addListener('light',function (data) {
        wrapperLightAttr(lightElement,data.bg,data.lightStatus === LightStatus.LIGHT)
      })

      lightElement.onclick = function (e) {
        const {data} = step;
        step.changeData({
          lightStatus: data.lightStatus === LightStatus.LIGHT ? LightStatus.UN_LIGHT : LightStatus.LIGHT
        });
        e.stopPropagation();
      };

      let entered = false;
      lightElement.onmouseenter = ()=> {
        entered = true;
        setTimeout(()=>{
          entered && toggleLightMenu(true,step,step.runtime.relatedNode[0] || lightElement);
        },100)
      }
      lightElement.onmouseleave = function () {
        entered = false;
      }

      lightElement._light = step;
      return lightElement;
    });
    step.warn = result.match ? '' : '未找到匹配内容';
    if(result){
      step.runtime.relatedNode.push(...result.lightsElement);
    }
  }

  let timer = null;
  (function findElement(times){
    const targetEl = whats.getTarget(id);
    clearTimeout(timer);
    if(targetEl){
      highlightElement(targetEl)
    }else if(times<3){
      timer = setTimeout(()=>{
        findElement(++times)
      },3000)
    }else{
      highlightElement(document.body,true)
    }
  })(0)
}

// @ 不推荐使用
Step.prototype.toggle = function (isLight: LightStatus,goto=true) {
  if(goto){
    this.gotoView()
  }
  this.anotationStatus = isLight;
};


Step.prototype.initAnnotation = function () {
  const step = this;
  const renderMethod = step.__renderAnnotation;
  if(typeof renderMethod!=="function"){
    return;
  }

  const {bg,x,y} = step.data;
  const element = document.createElement('pagenote-annotation');

  const customInner = document.createElement('pagenote-annotation-inner')
  customInner.style = `--color:${bg}`;

  const actionArray = document.createElement('pagenote-annotation-menus')
  actionArray.innerHTML = '<pagenote-icon aria-controls="light"></pagenote-icon>'
  customInner.appendChild(actionArray);
  customInner.appendChild(renderMethod(step.data,step));

  element.appendChild(customInner);
  const options = {
    grid: 10,
    setPosition: true,
    setCursor: false,
    handle: actionArray,
    onDragEnd: function(result,x,y){
      step.changeData({
        x,y,
      })
    }
  };
  new Draggable (element, options).set(x,y);
  // TODO 将容器存储在 pagenoteCore 中，避免append错
  const container = document.querySelector('pagenote-annotations');
  container.appendChild(element);
  this._annotationEle = element;

  this.addListener('annotation',function (data) {
    customInner.style = `--color:${data.bg}`;
  })
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

// Step.prototype.changeColor = function(color: string){
//   this.bg = color;
//   const {textColor: textColor, rgb: rgb} = convertColor(color);
//   const bottomColor = `rgb(${(rgb[0]-30)},${(rgb[1]-30)},${(rgb[2]-30)})`;
//   const bgColor = `rgba(${rgb.toString()},1)`;
//
//   this.relatedNode.forEach((item: HTMLElement)=>{
//     item.style=`--bgcolor:${bgColor};--color:${textColor};--bgbottomcolor:${bottomColor}`;
//   });
//   this.darkBg = bottomColor;
//   this.lightBg = `rgb(${(rgb[0]+10)},${(rgb[1]+10)},${(rgb[2]+10)})`;
//   this.save();
// };

Step.prototype.save = function (callback: Function) {
  this.pagenote.makelink((...arg: any)=>{
    typeof callback==='function'&&callback(...arg)
  });
};

Step.prototype.checkInSign = function (){
  const result =  this.runtime.relatedNode.some((item: HTMLElement)=>{
   const position = item.getBoundingClientRect();
   const inSign =  position.top > 0 && position.top < window.innerHeight;
   return inSign;
  });
  this.changeData({
    isInview: result
  })
  return result;
}

Step.prototype.addListener = function (key,fun) {
  if(key && typeof fun === 'function'){
    this.listeners[key] = fun;
  }
}

// 修改 data 数据 TODO 使用 proxy
Step.prototype.changeData = function (object) {
  let changed = false;
  for(let i in object){
    if(this.data[i]!==object[i]){
      this.data[i] = object[i];
      changed = true;
    }
  }
  if(changed){
    this._triggerChangeData();
  }
}

Step.prototype._triggerChangeData = function () {
  for(let i in this.listeners){
    this.listeners[i](this.data);
  }

  this.__saveAll();
}


function Steps(option: { max: number; }, pagenote) {
  this.option = option;
  this.__proto__.pagenote = pagenote;
}
Steps.prototype = Array.prototype;
Steps.prototype.add = function (item) {
  if(item.save){
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
