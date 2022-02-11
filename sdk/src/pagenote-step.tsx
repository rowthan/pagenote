import md5 from "md5";
import {getScroll, getViewPosition, keepLastIndex, writeTextToClipboard} from "./utils/document";
import toggleLightMenu from "./light-menu";
import modal from "./utils/modal";
import initKeywordTags from "./step/step-initKeywordTags";
import initAnnotation from "./step/step-initAnnotation";
import stepGotoView from "./step/step-gotoView";
import connectToKeywordTag from './step/step-connectToKeywordTag';
import notification from "./utils/notification";
import {Step,AnnotationStatus, LightStatus,} from '@pagenote/shared/lib/@types/Types'
import {pick} from "lodash";


const editorModal = new modal();

interface StepOptions{
  colors: string[],
  // renderAnnotation: any,
  remove: Function
  triggerChanged: Function
  getIndex: {
    (id:string):number
  }
}

type StepRuntime = {
  warn: string,
  isVisible: boolean,
  isFocusTag: boolean,
  isFocusAnnotation: boolean,
  relatedNode: HTMLElement[],
  relatedNodePosition:{top:number,left:number},
  relatedAnnotationNode: HTMLElement,
  focusTimer: NodeJS.Timer,
  annotationDrag: any,
  editing: boolean,
  lighting: '' | 'light' | 'annotation', // 是否需要高亮提醒
}

// interface InitSuccessCallback {
//   ():
// }

class IStep {
  static lastFocus: string

  options: StepOptions
  listeners:{
    data: Record<string, Function>,
    runtime: Record<string, Function>
  }
  data: Step
  runtime: StepRuntime


  constructor(initData: Step,options: StepOptions,callback:(step:IStep)=>void) {
    this.options = options;
    this.listeners = {
      data: {},
      runtime: {},
    };

    // 初始化需要持久化存储的数据
    const data = {
      ...initData,
      lightId : md5(initData.id+initData.text),
    };
    const that = this;
    this.data = new Proxy(data, {
      set(target:Record<string, any>,key:string,value){
        if(target[key]===value){
          return true;
        }
        Reflect.set(target, key, value);
        for(let i in that.listeners.data){
          const fun = that.listeners.data[i];
          typeof fun === 'function'  && fun(target,key,value);
        }
        const saveFun = that?.options?.triggerChanged;
        if(saveFun){
          saveFun(data);
        }
        return true;
      }
    });

    // 初始化运行时产生的数据，不需要持久化存储
    const runtime: StepRuntime ={
      warn: '',
      isVisible: false,
      isFocusTag: false,
      isFocusAnnotation: false,
      relatedNode: [],
      relatedNodePosition:{top:0,left:0},
      relatedAnnotationNode: null,
      focusTimer: null,
      annotationDrag: null,
      editing: false,
      lighting: '', // 是否需要高亮提醒
    }
    const listenShortcut = function (e: { key: any; stopPropagation: () => void; }) {
      const key = e.key;
      if(IStep.lastFocus !== that.data.lightId){
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
            x: `${that.data.x - scroll.x}`,
            y: `${that.data.y - scroll.y + offset}`,
          })
          break;
        case 'm':
          that.openEditor(true);
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
              duration: 1000,
              message:`只有${options.colors.length}只画笔，无法使用第${key}只`,
              type: 'error'
            })
          }
      }
      // e.stopPropagation();
    }
    this.runtime = new Proxy(runtime,{
      set(target:StepRuntime,key:keyof StepRuntime,value:any){
        // TODO 数组无法监听到 relatedNode
        if(target[key]===value){
          return true;
        }
        Reflect.set(target, key, value);
        const isFocus = target.isFocusTag || target.isFocusAnnotation || target.editing;
        // target.lighting = isFocus;
        for(let i in that.listeners.runtime){
          const fun = that.listeners.runtime[i];
          typeof fun === 'function'  && fun(target,key,value);
        }

        if(['lighting','isFocusTag','isFocusAnnotation','editing'].includes(key)){
          IStep.lastFocus = that.data.lightId;
          if(isFocus){
            // console.log('add listener',target.isFocusAnnotation,target.isFocusTag)
            document.addEventListener('keyup',listenShortcut,{capture:true})
          } else {
            // console.log('remove keyup',target.isFocusAnnotation,target.isFocusTag)
            document.removeEventListener('keyup',listenShortcut,{capture:true})
          }
        }

        return true;
      }
    });

    this.initKeywordTags();
    this.initAnnotation();
    typeof callback === 'function' && callback(this)
  }


  initKeywordTags(){
    initKeywordTags.call(this)
  }

  initAnnotation(){
    initAnnotation.call(this)
  }

  gotoView(){
    stepGotoView.call(this)
  }

  lighting() {
    this.runtime.lighting = 'light';
    setTimeout(()=>{
      this.runtime.lighting = '';
    },2000)
  }

  connectToKeywordTag(){
    connectToKeywordTag.call(this)
  }

  changeStatus(cnt:number) {
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

  delete() {
    this.runtime.relatedNode.forEach((element)=>{
      element.remove();
    });
    this.runtime.relatedAnnotationNode.remove();
    this.options.remove(this.data.lightId);
    toggleLightMenu(false);
    editorModal.destroy();
  }

  copyToClipboard(copyAll=false,position: { x: string; y: string; }) {
    let value = copyAll? (this.data.text + '\n' + this.data.tip): this.data.text;
    writeTextToClipboard(value).then(r => {
      notification({
        type: "success",
        message:`已复制【${value}】`,
        color: this.data.bg,
        duration: 3000,
        position: position
      })
    });
  }

  addListener(fun:Function,isRuntime=false,funId='default-change-fun') {
    const runtimeKey = isRuntime ? 'runtime' : 'data';
    this.listeners[runtimeKey][funId] = fun;
  }

  openEditor(show:boolean){
    this.runtime.editing = show;
  }

  toJSON(): Step{
    return JSON.parse(JSON.stringify(this.data));
  }
}



export default IStep;
