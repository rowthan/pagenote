import md5 from "blueimp-md5";
import { getScroll, writeTextToClipboard } from "./utils/document";
import toggleLightMenu from "./light-menu";
import modal from "./utils/modal";
import { AnnotationStatus, LightStatus, STORE_KEYS_VERSION_2_VALIDATE } from "./step/const";
import initKeywordTags from "./step/step-initKeywordTags";
import initAnnotation from "./step/step-initAnnotation";
import stepGotoView from "./step/step-gotoView";
import connectToKeywordTag from './step/step-connectToKeywordTag';
import notification from "./utils/notification";
var editorModal = new modal();
var Step = /** @class */ (function () {
    function Step(info, options, callback) {
        var _this = this;
        this.options = options;
        this.listeners = {
            data: {},
            runtime: {},
        };
        // 初始化需要持久化存储的数据
        var data = {
            lightStatus: LightStatus.LIGHT,
            annotationStatus: AnnotationStatus.SHOW,
            lightId: md5(info.id + info.text),
        };
        var that = this;
        this.data = new Proxy(data, {
            set: function (target, key, value) {
                var _a;
                if (target[key] === value) {
                    return false;
                }
                Reflect.set(target, key, value);
                for (var i in that.listeners.data) {
                    var fun = that.listeners.data[i];
                    typeof fun === 'function' && fun(target, key, value);
                }
                var saveFun = (_a = that === null || that === void 0 ? void 0 : that.options) === null || _a === void 0 ? void 0 : _a.save;
                if (saveFun) {
                    saveFun(data);
                }
                return true;
            }
        });
        STORE_KEYS_VERSION_2_VALIDATE.forEach(function (key) {
            _this.data[key] = info[key];
            if (key === 'lightStatus') {
                _this.data[key] = info[key] === undefined ? (info['isActive'] ? LightStatus.LIGHT : LightStatus.UN_LIGHT) : info[key];
            }
            else if (key === 'annotationStatus') {
                if (info[key] === undefined) {
                    _this.data.annotationStatus = _this.data.lightStatus === LightStatus.LIGHT ? AnnotationStatus.SHOW : AnnotationStatus.HIDE;
                }
            }
        });
        // 初始化运行时产生的数据，不需要持久化存储
        var runtime = {
            warn: '',
            isVisible: false,
            isFocusTag: false,
            isFocusAnnotation: false,
            relatedNode: [],
            relatedNodePosition: { top: 0, left: 0 },
            relatedAnnotationNode: null,
            focusTimer: null,
            annotationDrag: null,
            editing: false,
            lighting: '', // 是否需要高亮提醒
        };
        var listenShortcut = function (e) {
            var key = e.key;
            if (Step.lastFocus !== that.data.lightId) {
                return;
            }
            if (key === 'Escape') {
                that.runtime.editing = false;
                return;
            }
            // 编辑中
            if (that.runtime.editing) {
                return;
            }
            switch (key) {
                case 'c':
                    var scroll_1 = getScroll();
                    var relatedNote = that.runtime.relatedNode[0];
                    var offset = -50;
                    if (relatedNote) {
                        offset += relatedNote.offsetHeight * -1;
                    }
                    that.copyToClipboard(false, {
                        x: "" + (that.data.x - scroll_1.x),
                        y: "" + (that.data.y - scroll_1.y + offset),
                    });
                    break;
                case 'm':
                    that.openEditor(true);
                    break;
                case '`':
                    that.changeStatus(1);
                    break;
                case 'p':
                    var status_1 = that.data.annotationStatus === AnnotationStatus.SHOW ? AnnotationStatus.HIDE : AnnotationStatus.SHOW;
                    that.data.annotationStatus = status_1;
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
                    var index = Number(key) - 1;
                    var color = options.colors[index];
                    if (color) {
                        that.data.bg = color;
                        return;
                    }
                    if (Number.isInteger(index) && index >= 0) {
                        notification({
                            duration: 1000,
                            message: "\u53EA\u6709" + options.colors.length + "\u53EA\u753B\u7B14\uFF0C\u65E0\u6CD5\u4F7F\u7528\u7B2C" + key + "\u53EA",
                            type: 'error'
                        });
                    }
            }
            // e.stopPropagation();
        };
        this.runtime = new Proxy(runtime, {
            set: function (target, key, value) {
                // TODO 数组无法监听到 relatedNode
                if (target[key] === value) {
                    return false;
                }
                Reflect.set(target, key, value);
                var isFocus = target.isFocusTag || target.isFocusAnnotation || target.editing;
                // target.lighting = isFocus;
                for (var i in that.listeners.runtime) {
                    var fun = that.listeners.runtime[i];
                    typeof fun === 'function' && fun(target, key, value);
                }
                if (['lighting', 'isFocusTag', 'isFocusAnnotation', 'editing'].includes(key)) {
                    // @ts-ignore
                    that.steps.lastFocus = that.data.lightId;
                    if (isFocus) {
                        // console.log('add listener',target.isFocusAnnotation,target.isFocusTag)
                        document.addEventListener('keyup', listenShortcut, { capture: true });
                    }
                    else {
                        // console.log('remove keyup',target.isFocusAnnotation,target.isFocusTag)
                        document.removeEventListener('keyup', listenShortcut, { capture: true });
                    }
                }
                return true;
            }
        });
        typeof callback === 'function' && callback(this);
    }
    Step.prototype.init = function () {
        this.initKeywordTags();
        this.initAnnotation();
    };
    Step.prototype.initKeywordTags = function () {
        initKeywordTags.call(this);
    };
    Step.prototype.initAnnotation = function () {
        initAnnotation.call(this);
    };
    Step.prototype.gotoView = function () {
        stepGotoView.call(this);
    };
    Step.prototype.lighting = function () {
        var _this = this;
        this.runtime.lighting = 'light';
        setTimeout(function () {
            _this.runtime.lighting = '';
        }, 2000);
    };
    Step.prototype.connectToKeywordTag = function () {
        connectToKeywordTag.call(this);
    };
    Step.prototype.changeStatus = function (cnt) {
        var finalStatus = LightStatus.UN_LIGHT;
        if (cnt !== 0) {
            finalStatus = this.data.lightStatus + cnt;
        }
        if (finalStatus > LightStatus.LIGHT) {
            finalStatus = LightStatus.UN_LIGHT;
        }
        else if (finalStatus < LightStatus.UN_LIGHT) {
            finalStatus = LightStatus.LIGHT;
        }
        this.data.annotationStatus = finalStatus === LightStatus.LIGHT ? AnnotationStatus.SHOW : AnnotationStatus.HIDE;
        this.data.lightStatus = finalStatus;
    };
    Step.prototype.delete = function () {
        this.runtime.relatedNode.forEach(function (element) {
            element.remove();
        });
        this.runtime.relatedAnnotationNode.remove();
        // @ts-ignore
        this.steps.removeStep(this.data.lightId);
        toggleLightMenu(false);
        editorModal.destroy();
    };
    Step.prototype.copyToClipboard = function (copyAll, position) {
        var _this = this;
        if (copyAll === void 0) { copyAll = false; }
        var value = copyAll ? (this.data.text + '\n' + this.data.tip) : this.data.text;
        writeTextToClipboard(value).then(function (r) {
            notification({
                type: "success",
                message: "\u5DF2\u590D\u5236\u3010" + value + "\u3011",
                color: _this.data.bg,
                duration: 3000,
                position: position
            });
        });
    };
    Step.prototype.addListener = function (fun, isRuntime, funId) {
        if (isRuntime === void 0) { isRuntime = false; }
        if (funId === void 0) { funId = 'default-change-fun'; }
        var runtimeKey = isRuntime ? 'runtime' : 'data';
        this.listeners[runtimeKey][funId] = fun;
    };
    Step.prototype.getCurrentIndex = function () {
        var _a, _b;
        var index = -1;
        // @ts-ignore
        for (var i = 0; i < this.steps.length; i++) {
            // @ts-ignore
            if (((_b = (_a = this.steps[i]) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.lightId) === this.data.lightId) {
                index = i;
                break;
            }
        }
        return index;
    };
    Step.prototype.openEditor = function (show) {
        this.runtime.editing = show;
    };
    Step.prototype.getNear = function (loop) {
        if (loop === void 0) { loop = false; }
        var current = this.getCurrentIndex();
        if (current === -1) {
            return [];
        }
        // @ts-ignore
        var pre = this.steps[current - 1], next = this.steps[current + 1];
        if (loop) {
            if (current === 0) {
                // @ts-ignore
                pre = this.steps[this.steps.length - 1];
                // @ts-ignore
            }
            else if (current === this.steps.length - 1) {
                next = 0;
            }
        }
        return [pre, next];
    };
    return Step;
}());
export default Step;
//# sourceMappingURL=pagenote-step.js.map