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
import md5 from "blueimp-md5";
import { getScroll, writeTextToClipboard } from "./utils/document";
import toggleLightMenu from "./light-menu";
import modal from "./utils/modal";
import initKeywordTags from "./step/step-initKeywordTags";
import initAnnotation from "./step/step-initAnnotation";
import stepGotoView from "./step/step-gotoView";
import connectToKeywordTag from './step/step-connectToKeywordTag';
import notification from "./utils/notification";
import { AnnotationStatus, LightStatus, } from './common/Types';
var editorModal = new modal();
// interface InitSuccessCallback {
//   ():
// }
var IStep = /** @class */ (function () {
    function IStep(initData, options, callback) {
        this.options = options;
        this.listeners = {
            data: {},
            runtime: {},
        };
        // 初始化需要持久化存储的数据
        var data = __assign(__assign({}, initData), { lightId: md5(initData.id + initData.text) });
        var that = this;
        this.data = new Proxy(data, {
            set: function (target, key, value) {
                var _a;
                if (target[key] === value) {
                    return true;
                }
                Reflect.set(target, key, value);
                for (var i in that.listeners.data) {
                    var fun = that.listeners.data[i];
                    typeof fun === 'function' && fun(target, key, value);
                }
                var saveFun = (_a = that === null || that === void 0 ? void 0 : that.options) === null || _a === void 0 ? void 0 : _a.triggerChanged;
                if (saveFun) {
                    saveFun(data);
                }
                return true;
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
            if (IStep.lastFocus !== that.data.lightId) {
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
                    return true;
                }
                Reflect.set(target, key, value);
                var isFocus = target.isFocusTag || target.isFocusAnnotation || target.editing;
                // target.lighting = isFocus;
                for (var i in that.listeners.runtime) {
                    var fun = that.listeners.runtime[i];
                    typeof fun === 'function' && fun(target, key, value);
                }
                if (['lighting', 'isFocusTag', 'isFocusAnnotation', 'editing'].includes(key)) {
                    IStep.lastFocus = that.data.lightId;
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
        this.initKeywordTags();
        this.initAnnotation();
        typeof callback === 'function' && callback(this);
    }
    IStep.prototype.initKeywordTags = function () {
        initKeywordTags.call(this);
    };
    IStep.prototype.initAnnotation = function () {
        initAnnotation.call(this);
    };
    IStep.prototype.gotoView = function () {
        stepGotoView.call(this);
    };
    IStep.prototype.lighting = function () {
        var _this = this;
        this.runtime.lighting = 'light';
        setTimeout(function () {
            _this.runtime.lighting = '';
        }, 2000);
    };
    IStep.prototype.connectToKeywordTag = function () {
        connectToKeywordTag.call(this);
    };
    IStep.prototype.changeStatus = function (cnt) {
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
    IStep.prototype.delete = function () {
        this.runtime.relatedNode.forEach(function (element) {
            element.remove();
        });
        this.runtime.relatedAnnotationNode.remove();
        this.options.remove(this.data.lightId);
        toggleLightMenu(false);
        editorModal.destroy();
    };
    IStep.prototype.copyToClipboard = function (copyAll, position) {
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
    IStep.prototype.addListener = function (fun, isRuntime, funId) {
        if (isRuntime === void 0) { isRuntime = false; }
        if (funId === void 0) { funId = 'default-change-fun'; }
        var runtimeKey = isRuntime ? 'runtime' : 'data';
        this.listeners[runtimeKey][funId] = fun;
    };
    IStep.prototype.openEditor = function (show) {
        this.runtime.editing = show;
    };
    IStep.prototype.toJSON = function () {
        return JSON.parse(JSON.stringify(this.data));
    };
    return IStep;
}());
export default IStep;
//# sourceMappingURL=pagenote-step.js.map