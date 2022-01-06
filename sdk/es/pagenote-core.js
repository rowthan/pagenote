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
import { decryptedData, encryptData, prepareSelectionTarget, throttle } from "./utils";
import i18n from "./locale/i18n";
import IStep from './pagenote-step';
import { dataToString } from "./utils/data";
import './assets/styles/camera.scss';
import './assets/iconfont/icon.css';
import notification from "./utils/notification";
import console from "./utils/console";
import { getDefaultOption } from "./utils/format";
import merge from 'lodash/merge';
import { isMoble } from "./utils/device";
var PagenoteCore = /** @class */ (function () {
    function PagenoteCore(id, options) {
        this.CONSTANT = {
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
        this.i18n = __assign({}, i18n);
        console.option.showLog = options.debug;
        this.id = id || "pagenote-container";
        this.options = merge(getDefaultOption(), options);
        this.status = this.CONSTANT.UN_INIT;
        var colors = this.options.brushes.map(function (brush) {
            return brush.bg;
        });
        this.options.brushes.forEach(function (brush) {
            if (brush.shortcut) {
            }
        });
    }
    PagenoteCore.prototype.init = function (initData) {
        var _this = this;
        this.plainData.steps.forEach(function (step) {
            step.delete();
        });
        this.plainData = __assign(__assign({}, initData), { steps: [] });
        initData.steps.forEach(function (item) {
            _this.record(item);
        });
        this.addKeyDownListener();
        this.addKeyUpListener();
        this.addMoveListener();
        this.addSelectionListener();
        this.addShortCutListener();
    };
    // record
    PagenoteCore.prototype.record = function (targetInfo, callback) {
        var _this = this;
        var info = merge(this.target, targetInfo);
        this.status = this.CONSTANT.RECORDING;
        var check = this.options.beforeRecord();
        if (check !== true) {
            return;
        }
        var newStep = new IStep(info, {
            colors: [],
            getIndex: this.getStepIndex,
            remove: this.removeStep,
            renderAnnotation: undefined,
            save: this.save
        }, function (step) {
            step.runtime.isFocusTag = true;
            setTimeout(function () {
                step.runtime.isFocusTag = false;
            }, 2000);
            _this.plainData.steps.push(newStep);
            _this.plainData.steps = _this.plainData.steps.sort(function (a, b) {
                var aPos = a.runtime.relatedNodePosition;
                var bPos = b.runtime.relatedNodePosition;
                var compareTop = aPos.top - bPos.top;
                return compareTop === 0 ? (aPos.left - bPos.left) : compareTop;
            });
            window.getSelection().removeAllRanges();
            _this.target = null;
            callback && callback(newStep);
        });
    };
    // start
    PagenoteCore.prototype.addKeyDownListener = function () {
        var _this = this;
        var downEvent = isMoble ? 'touchstart' : 'mousedown';
        var onDown = debounce(function (e) {
            _this._runtime.lastEvent = e;
            _this._runtime.startPosition = e;
            _this._runtime.lastKeydownTime = Date.now();
        }, 10);
        document.addEventListener(downEvent, onDown, { capture: true });
    };
    // move
    PagenoteCore.prototype.addMoveListener = function () {
        var _this = this;
        var downEvent = isMoble ? 'touchmove' : 'mousemove';
        var onMouseMove = debounce(function (e) {
            _this._runtime.lastPosition = e;
        }, 60);
        document.addEventListener(downEvent, onMouseMove, { capture: true });
    };
    // select
    PagenoteCore.prototype.addSelectionListener = function () {
        var _this = this;
        var lastActionTime = 0;
        var selectionChange = throttle(function () {
            lastActionTime = new Date().getTime();
            _this.target = prepareSelectionTarget(_this.options.enableMarkImg, [_this._runtime.startPosition, _this._runtime.lastPosition]);
            if (_this.target === null) {
                _this.hideActionBar();
            }
            else {
                _this.showActionBar();
            }
        }, 200);
        document.addEventListener('selectionchange', selectionChange, { capture: true });
    };
    // end
    PagenoteCore.prototype.addKeyUpListener = function () {
        var downEvent = isMoble ? 'touchstart' : 'mousedown';
        var that = this;
        var onUp = function (e) {
            that._runtime.lastEvent = e;
        };
        document.addEventListener(downEvent, onUp, { capture: true });
    };
    // shortcut listener
    PagenoteCore.prototype.addShortCutListener = function () {
        var keyCheckTimer;
        var that = this;
        var keyupTimeout = that.options.keyupTimeout;
        var handleKey = function (e) {
            var key = e.key.toLowerCase();
            clearTimeout(keyCheckTimer);
            var timeGap = Date.now() - (that._runtime.lastKeydownTime || Date.now());
            if (timeGap >= keyupTimeout) {
                // 高亮快捷键处理
                var doHighlight = that.target !== null;
                // 获取画笔
                var brush = that.options.brushes.find(function (colorItem) {
                    return colorItem && colorItem.shortcut && colorItem.shortcut.toLowerCase() === key;
                });
                if (doHighlight && brush) {
                    that.record({
                        bg: brush.bg,
                        level: brush.level,
                    });
                }
                else { // 扩展插件快捷键
                    var fun = that.options.functionColors.find(function (item) {
                        return (item.shortcut || '').toLowerCase() === item.shortcut;
                    });
                    if (fun) {
                        fun.onclick(e, that.target);
                    }
                }
            }
            else {
                keyCheckTimer = setTimeout(function () {
                    handleKey(e);
                }, keyupTimeout / 4);
            }
        };
        document.addEventListener('keyup', handleKey, { capture: true });
    };
    PagenoteCore.prototype.addListener = function (fun) {
        this._listeners.push(fun);
    };
    PagenoteCore.prototype.showActionBar = function () {
        this.status = this.CONSTANT.WAITING;
    };
    PagenoteCore.prototype.hideActionBar = function () {
        this.status = this.CONSTANT.PAUSE;
    };
    PagenoteCore.prototype.getStepIndex = function (lightId) {
        var index = -1;
        var steps = this.plainData.steps;
        for (var i = 0; i < steps.length; i++) {
            if (steps[i].data.lightId === lightId) {
                index = i;
                break;
            }
        }
        return index;
    };
    PagenoteCore.prototype.removeStep = function (lightId) {
        var steps = this.plainData.steps;
        for (var i = 0; i < steps.length; i++) {
            var item = steps[i];
            if (lightId === item.data.lightId) {
                steps.splice(i, 1);
                break;
            }
        }
        this.save();
    };
    PagenoteCore.prototype.save = function () {
    };
    PagenoteCore.prototype.notification = function (message) {
        notification(message);
    };
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
    PagenoteCore.version = "5.3.11";
    return PagenoteCore;
}());
export default PagenoteCore;
//# sourceMappingURL=pagenote-core.js.map