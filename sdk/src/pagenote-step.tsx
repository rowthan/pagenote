// @ts-nocheck // TODO enable
import md5 from "blueimp-md5";
import { getScroll, getViewPosition,keepLastIndex} from "./utils/document";
import toggleLightMenu from "./light-menu";
import modal from "./utils/modal";
import AnnotationEditor from "./annotationEditor";
import {LightStatus, AnnotationStatus, StepProps, STORE_KEYS_VERSION_2_VALIDATE} from "./step/const";
import initKeywordTags from "./step/step-initKeywordTags";
import initAnnotation from "./step/step-initAnnotation";
import stepGotoView from "./step/step-gotoView";

const editorModal = new modal();

interface StepOptions{
  onChange: Function,
  onRemove: Function,
}

const Step = function (info: StepProps,options: StepOptions,callback) {
  this.options = options;
  // 初始化需要持久化存储的数据
  const data = {
    lightStatus: LightStatus.LIGHT,
    annotationStatus: AnnotationStatus.SHOW,
    lightId : md5(info.id+info.text),
  };
  this.data = new Proxy(data, {
    set(target,key,value){
      return Reflect.set(target, key, value);
    }
  });
  STORE_KEYS_VERSION_2_VALIDATE.forEach((key: string)=>{
    this.data[key] = info[key];
  });

  // 初始化运行时产生的数据，不需要持久化存储
  const runtime ={
    warn: '',
    isVisible: false,
    isFocusTag: false,
    isFocusAnnotation: false,
    relatedNode: [],
    relatedAnnotationNode: null,
    focusTimer: null,
  }
  this.runtime = new Proxy(runtime,{
    set(target,key,value){
      return Reflect.set(target, key, value);
    }
  })

  this.listeners = {};
  this.initKeywordTags();
  this.initAnnotation();

  typeof callback === 'function' && callback(this)
}

Step.prototype.initKeywordTags = initKeywordTags;

Step.prototype.initAnnotation = initAnnotation;

Step.prototype.gotoView = stepGotoView;

Step.prototype.openEditor = function (show=true) {
  if(show===false){
    editorModal.destroy();
    return;
  }

  const that = this;
  this.changeData({annotationStatus:2});
  const {tip,x,y,text,bg} = this.data;

  let pos = {};
  if(that.runtime.relatedAnnotationNode){
    pos = getViewPosition(that.runtime.relatedAnnotationNode);
  } else {
    pos = {
      bodyLeft: getScroll().y + 200,
    }
  }

  editorModal.show(null,{
    left: pos.bodyLeft+'px',
    top: pos.bodyTop+pos.height+4+'px',
  });
  AnnotationEditor({
    tip,
    color:bg,
    text,
    onchange: function (e) {
      that.changeData({
        tip: e.target.value.trim(),
        annotationStatus: !!e.target.value ? AnnotationStatus.SHOW : AnnotationStatus.HIDE
      })
    },
    root:editorModal.content,
  });

  const el = document.querySelector('pagenote-block[contenteditable="true"]');
  if(el){
    el.focus();
    keepLastIndex(el);
  }

  toggleLightMenu(true,that,{
    left: pos.bodyLeft,
    top: pos.bodyTop - 30,
  });
}

Step.prototype.delete = function () {
  this.runtime.relatedNode.forEach((element)=>{
    element.remove();
  });
  this.runtime.relatedAnnotationNode.remove();
  this.options.onRemove(this.data);
  toggleLightMenu(false);
  editorModal.destroy();
}

Step.prototype.addListener = function (key,fun) {
  if(key && typeof fun === 'function'){
    if(Array.isArray(key)){
      key.forEach((item)=>{
        this.listeners[item] = fun;
      })
    }else{
      this.listeners[key] = fun;
    }
  }
}

// 修改 data 数据 TODO 使用 proxy
Step.prototype.changeData = function (object,isRuntime) {
  let changed = false;
  const targetObject = isRuntime ? this.runtime : this.data;
  for(let i in object){
    if(targetObject[i]!==object[i]){
      targetObject[i] = object[i];
      changed = true;
    }
  }
  if(changed){
    this._triggerChangeData(object);
  }
}

Step.prototype._triggerChangeData = function (object) {
  for(let i in this.listeners){
    this.listeners[i](this.data,object);
  }
  this.options.onChange(this.data);
}


function Steps(option: { max: number; }) {
  this.option = option;
}
Steps.prototype = Array.prototype;
Steps.prototype.add = function (item) {
  if(item.changeData){
    this.push(item);
  }else{
    console.error('非法类型',item,item.prototype,item.__proto__,Step.constructor);
  }
};

export {
  Step,
  Steps,
}
