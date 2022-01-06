import debounce from 'lodash/debounce';
import { captureElementImage, showCamera} from './utils/document'
import {decryptedData, encryptData, prepareSelectionTarget, throttle} from "./utils";
import i18n from "./locale/i18n";
import IStep from './pagenote-step';
import Steps from './pagenote-steps'
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

//增加开关 是否开启
 function PagenoteCor(id, options){ // TODO 支持载入语言包
    console.option.showLog = options.debug;
    this.id = id || "pagenote-container";
    this.options =  merge(getDefaultOption(),options);
    this.status = this.CONSTANT.UN_INIT;

    const colors = this.options.brushes.map((brush)=>{
        return brush.bg;
    })
    this.recordedSteps = [];

    new Steps({
        saveDatas:  ()=> {
            this.makelink()
        },
        // colors: colors
    });
    this.snapshots = [];
    this.categories = new Set();
    this.note='';
    this.runindex = null;
    const runBarInfo = JSON.parse(JSON.stringify(this.options.barInfo));
    runBarInfo.status = runBarInfo.status || 'fold';
    this.runningSetting = Object.assign({},{
        dura: this.options.dura,
        autoLight: this.options.autoLight,
        barInfo: runBarInfo,
    });
    this.target = null
    this.lastEvent = null;
    //用户用户复制的 分享的URL
    this.url = window.location.href
    //只提供读方法
    this.data = "" //PagenoteCore 使用的原始数据字符串
    this.plainData = {} // 与 data 配套，明文的存储数据
    this.lastaction = this.CONSTANT.DIS_LIGHT
    let status = this.CONSTANT.UN_INIT,
        nextTimer: NodeJS.Timeout,
        runningTimer: NodeJS.Timeout


    // 全局变量
    const CALLBACKFUN:Function[] = [],
          constant = this.CONSTANT,
          OPTIONS = this.options,
          // 网站配置的setting设置
          // location = window.location,
          // emptyString = "",
          isMoble = "ontouchstart" in window;


    let hasListened = false;

    //success no return; failed return errorMsg 持久化存储
    this.makelink = (callback:Function) => {
        this.status = constant.START_SYNC;
        store(typeof callback === 'function' ? callback : function () {
        });
    };

    const StepOptions = {
        renderAnnotation: OPTIONS.renderAnnotation,
        colors: colors
    }
    // TODO 初始化动效
    this.init = function(initData:PlainData){ // 为一段加密过的数据信息
        let simpleStep = [];
        let setting = {};
        if(initData){
            try {
                let dataObject:PlainData;
                if(typeof initData === 'object' && initData.steps){
                    dataObject = initData;
                    simpleStep = initData.steps || [];
                    setting = initData.setting || {};
                }
                this.snapshots = Array.isArray(dataObject.snapshots) ? dataObject.snapshots : [];
                this.categories = new Set(dataObject.categories);
                this.note = dataObject.note;
            }catch (e) {
                console.error('解析step异常',e,initData);
            }
        }
        // 清空当前已有数据
        this.recordedSteps.forEach((step)=>{
            step.delete();
        });
        simpleStep.forEach((step)=>{
            const newStep = new IStep(step,StepOptions);
            this.recordedSteps.add(newStep);
        });
        // 修改当前设置项
        this.runningSetting = Object.assign(this.runningSetting,setting);

        function upListen() {
            const that = this;
            const upEvent = isMoble?'touchend':'mouseup';
            const downEvent = isMoble?'touchstart' :'mousedown';
            const mouseMove = 'mousemove';

            const timeout = that.options.showBarTimeout || 0;
            let lastActionTime = 0;
            let showBarTimer: NodeJS.Timeout = null;
            let copyTimer: NodeJS.Timeout = null;
            let isPressingMouse = false;
            let lastPosition = {};
            let startPosition = {};

            // 轮询检测
            let loopCheckStartTime = 0;
            function loopCheck(){
                loopCheckStartTime = new Date().getTime();
                clearInterval(showBarTimer)
                showBarTimer = setInterval(function () {
                    checkShow(new Date().getTime(),function (result: any) {
                        if(result){
                            clearInterval(showBarTimer)
                        } else {
                            const loopDuration = new Date().getTime() - loopCheckStartTime;
                            // 最多轮询10s，防止死循环
                            if(loopDuration > 3 * 1000){
                                clearInterval(showBarTimer)
                            }
                        }
                    })
                },100)
                return showBarTimer;
            }

            // 检测是否出bar,判断时长 是否按压、是否有选区
            function checkShow(currentTime?:number,callback?:Function) {
                const timeGap = (currentTime || Date.now()) - lastActionTime;
                that.target = prepareSelectionTarget(that.options.enableMarkImg, [startPosition,lastPosition])
                console.log(that.target)
                // 满足计算条件
                const computeResult = !!that.target && timeGap>=timeout && isPressingMouse;
                if(computeResult){
                    that.showActionBar();
                }else{
                    that.hideActionBar()
                }
                callback && callback(computeResult);
            }


            const debounceTime = 20;
            const selectionChange = throttle((e)=>{
                lastActionTime = new Date().getTime();
                if(document.getSelection().rangeCount===0){
                    this.hideActionBar();
                    return
                }
                if(timeout>0){
                    checkShow(null,function (result: any) {
                        if(!result){
                            loopCheck()
                        }
                    })
                }

                clearTimeout(copyTimer);
                copyTimer = setTimeout(()=>{
                    const text = document.getSelection().toString();
                    if(text.trim()){
                        // TODO 优化剪切板方法，写入复制区会导致丢失当前选区
                        // writeTextToClipboard(text);
                        // notification({
                        //  message: '已复制选区至剪切板'
                        // });
                    }
                    console.log('选区',text);
                },2000)
            },debounceTime)
            const onMouseMove = debounce(function(e) {
                if(!isPressingMouse){
                    return
                }
                lastPosition = e;
            },60)

            document.addEventListener('selectionchange',selectionChange,{capture:true});

            document.addEventListener(downEvent,(e)=>{
                that.lastEvent = e;
                isPressingMouse = true;
                startPosition = e;
                lastActionTime = new Date().getTime();
                document.addEventListener(mouseMove,onMouseMove);
            },{capture:true})

            document.addEventListener(upEvent,(e)=>{
                // 这里 timeout 下个周期执行，是为了兼容 Safari。Safari 在 up 时 selection 已清空。
                // 点击按钮也要通过 mouseup 来监听，不能通过 click 事件
                setTimeout(function () {
                    that.lastEvent = e;
                    lastPosition = e;
                    checkShow();
                    lastActionTime = new Date().getTime();
                    isPressingMouse = false;
                    clearInterval(showBarTimer)
                    document.removeEventListener(mouseMove,onMouseMove);
                },0)
            },{capture:true});
        }

        let lastKeydownTime = 0;
        const that = this;
        const keyupTimeout = this.options.keyupTimeout || 0;
        let keyCheckTimer: NodeJS.Timeout = null;
        const extensionActions = {};
        function handleKey(key: string, e: KeyboardEvent) {
            clearTimeout(keyCheckTimer)
            const timeGap = new Date().getTime() - lastKeydownTime;
            if(timeGap >= keyupTimeout && lastKeydownTime!==0){
                lastKeydownTime = 0
                key = key.toLowerCase();
                // 高亮快捷键处理
                const doHighlight = that.target && that.target.canHighlight===true;
                // 获取画笔
                const brush = that.options.brushes.find((colorItem: { shortcut: string; })=>{
                    return colorItem && colorItem.shortcut && colorItem.shortcut.toLowerCase() === key;
                });
                if(doHighlight && brush){
                    that.record({
                        bg: brush.bg,
                        level: brush.level, // TODO 支持 level 级别参数
                    },false);
                } else { // 扩展插件快捷键
                    // @ts-ignore
                    typeof extensionActions[key] === 'function' && extensionActions[key](e,that.target);
                }
            }else {
                keyCheckTimer = setTimeout(()=>{
                    handleKey(key,e)
                },keyupTimeout/4)
            }
        }
        // 销毁 pagenote ，删除所有监听
        if(!hasListened){
            hasListened = true;

            upListen.call(this);

            this.options.functionColors.forEach((actionGroup,groupIndex)=>{
                actionGroup.forEach((action,itemIndex)=>{
                    if(action && action.id){
                        action.eventid = action.id + groupIndex +'_'+ itemIndex;
                        if(action.shortcut){
                            extensionActions[action.shortcut.toLowerCase()] = action.onclick;
                        }
                    }
                });
            });

            document.addEventListener('keydown',(e)=>{
                if(lastKeydownTime===0){
                    lastKeydownTime = new Date().getTime()
                }
                handleKey(e.key,e)
            },{capture:true})

            // 监听单独提取为一个文件 hotkeys
            document.addEventListener('keyup',(e)=>{
                lastKeydownTime = 0
                handleKey(e.key,e)
                clearTimeout(keyCheckTimer)
            },{capture:true});
        }
        this.status = constant.READY;
    };

    this.showActionBar = function () {
        this.status = this.CONSTANT.WAITING;
    }

    this.hideActionBar = function () {
        this.status = this.CONSTANT.PAUSE
    }

    this.destroy = function () {
        this.status = constant.DESTROY;
        document.querySelectorAll('light[data-highlight]').forEach((element:HTMLElement)=>{
            element.outerHTML = element.innerText;
        })
    };

    this.realive = function () {
        this.status = constant.RE_ALIVE;
        this.replay(0,false,true,function (step) {
            return step.isActive;
        });
    };

    this.addListener = function(fun:Function){
        if(typeof fun == "function"){
            CALLBACKFUN.push(fun)
        }
    };

    // success: true,faild:false 增加参数 排序方式，按时间、按网页位置（默认)
    this.record = function(info:Step,showComment:boolean){
        info = Object.assign(this.target,info);
        this.status = constant.RECORDING;
        if(typeof options.beforeRecord === 'function' && options.beforeRecord()===false){
            return;
        }
        const newStep = new IStep(info,StepOptions,function (step) {
            // 2 秒后无操作，自动隐藏
            step.runtime.focusTimer = setTimeout(function () {
                step.runtime.isFocusTag = false;
            },2000)
            setTimeout(function () {
                step.runtime.isFocusTag = true;
            },0)
        });

        this.recordedSteps.add(newStep);
        newStep.connectToKeywordTag(true);
        // 记录时候不排序，无序状态
        this.recordedSteps = this.recordedSteps.sort((a,b)=>{
            const aPos = a.runtime.relatedNodePosition;
            const bPos = b.runtime.relatedNodePosition;
            const compareTop = aPos.top - bPos.top;
            return compareTop === 0 ? (aPos.left - bPos.left) : compareTop;
        });
        window.getSelection().removeAllRanges();
        this.target = {};
        this.makelink((result:any)=>{
            if(!result){
                alert('保存失败了');
                this.recordedSteps.splice(-1,1);
                console.error('记录失败');
                this.status = constant.RECORDFAIL;
                return false
            }
            this.status = constant.RECORDED
        });

        if(showComment){
            newStep.openEditor();
        }
        return newStep
    };

    this.remove = function(stepIndex=-1){
        //删除所有
        if(stepIndex===-1){
            while(this.recordedSteps.length>0){
                this.recordedSteps.splice(0,1)
                this.replay(0,false,false)
            }
            this.status = constant.PAUSE
            this.status = constant.REMOVEDALL;
        }else {
            this.recordedSteps.splice(stepIndex,1)
            this.replay(stepIndex,false,false)
            this.status = constant.REMOVED;
        }
        this.makelink()
    };

    // index 入参修改为array 支持断点点亮
    this.replay = function(index=0,goto=true,autoNext=false,isActive:boolean|Function=true){
        const timeout=this.runningSetting.dura;
        //TODO 根据当前窗口与记录时候窗口大小进行比较，如果差异较大 则进行提示 可能定位不准确的情况
        const runStep = this.recordedSteps[index];
        if(!runStep){
            this.runindex = null
            this.status = constant.DONE
            this.makelink();
            return
        }
        const isActiveLight = typeof isActive == "function" ? isActive(runStep) : isActive;

        clearInterval(runningTimer)
        clearTimeout(nextTimer)
        runningTimer = nextTimer = null
        //开始滚动
        this.runindex = index
        this.status = constant.REPLAYING
        this.lastaction = isActiveLight ? constant.LIGHT : constant.DIS_LIGHT;

        // runStep.highlight(isActiveLight);

        // 如果没有next了 则保存数据
        if(!autoNext){
            this.makelink();
        }

        if(goto){
            runningTimer = runStep.gotoView(()=>{
                this.runindex = null
                if(autoNext){
                    nextTimer = setTimeout(()=>this.replay(index+1,goto
                        ,autoNext,isActive),timeout)
                }else{
                    this.status = constant.DONE
                    clearTimeout(nextTimer)
                }
            })
        }else if(autoNext){
            nextTimer = setTimeout(()=>this.replay(index+1,goto
                ,autoNext,isActive),timeout)
        }
        else{
            this.runindex = null
            this.status = constant.DONE
        }
        this.makelink();
    };

    this.generateMD = ()=>{
        let content = '';
        const steps = this.recordedSteps;
        const url = window.location.href;

        const titleEle = document.querySelector('title');
        const title = titleEle.innerText.trim() || '';

        content += `## [${title}](${url})\n\n`;

        steps.forEach((step)=>{
            const refer = step.text;
            const note = step.tip;
            if(note!==refer&&note){
                content += `${note}\n`;
            }
            content += `> ${refer}\n\n`; // [${time}](${recordInfo})
        });
        content += '\n';
        content = content.trim();
        return content;
    };

    this.capture = (target=document.documentElement || document.body)=>{
        return new Promise((resolve,reject)=>{
            captureElementImage(target).then((imageSrc)=>{
                this.snapshots.push(imageSrc);
                this.makelink();
                showCamera(imageSrc);
                resolve(imageSrc);
            }).catch((e)=>{
                console.error(e);
                reject(e);
                notification({
                    duration: 1000,
                    message: i18n.t('capture_error'),
                    type: 'error'
                })
            });
        })
    };

    const store= debounce( (callback)=> {
        try{
            const simpleSteps = [];
            this.recordedSteps.forEach((step)=>{
                simpleSteps.push(JSON.parse(JSON.stringify(step.data)));
            });

            const differentSetting:Record<string, any> = {};
            let diffSettingCount = 0;
            Object.keys(this.runningSetting).forEach((key)=>{
                if(this.runningSetting[key]!==OPTIONS[key]){
                    differentSetting[key] = this.runningSetting[key];
                    diffSettingCount++
                }
            });

            const images = document.getElementsByTagName('img');
            const storeImages = [];
            for(let i=0; i<images.length; i++) {
                const tempImg = images[i];
                const {width,height,src} = tempImg;
                if(src && width>100 && height>100 && width/height<2 && height/width<2) {
                    storeImages.push(src);
                }
            }

            const storeInfo={
                steps:simpleSteps,
                setting:{},
                images: storeImages,
                snapshots: this.snapshots,
                version: 2,
                categories: this.categories.size>0?Array.from(this.categories):[],
                note: this.note,
            };
            if(diffSettingCount){
                storeInfo.setting = differentSetting;
            }else{
                delete storeInfo.setting
            }

            // TODO 不再将数据存储在URL中，通过shareKey存储
            // const {paramObj,paramKeys} = getParams();
            // if(!paramKeys.includes(constant.ID)){
            //     paramKeys.push(constant.ID)
            // }
            // paramObj[constant.ID]=simpleSteps.length?encryptData(storeInfo):'';
            // this.data = paramObj[constant.ID];
            this.plainData = storeInfo;
            // json parse 避免存储一些异常数据 如 function
            const storeData = simpleSteps.length?JSON.parse(JSON.stringify(storeInfo)):{};
            // let searchString = '';
            // 复原search参数
            // paramKeys.forEach((key,index)=>{
            //     const appendShareSearch = !(key===constant.ID && simpleSteps.length===0);
            //     if(appendShareSearch) {
            //         const appendInfo = paramObj[key]===undefined?'':('='+(paramObj[key]||''));
            //         searchString = searchString + key +  appendInfo + '&'
            //     }
            // });
            // searchString = searchString?'?'+searchString:'';

            // this.url  = location.protocol+"//"+location.host+location.pathname+searchString+location.hash;

            // if(this.options.saveInURL){
            //     history.pushState(emptyString, constant.ID, this.url);
            // }
            this.status = constant.SYNCED
            callback(storeData);
        }catch(e){
            this.status = constant.SYNCED_ERROR
            console.error('保存异常',e)
            callback()
        }
    },1000);

    //TODO 滚动到此 自动展开 ，视线离开 自动收缩
    Object.defineProperty(this,"status",{get:()=>{return status},set:(value=>{
        const originStatus = status;
        if(originStatus===constant.DESTROY && value !== constant.RE_ALIVE){
            return;
        }
        status=value;
        if(status!==originStatus||status===constant.WAITING){
            CALLBACKFUN.forEach(fun=>{
                fun(value,originStatus)
            })
        }
    })});

    this.triggerListener = function (){
        CALLBACKFUN.forEach(fun=>{
            fun(this.status,this.status)
        })
    }
}



PagenoteCore.prototype.i18n = i18n;



