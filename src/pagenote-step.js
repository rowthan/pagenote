import md5 from "blueimp-md5";
import {highlightKeywordInElement, removeElementHighlight} from "./highlight";
import {convertColor} from "./utils";
import whatsPure from 'whats-element/pure'
import {gotoPosition} from "./document";
const whats = new whatsPure();

function Step(info,pagenote,version=2) {
  pagenote.CONSTANT.STORE_KEYS_VERSION_2_VALIDATE.forEach((key)=>{
    this[key] = info[key];
  });
  const {rgb} = convertColor(info.bg);
  this.lightBg = `rgb(${(rgb[0]+10)},${(rgb[1]+10)},${(rgb[2]+10)})`;
  this.darkBg = `rgb(${(rgb[0]-30)},${(rgb[1]-30)},${(rgb[2]-30)})`;
  this.lightId = md5(info.id+info.text);
  this.isFocus = false; // 是否 hover focus
  this.relatedNode = []; // 关联的dom元素
  this.isInview = false; // 是否在视野内
  this.__proto__.pagenote = pagenote;
}

Step.prototype.delete = function (e) {
  const pagenote = this.pagenote;
  for(let i=0; i<pagenote.recordedSteps.length; i++){
    if(this.lightId===pagenote.recordedSteps[i].lightId){
      this.relatedNode.forEach((element)=>{
        removeElementHighlight(element);
      })
      pagenote.remove(i);
      break;
    }
  }
  e && e.stopPropagation();
};

Step.prototype.toggle = function (isLight,goto=true) {
  let light = isLight;
  const pagenote = this.pagenote;
  for(let i=0; i<pagenote.recordedSteps.length; i++){
    if(this.lightId===pagenote.recordedSteps[i].lightId){

      if(light===undefined && this.relatedNode && this.relatedNode.length){
        const elementInfo = whats.compute(this.relatedNode[0]);
        if(elementInfo.visible===false && light===undefined){
          light = true;
        } else {
          light = !this.isActive;
        }
      }else{
        isLight!==undefined?isLight:!this.isActive
      }
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

  // 高亮元素
  const warpFun = function (text){
    const color = runStep.bg;
    const light = document.createElement('light');
    const {textColor,rgb} = convertColor(color);
    const bottomColor = `rgb(${(rgb[0]-30)},${(rgb[1]-30)},${(rgb[2]-30)})`;
    const bgColor = `rgba(${rgb.toString()},1)`;
    light.style.backgroundColor=runStep.bg;
    light.style=`--bgcolor:${bgColor};--color:${textColor};--bgbottomcolor:${bottomColor}`;
    light.textContent = text;

    light.dataset.highlight = runStep.lightId;
    if(runStep.tip){
      light.dataset.note = '1'
    }
    if(color==='rgba(1,1,1,0.5)'){
      light.dataset.mask = '1';
    }
    light.dataset.active = isActiveLight ? '1' : '0';
    light.dataset.note = !!runStep.tip?'1':''

    light._light = runStep;
    return light;
  }
  let targetEl = null;
  let timer = null;
  (function findElement(times){
    targetEl = whats.getTarget(runStep.id);
    clearTimeout(timer);
    if(targetEl){
      highlightElement()
    }else if(times<5){
      setTimeout(()=>{
        findElement(++times)
      },3000)
    }
  })(0)

  function highlightElement(){
    const result = highlightKeywordInElement(targetEl,runStep.text,runStep.pre,  runStep.suffix,null,warpFun,runStep.pagenote.blackNodes);
    runStep.warn = result.match ? '' : '未找到匹配内容';
    runStep.relatedNode = result.lightsElement;
  }
}

Step.prototype.gotoView = function (callback){
  let targetEl = this.relatedNode?this.relatedNode[0]:null;
  if(!targetEl){
    try{
      targetEl = whats.getTarget(this.id);
    }catch (e){

    }
  }
  return gotoPosition(targetEl,this.x-window.innerWidth/2,this.y-window.innerHeight/3,()=>{
    this.isInview = true;
    callback();
  })
}

Step.prototype.changeColor = function(color){
  this.bg = color;
  const {textColor,rgb} = convertColor(color);
  const bottomColor = `rgb(${(rgb[0]-30)},${(rgb[1]-30)},${(rgb[2]-30)})`;
  const bgColor = `rgba(${rgb.toString()},1)`;

  this.relatedNode.forEach((item)=>{
    item.style=`--bgcolor:${bgColor};--color:${textColor};--bgbottomcolor:${bottomColor}`;
  });
  this.darkBg = bottomColor;
  this.lightBg = `rgb(${(rgb[0]+10)},${(rgb[1]+10)},${(rgb[2]+10)})`;
  this.save();
};

Step.prototype.save = function (callback) {
  this.pagenote.makelink((...arg)=>{
    typeof callback==='function'&&callback(...arg)
  });
};

Step.prototype.checkInSign = function (){
  const result =  this.relatedNode.some((item)=>{
   const position = item.getBoundingClientRect();
   const inSign =  position.top > 0 && position.top < window.innerHeight;
   return inSign;
  });
  this.pagenote.triggerListener();
  this.isInview = result;
  return result;
}


function Steps(option,pagenote) {
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



export {
  Step,
  Steps,
}
