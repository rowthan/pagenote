import debounce from 'lodash/debounce';
import {decryptedData, encryptData, prepareSelectionTarget, throttle} from "./utils";
import i18n from "./locale/i18n";
import IStep from './pagenote-step';
import { dataToString } from "./utils/data";
import './assets/styles/camera.scss'
import './assets/iconfont/icon.css'
import notification, {Message} from "./utils/notification";
import console from "./utils/console";
import {IBrush, IOption} from "./types/Option";
import {getDefaultOption} from "./utils/format";
import {PlainData, Step, Position} from "./common/Types";
import merge from 'lodash/merge'
import {isMoble} from "./utils/device";
//whats getTarget try catch  同时计算出多个 进行长度比较 取最优的
//将所有常用量进行存储 此处是全局 避免和原本常亮冲突 放到 constant里面

type RuntimePlainData = Omit<PlainData,'steps'> & {
    steps: IStep[]
}

class PagenoteCore {
    static readonly version="5.3.11"
    readonly CONSTANT = {
        ID:"pagenote",
        UN_INIT: -1,
        DESTROY: -9,
        RE_ALIVE: 99,
        WAITING:0,
        READY:1,
        RECORDING:2,
        PAUSE:3,
        RECORDED:4,
        REMOVED: -4,
        REMOVEDALL: -5,
        RECORDFAIL:5,
        FINNISHED:6,
        REPLAYING:7,
        PLAYANDWAIT:8,
        DONE:9,// 播放完毕
        START_SYNC:100, // 开始同步
        SYNCED:10, // 存储数据和内存对象已经同步
        SYNCED_ERROR: -10,

        URLCHANGED: 11,
        HASHCHANGED: 12,

        LIGHT: 100,
        DIS_LIGHT: -100,

        SHARE_CONFIRM: 'c',
        SHARE_ING:'i',
        SHARE_ERROR: 'e',
        SHARE_SUCCESS: 's',
    }
    options: IOption
    id: string;
    status: number;
    plainData: RuntimePlainData
    target: Step
    _runtime:{
        startPosition: Position,
        lastPosition: Position
        lastEvent: Event
        lastKeydownTime: number
    }
    _listeners:Function[]

    constructor(id:string, options:IOption) {
        console.option.showLog = options.debug;
        this.id = id || "pagenote-container";
        this.options =  merge(getDefaultOption(),options) as IOption;
        this.status = this.CONSTANT.UN_INIT;

        const colors = this.options.brushes.map((brush: IBrush)=>{
            return brush.bg;
        })

        this.options.brushes.forEach(function (brush) {
            if(brush.shortcut){

            }
        })
    }

    init(initData: PlainData){
        this.plainData.steps.forEach(function (step) {
            step.delete()
        })
        this.plainData = {
            ...initData,
            steps:[]
        }
        initData.steps.forEach( (item)=> {
            this.record(item)
        })


        this.addKeyDownListener();
        this.addKeyUpListener();
        this.addMoveListener();
        this.addSelectionListener();
        this.addShortCutListener();
    }

    // record
    record(targetInfo: Partial<Step>,callback?:(step:IStep)=>void){
        const info = merge(this.target,targetInfo)
        this.status = this.CONSTANT.RECORDING;
        const check = this.options.beforeRecord();
        if(check!==true){
            return
        }
        const newStep = new IStep(info,{
            colors: [],
            getIndex: this.getStepIndex,
            remove: this.removeStep,
            renderAnnotation: undefined,
            save: this.save
        }, (step)=> {
            step.runtime.isFocusTag = true;
            setTimeout(function () {
                step.runtime.isFocusTag = false;
            },2000)
            this.plainData.steps.push(newStep)

            this.plainData.steps = this.plainData.steps.sort((a,b)=>{
                const aPos = a.runtime.relatedNodePosition;
                const bPos = b.runtime.relatedNodePosition;
                const compareTop = aPos.top - bPos.top;
                return compareTop === 0 ? (aPos.left - bPos.left) : compareTop;
            });

            window.getSelection().removeAllRanges();
            this.target = null;
            callback && callback(newStep)
        });
    }

    // start
    addKeyDownListener(){
        const downEvent = isMoble?'touchstart' :'mousedown';
        const onDown = debounce((e)=>{
            this._runtime.lastEvent = e;
            this._runtime.startPosition = e
            this._runtime.lastKeydownTime = Date.now()
        },10)
        document.addEventListener(downEvent,onDown,{capture:true})
    }

    // move
    addMoveListener(){
        const downEvent = isMoble?'touchmove' :'mousemove';
        const onMouseMove = debounce((e)=> {
            this._runtime.lastPosition = e;
        },60)
        document.addEventListener(downEvent, onMouseMove,{capture:true})
    }

    // select
    addSelectionListener(){
        let lastActionTime = 0;
        const selectionChange = throttle(()=>{
            lastActionTime = new Date().getTime();
            this.target = prepareSelectionTarget(this.options.enableMarkImg, [this._runtime.startPosition,this._runtime.lastPosition])
            if(this.target===null){
                this.hideActionBar();
            }else{
                this.showActionBar();
            }
        },200)

        document.addEventListener('selectionchange',selectionChange,{capture:true});
    }

    // end
    addKeyUpListener(){
        const downEvent = isMoble?'touchstart' :'mousedown';
        const that = this;
        const onUp = function (e:Event) {
            that._runtime.lastEvent = e;
        }
        document.addEventListener(downEvent,onUp,{capture:true})
    }


    // shortcut listener
    addShortCutListener(){
        let keyCheckTimer: NodeJS.Timer
        const that = this;
        const keyupTimeout = that.options.keyupTimeout;
        const handleKey = function (e: KeyboardEvent) {
            const key = e.key.toLowerCase()
            clearTimeout(keyCheckTimer)
            const timeGap = Date.now() - (that._runtime.lastKeydownTime || Date.now());
            if(timeGap >= keyupTimeout){
                // 高亮快捷键处理
                const doHighlight = that.target !== null;
                // 获取画笔
                const brush = that.options.brushes.find((colorItem: { shortcut: string; })=>{
                    return colorItem && colorItem.shortcut && colorItem.shortcut.toLowerCase() === key;
                });
                if(doHighlight && brush){
                    that.record({
                        bg: brush.bg,
                        level: brush.level,
                    });
                } else { // 扩展插件快捷键
                    const fun = that.options.functionColors.find(function (item) {
                        return (item.shortcut||'').toLowerCase() === item.shortcut;
                    })
                    if(fun){
                        fun.onclick(e,that.target);
                    }
                }
            }else {
                keyCheckTimer = setTimeout(()=>{
                    handleKey(e)
                },keyupTimeout/4)
            }
        }
        document.addEventListener('keyup',handleKey,{capture:true});
    }

    addListener(fun:Function){
        this._listeners.push(fun)
    }

    showActionBar () {
        this.status = this.CONSTANT.WAITING;
    }

    hideActionBar() {
        this.status = this.CONSTANT.PAUSE
    }

    getStepIndex(lightId:string):number{
        let index = -1;
        const steps = this.plainData.steps;
        for(let i=0; i<steps.length; i++){
            if(steps[i].data.lightId===lightId){
                index = i;
                break;
            }
        }
        return index;
    }

    removeStep(lightId:string){
        const steps = this.plainData.steps;
        for(let i=0; i<steps.length; i++){
            const item = steps[i];
            if(lightId===item.data.lightId){
                steps.splice(i,1);
                break;
            }
        }
        this.save();
    }

    save(){

    }

    notification(message: Message){
        notification(message)
    }

    updateSetting(setting:IOption){
        this.options = {
            ...this.options,
            ...setting,
        }
    }

    decodeData(data:any) {
        return decryptedData(data);
    }

    encryptData(data:any) {
        return encryptData(data)
    }

    exportData(template: { template: string; fileExt: string; icon: string; name: string; description: string; },data:any) {
        return dataToString(data||this.plainData,template)
    }

    i18n={
        ...i18n
    }
}

export default PagenoteCore;



