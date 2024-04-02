import { Step } from "@pagenote/shared/lib/@types/data";

interface Props {
    initLights: Step[];
}

enum GLOBAL_STATE {
    unset = 0,
}

type EVENT_NAME = 'onStateChange' | 'onCreateLight' | 'onDeleteLight'
interface EventHandler{
    (data: any):void
}

export default class Pagenote{
    /** sdk 版本 */ 
    private readonly version = '1.0.0';

    /** SDK 全局状态*/ 
    private state: GLOBAL_STATE = GLOBAL_STATE.unset

    /** 标记对象列表**/ 
    private lights: Step[] = [];

    private eventListeners = new Map<string,Set<EventHandler>>()

    /** 初始化数据*/ 
    constructor(props: Props){
        this.lights = props.initLights;
    }

    /** 启动监听选取变化*/ 
    initListener(){
        const isMoble = "ontouchstart" in window;

    }


    /**添加监听事件*/ 
    addEventListener(envetName: EVENT_NAME,eventHandler: EventHandler){
        let set = this.eventListeners.get(envetName);
        if(!set){
            set = new Set();
            this.eventListeners.set(envetName, set)
        }
        set.add(eventHandler);
        return function(){
            set?.delete(eventHandler)
        }
    }
}