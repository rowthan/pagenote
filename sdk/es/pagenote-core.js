var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import debounce from 'lodash/debounce';
import { captureElementImage, showCamera } from './utils/document';
import { decryptedData, encryptData, prepareSelectionTarget, throttle } from "./utils";
import i18n from "./locale/i18n";
import Step from './pagenote-step';
import Steps from './pagenote-steps';
import { dataToString } from "./utils/data";
import './assets/styles/camera.scss';
import './assets/iconfont/icon.css';
import notification from "./utils/notification";
import console from "./utils/console";
import { getDefaultOption } from "./utils/format";
import merge from 'lodash/merge';
//whats getTarget try catch  同时计算出多个 进行长度比较 取最优的
//将所有常用量进行存储 此处是全局 避免和原本常亮冲突 放到 constant里面
//增加开关 是否开启
export default function PagenoteCore(id, options) {
    var _this = this;
    console.option.showLog = options.debug;
    this.id = id || "pagenote-container";
    this.options = merge(getDefaultOption(), options);
    this.status = this.CONSTANT.UN_INIT;
    var colors = this.options.brushes.map(function (brush) {
        return brush.bg;
    });
    this.recordedSteps = new Steps({
        saveDatas: function () {
            _this.makelink();
        },
        colors: colors
    });
    this.snapshots = [];
    this.categories = new Set();
    this.note = '';
    this.runindex = null;
    var runBarInfo = JSON.parse(JSON.stringify(this.options.barInfo));
    runBarInfo.status = runBarInfo.status || 'fold';
    this.runningSetting = Object.assign({}, {
        dura: this.options.dura,
        autoLight: this.options.autoLight,
        barInfo: runBarInfo,
    });
    this.target = null;
    this.lastEvent = null;
    //用户用户复制的 分享的URL
    this.url = window.location.href;
    //只提供读方法
    this.data = ""; //PagenoteCore 使用的原始数据字符串
    this.plainData = {}; // 与 data 配套，明文的存储数据
    this.lastaction = this.CONSTANT.DIS_LIGHT;
    var status = this.CONSTANT.UN_INIT, nextTimer, runningTimer;
    // 全局变量
    var CALLBACKFUN = [], constant = this.CONSTANT, OPTIONS = this.options, 
    // 网站配置的setting设置
    // location = window.location,
    // emptyString = "",
    isMoble = "ontouchstart" in window;
    var hasListened = false;
    //success no return; failed return errorMsg 持久化存储
    this.makelink = function (callback) {
        _this.status = constant.START_SYNC;
        store(typeof callback === 'function' ? callback : function () {
        });
    };
    var StepOptions = {
        renderAnnotation: OPTIONS.renderAnnotation,
        colors: colors
    };
    // TODO 初始化动效
    this.init = function (initData) {
        var _this = this;
        var simpleStep = [];
        var setting = {};
        if (initData) {
            try {
                var dataObject = void 0;
                if (typeof initData === 'object' && initData.steps) {
                    dataObject = initData;
                    simpleStep = initData.steps || [];
                    setting = initData.setting || {};
                }
                this.snapshots = Array.isArray(dataObject.snapshots) ? dataObject.snapshots : [];
                this.categories = new Set(dataObject.categories);
                this.note = dataObject.note;
            }
            catch (e) {
                console.error('解析step异常', e, initData);
            }
        }
        // 清空当前已有数据
        this.recordedSteps.forEach(function (step) {
            step.delete();
        });
        simpleStep.forEach(function (step) {
            var newStep = new Step(step, StepOptions);
            _this.recordedSteps.add(newStep);
        });
        // 修改当前设置项
        this.runningSetting = Object.assign(this.runningSetting, setting);
        function upListen() {
            var _this = this;
            var that = this;
            var upEvent = isMoble ? 'touchend' : 'mouseup';
            var downEvent = isMoble ? 'touchstart' : 'mousedown';
            var mouseMove = 'mousemove';
            var timeout = that.options.showBarTimeout || 0;
            var lastActionTime = 0;
            var showBarTimer = null;
            var copyTimer = null;
            var isPressingMouse = false;
            var lastPosition = {};
            var startPosition = {};
            // 轮询检测
            var loopCheckStartTime = 0;
            function loopCheck() {
                loopCheckStartTime = new Date().getTime();
                clearInterval(showBarTimer);
                showBarTimer = setInterval(function () {
                    checkShow(new Date().getTime(), function (result) {
                        if (result) {
                            clearInterval(showBarTimer);
                        }
                        else {
                            var loopDuration = new Date().getTime() - loopCheckStartTime;
                            // 最多轮询10s，防止死循环
                            if (loopDuration > 3 * 1000) {
                                clearInterval(showBarTimer);
                            }
                        }
                    });
                }, 100);
                return showBarTimer;
            }
            // 检测是否出bar,判断时长 是否按压、是否有选区
            function checkShow(currentTime, callback) {
                var timeGap = (currentTime || Date.now()) - lastActionTime;
                that.target = prepareSelectionTarget(that.options.enableMarkImg, [startPosition, lastPosition]);
                console.log(that.target);
                // 满足计算条件
                var computeResult = !!that.target && timeGap >= timeout && isPressingMouse;
                if (computeResult) {
                    that.showActionBar();
                }
                else {
                    that.hideActionBar();
                }
                callback && callback(computeResult);
            }
            var debounceTime = 20;
            var selectionChange = throttle(function (e) {
                lastActionTime = new Date().getTime();
                if (document.getSelection().rangeCount === 0) {
                    _this.hideActionBar();
                    return;
                }
                if (timeout > 0) {
                    checkShow(null, function (result) {
                        if (!result) {
                            loopCheck();
                        }
                    });
                }
                clearTimeout(copyTimer);
                copyTimer = setTimeout(function () {
                    var text = document.getSelection().toString();
                    if (text.trim()) {
                        // TODO 优化剪切板方法，写入复制区会导致丢失当前选区
                        // writeTextToClipboard(text);
                        // notification({
                        //  message: '已复制选区至剪切板'
                        // });
                    }
                    console.log('选区', text);
                }, 2000);
            }, debounceTime);
            var onMouseMove = debounce(function (e) {
                if (!isPressingMouse) {
                    return;
                }
                lastPosition = e;
            }, 60);
            document.addEventListener('selectionchange', selectionChange, { capture: true });
            document.addEventListener(downEvent, function (e) {
                that.lastEvent = e;
                isPressingMouse = true;
                startPosition = e;
                lastActionTime = new Date().getTime();
                document.addEventListener(mouseMove, onMouseMove);
            }, { capture: true });
            document.addEventListener(upEvent, function (e) {
                // 这里 timeout 下个周期执行，是为了兼容 Safari。Safari 在 up 时 selection 已清空。
                // 点击按钮也要通过 mouseup 来监听，不能通过 click 事件
                setTimeout(function () {
                    that.lastEvent = e;
                    lastPosition = e;
                    checkShow();
                    lastActionTime = new Date().getTime();
                    isPressingMouse = false;
                    clearInterval(showBarTimer);
                    document.removeEventListener(mouseMove, onMouseMove);
                }, 0);
            }, { capture: true });
        }
        var lastKeydownTime = 0;
        var that = this;
        var keyupTimeout = this.options.keyupTimeout || 0;
        var keyCheckTimer = null;
        var extensionActions = {};
        function handleKey(key, e) {
            clearTimeout(keyCheckTimer);
            var timeGap = new Date().getTime() - lastKeydownTime;
            if (timeGap >= keyupTimeout && lastKeydownTime !== 0) {
                lastKeydownTime = 0;
                key = key.toLowerCase();
                // 高亮快捷键处理
                var doHighlight = that.target && that.target.canHighlight === true;
                // 获取画笔
                var brush = that.options.brushes.find(function (colorItem) {
                    return colorItem && colorItem.shortcut && colorItem.shortcut.toLowerCase() === key;
                });
                if (doHighlight && brush) {
                    that.record({
                        bg: brush.bg,
                        level: brush.level, // TODO 支持 level 级别参数
                    }, false);
                }
                else { // 扩展插件快捷键
                    // @ts-ignore
                    typeof extensionActions[key] === 'function' && extensionActions[key](e, that.target);
                }
            }
            else {
                keyCheckTimer = setTimeout(function () {
                    handleKey(key, e);
                }, keyupTimeout / 4);
            }
        }
        // 销毁 pagenote ，删除所有监听
        if (!hasListened) {
            hasListened = true;
            upListen.call(this);
            this.options.functionColors.forEach(function (actionGroup, groupIndex) {
                actionGroup.forEach(function (action, itemIndex) {
                    if (action && action.id) {
                        action.eventid = action.id + groupIndex + '_' + itemIndex;
                        if (action.shortcut) {
                            extensionActions[action.shortcut.toLowerCase()] = action.onclick;
                        }
                    }
                });
            });
            document.addEventListener('keydown', function (e) {
                if (lastKeydownTime === 0) {
                    lastKeydownTime = new Date().getTime();
                }
                handleKey(e.key, e);
            }, { capture: true });
            // 监听单独提取为一个文件 hotkeys
            document.addEventListener('keyup', function (e) {
                lastKeydownTime = 0;
                handleKey(e.key, e);
                clearTimeout(keyCheckTimer);
            }, { capture: true });
        }
        this.status = constant.READY;
    };
    this.showActionBar = function () {
        this.status = this.CONSTANT.WAITING;
    };
    this.hideActionBar = function () {
        this.status = this.CONSTANT.PAUSE;
    };
    this.destroy = function () {
        this.status = constant.DESTROY;
        document.querySelectorAll('light[data-highlight]').forEach(function (element) {
            element.outerHTML = element.innerText;
        });
    };
    this.realive = function () {
        this.status = constant.RE_ALIVE;
        this.replay(0, false, true, function (step) {
            return step.isActive;
        });
    };
    this.addListener = function (fun) {
        if (typeof fun == "function") {
            CALLBACKFUN.push(fun);
        }
    };
    // success: true,faild:false 增加参数 排序方式，按时间、按网页位置（默认)
    this.record = function (info, showComment) {
        var _this = this;
        info = Object.assign(this.target, info);
        this.status = constant.RECORDING;
        if (typeof options.beforeRecord === 'function' && options.beforeRecord() === false) {
            return;
        }
        var newStep = new Step(info, StepOptions, function (step) {
            // 2 秒后无操作，自动隐藏
            step.runtime.focusTimer = setTimeout(function () {
                step.runtime.isFocusTag = false;
            }, 2000);
            setTimeout(function () {
                step.runtime.isFocusTag = true;
            }, 0);
        });
        this.recordedSteps.add(newStep);
        newStep.connectToKeywordTag(true);
        // 记录时候不排序，无序状态
        this.recordedSteps = this.recordedSteps.sort(function (a, b) {
            var aPos = a.runtime.relatedNodePosition;
            var bPos = b.runtime.relatedNodePosition;
            var compareTop = aPos.top - bPos.top;
            return compareTop === 0 ? (aPos.left - bPos.left) : compareTop;
        });
        window.getSelection().removeAllRanges();
        this.target = {};
        this.makelink(function (result) {
            if (!result) {
                alert('保存失败了');
                _this.recordedSteps.splice(-1, 1);
                console.error('记录失败');
                _this.status = constant.RECORDFAIL;
                return false;
            }
            _this.status = constant.RECORDED;
        });
        if (showComment) {
            newStep.openEditor();
        }
        return newStep;
    };
    this.remove = function (stepIndex) {
        if (stepIndex === void 0) { stepIndex = -1; }
        //删除所有
        if (stepIndex === -1) {
            while (this.recordedSteps.length > 0) {
                this.recordedSteps.splice(0, 1);
                this.replay(0, false, false);
            }
            this.status = constant.PAUSE;
            this.status = constant.REMOVEDALL;
        }
        else {
            this.recordedSteps.splice(stepIndex, 1);
            this.replay(stepIndex, false, false);
            this.status = constant.REMOVED;
        }
        this.makelink();
    };
    // index 入参修改为array 支持断点点亮
    this.replay = function (index, goto, autoNext, isActive) {
        var _this = this;
        if (index === void 0) { index = 0; }
        if (goto === void 0) { goto = true; }
        if (autoNext === void 0) { autoNext = false; }
        if (isActive === void 0) { isActive = true; }
        var timeout = this.runningSetting.dura;
        //TODO 根据当前窗口与记录时候窗口大小进行比较，如果差异较大 则进行提示 可能定位不准确的情况
        var runStep = this.recordedSteps[index];
        if (!runStep) {
            this.runindex = null;
            this.status = constant.DONE;
            this.makelink();
            return;
        }
        var isActiveLight = typeof isActive == "function" ? isActive(runStep) : isActive;
        clearInterval(runningTimer);
        clearTimeout(nextTimer);
        runningTimer = nextTimer = null;
        //开始滚动
        this.runindex = index;
        this.status = constant.REPLAYING;
        this.lastaction = isActiveLight ? constant.LIGHT : constant.DIS_LIGHT;
        // runStep.highlight(isActiveLight);
        // 如果没有next了 则保存数据
        if (!autoNext) {
            this.makelink();
        }
        if (goto) {
            runningTimer = runStep.gotoView(function () {
                _this.runindex = null;
                if (autoNext) {
                    nextTimer = setTimeout(function () { return _this.replay(index + 1, goto, autoNext, isActive); }, timeout);
                }
                else {
                    _this.status = constant.DONE;
                    clearTimeout(nextTimer);
                }
            });
        }
        else if (autoNext) {
            nextTimer = setTimeout(function () { return _this.replay(index + 1, goto, autoNext, isActive); }, timeout);
        }
        else {
            this.runindex = null;
            this.status = constant.DONE;
        }
        this.makelink();
    };
    this.generateMD = function () {
        var content = '';
        var steps = _this.recordedSteps;
        var url = window.location.href;
        var titleEle = document.querySelector('title');
        var title = titleEle.innerText.trim() || '';
        content += "## [" + title + "](" + url + ")\n\n";
        steps.forEach(function (step) {
            var refer = step.text;
            var note = step.tip;
            if (note !== refer && note) {
                content += note + "\n";
            }
            content += "> " + refer + "\n\n"; // [${time}](${recordInfo})
        });
        content += '\n';
        content = content.trim();
        return content;
    };
    this.capture = function (target) {
        if (target === void 0) { target = document.documentElement || document.body; }
        return new Promise(function (resolve, reject) {
            captureElementImage(target).then(function (imageSrc) {
                _this.snapshots.push(imageSrc);
                _this.makelink();
                showCamera(imageSrc);
                resolve(imageSrc);
            }).catch(function (e) {
                console.error(e);
                reject(e);
                notification({
                    duration: 1000,
                    message: i18n.t('capture_error'),
                    type: 'error'
                });
            });
        });
    };
    var store = debounce(function (callback) {
        try {
            var simpleSteps_1 = [];
            _this.recordedSteps.forEach(function (step) {
                simpleSteps_1.push(JSON.parse(JSON.stringify(step.data)));
            });
            var differentSetting_1 = {};
            var diffSettingCount_1 = 0;
            Object.keys(_this.runningSetting).forEach(function (key) {
                if (_this.runningSetting[key] !== OPTIONS[key]) {
                    differentSetting_1[key] = _this.runningSetting[key];
                    diffSettingCount_1++;
                }
            });
            var images = document.getElementsByTagName('img');
            var storeImages = [];
            for (var i = 0; i < images.length; i++) {
                var tempImg = images[i];
                var width = tempImg.width, height = tempImg.height, src = tempImg.src;
                if (src && width > 100 && height > 100 && width / height < 2 && height / width < 2) {
                    storeImages.push(src);
                }
            }
            var storeInfo = {
                steps: simpleSteps_1,
                setting: {},
                images: storeImages,
                snapshots: _this.snapshots,
                version: 2,
                categories: _this.categories.size > 0 ? Array.from(_this.categories) : [],
                note: _this.note,
            };
            if (diffSettingCount_1) {
                storeInfo.setting = differentSetting_1;
            }
            else {
                delete storeInfo.setting;
            }
            // TODO 不再将数据存储在URL中，通过shareKey存储
            // const {paramObj,paramKeys} = getParams();
            // if(!paramKeys.includes(constant.ID)){
            //     paramKeys.push(constant.ID)
            // }
            // paramObj[constant.ID]=simpleSteps.length?encryptData(storeInfo):'';
            // this.data = paramObj[constant.ID];
            _this.plainData = storeInfo;
            // json parse 避免存储一些异常数据 如 function
            var storeData = simpleSteps_1.length ? JSON.parse(JSON.stringify(storeInfo)) : {};
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
            _this.status = constant.SYNCED;
            callback(storeData);
        }
        catch (e) {
            _this.status = constant.SYNCED_ERROR;
            console.error('保存异常', e);
            callback();
        }
    }, 1000);
    //TODO 滚动到此 自动展开 ，视线离开 自动收缩
    Object.defineProperty(this, "status", { get: function () { return status; }, set: (function (value) {
            var originStatus = status;
            if (originStatus === constant.DESTROY && value !== constant.RE_ALIVE) {
                return;
            }
            status = value;
            if (status !== originStatus || status === constant.WAITING) {
                CALLBACKFUN.forEach(function (fun) {
                    fun(value, originStatus);
                });
            }
        }) });
    this.triggerListener = function () {
        var _this = this;
        CALLBACKFUN.forEach(function (fun) {
            fun(_this.status, _this.status);
        });
    };
}
PagenoteCore.prototype.notification = notification;
PagenoteCore.prototype.updateSetting = function (setting) {
    this.options = __assign(__assign({}, this.options), setting);
};
PagenoteCore.prototype.decodeData = function (data) {
    return decryptedData(data);
};
PagenoteCore.prototype.encryptData = function (data) {
    return encryptData(data);
};
PagenoteCore.prototype.exportData = function (template, data) {
    return dataToString(data || this.plainData, template);
};
PagenoteCore.prototype.i18n = i18n;
PagenoteCore.prototype.CONSTANT = {
    ID: "pagenote",
    UN_INIT: -1,
    DESTROY: -9,
    RE_ALIVE: 99,
    WAITING: 0,
    READY: 1,
    RECORDING: 2,
    PAUSE: 3,
    RECORDED: 4,
    REMOVED: -4,
    REMOVEDALL: -5,
    RECORDFAIL: 5,
    FINNISHED: 6,
    REPLAYING: 7,
    PLAYANDWAIT: 8,
    DONE: 9,
    START_SYNC: 100,
    SYNCED: 10,
    SYNCED_ERROR: -10,
    URLCHANGED: 11,
    HASHCHANGED: 12,
    LIGHT: 100,
    DIS_LIGHT: -100,
    SHARE_CONFIRM: 'c',
    SHARE_ING: 'i',
    SHARE_ERROR: 'e',
    SHARE_SUCCESS: 's',
};
PagenoteCore.prototype.version = "5.3.11";
//# sourceMappingURL=pagenote-core.js.map