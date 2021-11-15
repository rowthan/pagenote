import debounce from 'lodash/debounce';
import {getWebIcon, captureElementImage, showCamera} from './utils/document'
import {decryptedData, encryptData, prepareSelectionTarget, throttle} from "./utils";
import i18n from "./locale/i18n";
import { BAR_STATUS } from "./const";
import {Step, Steps} from './pagenote-step';
import { dataToString } from "./utils/data";
import './assets/styles/camera.scss'
import './assets/iconfont/icon.css'
import notification from "./utils/notification";
import console from "./utils/console";
//whats getTarget try catch  同时计算出多个 进行长度比较 取最优的
//将所有常用量进行存储 此处是全局 避免和原本常亮冲突 放到 constant里面

//增加开关 是否开启
export default function PagenoteCore(id, options={}){ // TODO 支持载入语言包
    console.option.showLog = options.debug;
    this.id = id || "pagenote-container";
    this.options =  Object.assign({
        dura:100,
        enableMarkImg: false,
        blacklist:[],
        autoLight: false,
        brushes:[
            {
                bg:'rgba(114,208,255)',
                shortcut:'p',
                label:'',
                level:1,
            },{
                bg:'#ffbea9',
                shortcut:'n',
                label:'',
                level:1,
            }
        ],
        barInfo:{
            right:2,
            top:100,
            status: BAR_STATUS.fold,
        },
        actionBarOffset:{
          offsetX: 10,
          offsetY: 20,
        },
        showIconAnimation: true,
        onShare: null, // function
        functionColors:[],
        sideBarActions:[],
        categories:[],
        showBarTimeout: 20,
        keyupTimeout: 500,
        debug: false,
        autoTag: true, // 自动添加标签
        renderAnnotation: function () {

        },
        // check 函数
        beforeRecord: function () {
            return true;
        }
    },options);
    this.status = this.CONSTANT.UN_INIT;

    const colors = this.options.brushes.filter(function (item) {
        return item && item.bg
    }).map((brush)=>{
        return brush.bg;
    })
    this.recordedSteps = new Steps({
        saveDatas:  ()=> {
            this.makelink()
        },
        colors: colors
    });
    this.snapshots = [];
    this.categories = new Set();
    this.note='';
    this.score=0; // 评分系统
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
    let status,
        nextTimer,
        runningTimer

    let modal = null;// pagenote 弹框，避免重复出现

    // 全局变量
    const CALLBACKFUN = [],
          NULL = null,
          constant = this.CONSTANT,
          OPTIONS = this.options,
          // 网站配置的setting设置
          // location = window.location,
          // emptyString = "",
          isMoble = "ontouchstart" in window;


    let hasListened = false;

    //success no return; failed return errorMsg 持久化存储
    this.makelink = (callback) => {
        this.status = constant.START_SYNC;
        store(typeof callback === 'function' ? callback : function () {
        });
    };

    const StepOptions = {
        renderAnnotation: OPTIONS.renderAnnotation,
        colors: colors
    }
    // TODO 初始化动效
    this.init = function(initData){ // 为一段加密过的数据信息
        let simpleStep = [];
        let setting = {};
        if(initData){
            try {
                let dataObject = {};
                if(typeof initData === 'object' && initData.steps){
                    dataObject = initData;
                    simpleStep = initData.steps || [];
                    setting = initData.setting || {};
                }
                else if(typeof initData === 'string'){
                    dataObject = decryptedData(initData);
                    simpleStep = dataObject.steps || [];
                    setting = dataObject.setting || {};
                }
                this.snapshots = Array.isArray(dataObject.snapshots) ? dataObject.snapshots : [];
                this.categories = new Set(dataObject.categories||[dataObject.category]);
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
            const newStep = new Step(step,StepOptions);
            this.recordedSteps.add(newStep);
        });
        // 修改当前设置项
        this.runningSetting = Object.assign(this.runningSetting,setting);

        // 销毁 pagenote ，删除所有监听
        if(!hasListened){
            hasListened = true;

            upListen.call(this);

            function upListen() {
                const that = this;
                const upEvent = isMoble?'touchend':'mouseup';
                const downEvent = isMoble?'touchstart' :'mousedown';
                const mouseMove = 'mousemove';

                const timeout = that.options.showBarTimeout || 0;
                let lastActionTime = 0;
                let showBarTimer = null;
                let copyTimer = null;
                let isPressingMouse = false;
                let lastPosition = {};
                let startPosition = {};

                // 轮询检测
                let loopCheckStartTime = 0;
                function loopCheck(){
                    loopCheckStartTime = new Date().getTime();
                    clearInterval(showBarTimer)
                    showBarTimer = setInterval(function () {
                        checkShow(new Date().getTime(),function (result) {
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
                function checkShow(currentTime,callback) {
                    const timeGap = (currentTime || new Date().getTime()) - lastActionTime;
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
                        checkShow(null,function (result,target) {
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

            const extensionActions = {};
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

            let lastKeydownTime = 0;
            const that = this;
            const keyupTimeout = this.options.keyupTimeout || 0;
            let keyCheckTimer = null;
            function handleKey(key,e) {
                clearTimeout(keyCheckTimer)
                const timeGap = new Date().getTime() - lastKeydownTime;
                if(timeGap >= keyupTimeout && lastKeydownTime!==0){
                    lastKeydownTime = 0
                    key = key.toLowerCase();
                    // 高亮快捷键处理
                    const doHighlight = that.target && that.target.canHighlight===true;
                    // 获取画笔
                    const brush = that.options.brushes.find((colorItem)=>{
                        return colorItem && colorItem.shortcut && colorItem.shortcut.toLowerCase() === key;
                    });
                    if(doHighlight && brush){
                        that.record({
                            bg: brush.bg,
                            level: brush.level, // TODO 支持 level 级别参数
                        },false);
                    } else if(typeof extensionActions[key] === 'function'){ // 扩展插件快捷键
                        extensionActions[key](e,that.target);
                    }
                }else {
                    keyCheckTimer = setTimeout(()=>{
                        handleKey(key,e)
                    },keyupTimeout/4)
                }
            }

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

        // if(sync){
        //     this.makelink();
        // }
    };

    this.showActionBar = function () {
        this.status = this.CONSTANT.WAITING;
    }

    this.hideActionBar = function () {
        this.status = this.CONSTANT.PAUSE
    }

    this.destroy = function () {
        this.status = constant.DESTROY;
        document.querySelectorAll('light[data-highlight]').forEach((element)=>{
            element.outerHTML = element.innerText;
        })
    };

    this.realive = function () {
        this.status = constant.RE_ALIVE;
        this.replay(0,false,true,function (step) {
            return step.isActive;
        });
    };

    // this.toggleAllLight = function () {
    //     const lightAll = this.lastaction===this.CONSTANT.DIS_LIGHT;
    //     this.replay(0,false,true,lightAll);
    //     if(lightAll===false){
    //         this.runningSetting.autoLight = false;
    //     }
    // };

    this.addListener = function(fun){
        if(typeof fun == "function"){
            CALLBACKFUN.push(fun)
        }
    };

    // success: true,faild:false 增加参数 排序方式，按时间、按网页位置（默认)
    this.record = function(info={},showComment){
        info = Object.assign(this.target,info);
        this.status = constant.RECORDING;
        if(typeof options.beforeRecord === 'function' && options.beforeRecord()===false){
            return;
        }
        const newStep = new Step(info,StepOptions,function (step) {
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
        this.makelink((result)=>{
            if(!result){
                alert(i18n.t('save_failed'));
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

    this.remove = function(stepIndex=-1,id){
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
    this.replay = function(index=0,goto=true,autoNext=false,isActive=true){
        const timeout=this.runningSetting.dura;
        //TODO 根据当前窗口与记录时候窗口大小进行比较，如果差异较大 则进行提示 可能定位不准确的情况
        const runStep = this.recordedSteps[index];
        if(!runStep){
            this.runindex = NULL
            this.status = constant.DONE
            this.makelink();
            return
        }
        const isActiveLight = typeof isActive == "function" ? isActive(runStep) : isActive;

        clearInterval(runningTimer)
        clearTimeout(nextTimer)
        runningTimer = nextTimer = NULL
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
                this.runindex = NULL
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
            this.runindex = NULL
            this.status = constant.DONE
        }
        this.makelink();
    };

    this.openModal = (activeTab='md')=>{

        if(modal&&modal.show){
            modal.changeTab(activeTab);
            modal.initData();
        } else {
            modal = document.createElement('pagenote-modal');
            modal.setAttribute('show',true);
            modal.setAttribute('activeTab',activeTab);
            document.body.appendChild(modal);
        }
    };

    this._syncModal = ()=>{
        if(modal){
            modal.initData();
        }
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

            const differentSetting = {};
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

            const titleEle = document.querySelector('title');
            const descriptionEle = document.querySelector('meta[name=description]');
            const now = new Date().getTime();
            const storeInfo={
                steps:simpleSteps,
                setting:{},
                url: window.location.href,
                lastModified: now,
                createAt: this.plainData.createAt || now,
                icon:getWebIcon(),
                title: titleEle? titleEle.innerText.trim() :'',
                description: descriptionEle? descriptionEle.content : '',
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
            console.error(e)
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

PagenoteCore.prototype.notification = notification;

PagenoteCore.prototype.updateSetting = function (setting) {
    this.options = {
        ...this.options,
        ...setting,
    }
}

PagenoteCore.prototype.decodeData = function(data) {
    return decryptedData(data);
};
PagenoteCore.prototype.encryptData = function(data) {
    return encryptData(data)
};

PagenoteCore.prototype.exportData = function (template,data) {
    return dataToString(data||this.plainData,template)
}

PagenoteCore.prototype.i18n = i18n;

PagenoteCore.prototype.CONSTANT = {
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

    STORE_KEYS_VERSION_2_VALIDATE:["x","y","id","text","tip","bg","time","isActive","offsetX","offsetY","parentW","pre","suffix","images","level","lightStatus","annotationStatus"],
};

PagenoteCore.prototype.version = "4.8.0-typescript";
