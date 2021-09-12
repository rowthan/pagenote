// @ts-nocheck // TODO enable
import md5 from "blueimp-md5";
import {getScroll, getViewPosition, keepLastIndex, writeTextToClipboard} from "./utils/document";
import toggleLightMenu from "./light-menu";
import modal from "./utils/modal";
import AnnotationEditor from "./annotationEditor";
import {AnnotationStatus, LightStatus, StepProps, STORE_KEYS_VERSION_2_VALIDATE} from "./step/const";
import initKeywordTags from "./step/step-initKeywordTags";
import initAnnotation from "./step/step-initAnnotation";
import stepGotoView from "./step/step-gotoView";
import connectToKeywordTag from './step/step-connectToKeywordTag';
import notification from "./utils/notification";

const editorModal = new modal();

interface StepOptions{
  colors: Array,
  renderAnnotation: any,
}

const Step = function (info: StepProps,options: StepOptions,callback?:function) {
  this.options = options;

  this.listeners = {
    data: {},
    runtime: {},
  };

  // 初始化需要持久化存储的数据
  const data = {
    lightStatus: LightStatus.LIGHT,
    annotationStatus: AnnotationStatus.SHOW,
    lightId : md5(info.id+info.text),
  };
  const that = this;
  this.data = new Proxy(data, {
    set(target,key,value){
      if(target[key]===value){
        return target;
      }
      Reflect.set(target, key, value);
      for(let i in that.listeners.data){
        const fun = that.listeners.data[i];
        typeof fun === 'function'  && fun(target,key,value);
      }
      const saveFun = that?.steps?.option?.saveDatas();
      if(saveFun){
        saveFun(data);
      }
      return target;
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
    annotationDrag: null,
    editing: false,
    lighting: false, // 是否需要高亮提醒
  }
  const that = this;
  const listenShortcut = function (e: { key: any; stopPropagation: () => void; }) {
    const key = e.key;
    // console.log(key)
    if(that.steps.lastFocus !== that.data.lightId){
      return;
    }
    if(key==='Escape'){
      that.runtime.editing = false;
      return;
    }
    // 编辑中
    if(that.runtime.editing){
      return
    }
    switch (key) {
      case 'c':
        const scroll = getScroll();
        const relatedNote = that.runtime.relatedNode[0];
        let offset = -50;
        if(relatedNote){
          offset += relatedNote.offsetHeight * -1
        }
        that.copyToClipboard(false,{
          x: that.data.x - scroll.x,
          y: that.data.y - scroll.y + offset,
        })
        break;
      case 'm':
        that.openEditor();
        break;
      case '`':
        that.changeStatus(1)
        break;
      case 'p':
        const status = that.data.annotationStatus === AnnotationStatus.SHOW ? AnnotationStatus.HIDE : AnnotationStatus.SHOW ;
        that.data.annotationStatus = status;
        break;
      // case 'ArrowLeft':
      //   const near = that.getNear(true);
      //   if(near[0]){
      //     near[0].gotoView();
      //     near[1].runtime.lighting = true;
      //     that.steps.lastFocus = near[0].data.lightId;
      //   }
      //   console.log(that.steps.lastFocus,near[0].data.text)
      //   break;
      // case 'ArrowRight':
      //   const near = that.getNear(true);
      //   if(near[1]){
      //     near[1].gotoView()
      //     near[1].runtime.lighting = true;
      //     that.steps.lastFocus = near[1].data.lightId;
      //   }
      //   console.log(that.steps.lastFocus,near[1].data.text)
      //   break;
      default:
        const index = Number(key) - 1;
        const color = options.colors[index];
        if(color){
          that.data.bg = color;
          return;
        }
        if(Number.isInteger(index) && index>=0){
          notification({
            message:`只有${options.colors.length}只画笔，无法使用第${key}只`,
            type: 'error',
          })
        }
    }
    // e.stopPropagation();
  }
  this.runtime = new Proxy(runtime,{
    set(target,key,value){
      if(target[key]===value){
        return target;
      }
      Reflect.set(target, key, value);
      const isFocus = target.isFocusTag || target.isFocusAnnotation || target.editing;
      // target.lighting = isFocus;
      for(let i in that.listeners.runtime){
        const fun = that.listeners.runtime[i];
        typeof fun === 'function'  && fun(target,key,value);
      }

      if(['lighting','isFocusTag','isFocusAnnotation','editing'].includes(key)){
        that.steps.lastFocus = that.data.lightId;
        if(isFocus){
          // console.log('add listener',target.isFocusAnnotation,target.isFocusTag)
          document.addEventListener('keyup',listenShortcut,{capture:true})
        } else {
          // console.log('remove keyup',target.isFocusAnnotation,target.isFocusTag)
          document.removeEventListener('keyup',listenShortcut,{capture:true})
        }
      }

      return target;
    }
  });

  typeof callback === 'function' && callback(this)
}

Step.prototype.init = function () {
  this.initKeywordTags();
  this.initAnnotation();
}


Step.prototype.initKeywordTags = initKeywordTags;

Step.prototype.initAnnotation = initAnnotation;

Step.prototype.gotoView = stepGotoView;

Step.prototype.connectToKeywordTag = connectToKeywordTag;

Step.prototype.changeStatus = function (cnt:number) {
  let finalStatus = LightStatus.UN_LIGHT;
  if(cnt!==0){
     finalStatus = this.data.lightStatus + cnt;
  }

  if(finalStatus>LightStatus.LIGHT){
    finalStatus = LightStatus.UN_LIGHT;
  }else if(finalStatus<LightStatus.UN_LIGHT){
    finalStatus = LightStatus.LIGHT;
  }

  this.data.annotationStatus = finalStatus === LightStatus.LIGHT ? AnnotationStatus.SHOW : AnnotationStatus.HIDE
  this.data.lightStatus = finalStatus;
}

Step.prototype.openEditor = function (show=true) {
  this.runtime.editing = show;
  // this.data.annotationStatus = AnnotationStatus.SHOW;
  return;
  if(show===false){
    editorModal.destroy();
    return;
  }

  const that = this;
  this.data.annotationStatus = AnnotationStatus.SHOW;
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
      that.data.tip = e.target.value.trim();
      that.data.annotationStatus = !!e.target.value ? AnnotationStatus.SHOW : AnnotationStatus.HIDE;
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
  this.steps.removeStep(this.data.lightId);
  toggleLightMenu(false);
  editorModal.destroy();
}

Step.prototype.copyToClipboard = function (copyAll=false,position) {
  let value = copyAll? (this.data.text + '\n' + this.data.tip): this.data.text;
  writeTextToClipboard(value).then(r => {
    notification({
      message:`已复制【${value}】`,
      color: this.data.bg,
      duration: 3000,
      position: position,
    })
  });
}

Step.prototype.addListener = function (fun,isRuntime=false,funId='default-change-fun') {
  const runtimeKey = isRuntime ? 'runtime' : 'data';
  this.listeners[runtimeKey][funId] = fun;
}

Step.prototype.getCurrentIndex = function () {
  let index = -1;
  for(let i=0; i<this.steps.length; i++){
    if(this.steps[i]?.data?.lightId===this.data.lightId){
      index = i;
      break;
    }
  }
  return index;
}

Step.prototype.getNear = function (loop=false) {
  const current = this.getCurrentIndex();
  if(current===-1){
    return []
  }
  let pre = this.steps[current - 1],next = this.steps[current + 1];

  if(loop){
    if(current===0){
      pre = this.steps[this.steps.length-1]
    } else if(current===this.steps.length-1){
      next = 0
    }
  }

  return [pre,next];
}

// TODO step 继承 Steps
function Steps(option: any) {
  this.option = option;
  this.lastFocus = null;
}
Steps.prototype = Array.prototype;

Steps.prototype.removeStep = function (lightId) {
  for(let i=0; i<this.length; i++){
    const item = this[i];
    if(lightId===item.data.lightId){
      this.splice(i,1);
      break;
    }
  }
  this.option.saveDatas();
}

Steps.prototype.save = function () {
  this.option.saveDatas();
}

Steps.prototype.add = function (item) {
  item.__proto__.steps = this;
  if(item.delete){
    item.init();
    this.push(item);
  }else{
    console.error('非法类型',item,item.prototype,item.__proto__,Step.constructor);
  }
};

export {
  Step,
  Steps,
}
