import md5 from "blueimp-md5";
import {convertColor} from "./utils";


function Step(info,pagenote,version=2) {
  pagenote.CONSTANT.STORE_KEYS_VERSION_2_VALIDATE.forEach((key)=>{
    this[key] = info[key];
  });
  const {rgb} = convertColor(info.bg);
  this.lightBg = `rgb(${(rgb[0]+10)},${(rgb[1]+10)},${(rgb[2]+10)})`;
  this.darkBg = `rgb(${(rgb[0]-30)},${(rgb[1]-30)},${(rgb[2]-30)})`;
  this.lightId = md5(info.id+info.text);
  this.isFocus = false; // 是否 hover focus
  this.relatedNode = null; // 关联的dom元素
  this.__proto__.pagenote = pagenote;
}

Step.prototype.delete = function (e) {
  const pagenote = this.pagenote;
  for(let i=0; i<pagenote.recordedSteps.length; i++){
    if(this.lightId===pagenote.recordedSteps[i].lightId){
      pagenote.remove(i);
      break;
    }
  }
  e && e.stopPropagation();
};

Step.prototype.toggle = function (isLight,goto=true) {
  const light = isLight!==undefined?isLight:!this.isActive;
  const pagenote = this.pagenote;
  for(let i=0; i<pagenote.recordedSteps.length; i++){
    if(this.lightId===pagenote.recordedSteps[i].lightId){
      pagenote.replay(i, goto, true, false, light);
      break;
    }
  }
};

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
