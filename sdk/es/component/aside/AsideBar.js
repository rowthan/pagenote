var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { Component } from 'react';
import BigPicture from "bigpicture";
import { BAR_STATUS } from '@/const';
import { moveable } from "@/utils/document";
import RemoveIcon from '@/assets/images/remove.svg';
import LightRefAnotation from "./LightRefAnotation";
import sideStyle from './aside.scss';
import Tip from "../tip/Tip";
import LightActionBar from "@/component/LightActionBar";
import Tags from "./Tags";
import { LightStatus } from "@/common/Types";
import ExpandIcon from '@/assets/images/expand.svg';
var lastTop = -1;
var pagenote = null;
function computeTop(top) {
    var containerHeight = window.innerHeight - 30 - 16;
    var result = top / document.documentElement.scrollHeight * containerHeight + 30 + 16;
    result = Math.min(top, result, containerHeight);
    if (lastTop > 0 && Math.abs(result - lastTop) < 24) { // 同一行最多可以展示同样y值的4个，否则会被覆盖
        result = lastTop + 16;
    }
    lastTop = result;
    return result;
}
var AsideBar = /** @class */ (function (_super) {
    __extends(AsideBar, _super);
    function AsideBar(props) {
        var _this = _super.call(this) || this;
        _this.setCategories = function (categories) {
            _this.pagenote.categories = categories;
            _this.pagenote.makelink();
        };
        _this.removeSnapshot = function (index) {
            _this.pagenote.snapshots.splice(index, 1);
            _this.pagenote.makelink();
        };
        _this.capture = function () {
            _this.pagenote.capture();
            _this.setState({
                capturing: true,
            }, function () {
                setTimeout(function () {
                    _this.setState({
                        capturing: false,
                    });
                }, 3000);
            });
        };
        _this.setLastFocus = function (info) {
            _this.setState({
                lastFocus: info,
            });
        };
        pagenote = _this.pagenote = props.pagenote;
        _this.toggleAllLight = _this.toggleAllLight.bind(_this);
        _this.toggleAutoLight = _this.toggleAutoLight.bind(_this);
        _this.replay = _this.replay.bind(_this);
        _this.toggleSideBar = _this.toggleSideBar.bind(_this);
        _this.state = {
            barInfo: pagenote.runningSetting.barInfo,
            steps: pagenote.recordedSteps,
            snapshots: pagenote.snapshots || [],
            categories: pagenote.categories,
            note: pagenote.note,
            autoLight: pagenote.runningSetting.autoLight,
            highlightAll: pagenote.highlightAll,
            runindex: pagenote.runindex,
            capturing: false,
            title: pagenote.plainData.title,
            run: false,
            lastFocus: '',
            allStepStatus: 0,
        };
        pagenote.addListener(_this.refreshStatus.bind(_this));
        return _this;
    }
    AsideBar.prototype.refreshStatus = function () {
        this.setState({
            barInfo: pagenote.runningSetting.barInfo,
            steps: pagenote.recordedSteps || [],
            categories: pagenote.categories,
            note: pagenote.note || '',
            snapshots: pagenote.snapshots || [],
            autoLight: pagenote.runningSetting.autoLight || false,
            highlightAll: pagenote.highlightAll || false,
            runindex: pagenote.runindex,
            status: pagenote.status,
            title: pagenote.plainData.title,
            run: [pagenote.CONSTANT.REPLAYING, pagenote.CONSTANT.START_SYNC].includes(pagenote.status)
        });
    };
    AsideBar.prototype.toggleAllLight = function () {
        var pagenote = this.pagenote;
        var nextStatus = this.state.allStepStatus + 1;
        var finalStatus = nextStatus > 2 ? 0 : nextStatus;
        pagenote.recordedSteps.forEach(function (light) {
            light.data.lightStatus = finalStatus;
            light.data.annotationStatus = finalStatus === 2 ? 1 : 0;
            if (finalStatus === LightStatus.LIGHT) {
                light.connectToKeywordTag(true);
            }
        });
        this.setState({
            allStepStatus: finalStatus
        });
    };
    ;
    AsideBar.prototype.toggleAutoLight = function () {
        var pagenote = this.pagenote;
        pagenote.runningSetting.autoLight = !pagenote.runningSetting.autoLight;
        pagenote.makelink();
    };
    ;
    AsideBar.prototype.replay = function () {
        var _a;
        (_a = this.pagenote).replay.apply(_a, arguments);
        this.refreshStatus();
    };
    AsideBar.prototype.changeLightStatus = function (index) {
        this.pagenote.replay(index, true, true, false, true);
        this.pagenote.recordedSteps[index].writing = true;
        this.refreshStatus();
    };
    AsideBar.prototype.toggleSideBar = function () {
        var newStatus = this.state.barInfo.status || '';
        var barInfo = this.pagenote.runningSetting.barInfo;
        if (newStatus === BAR_STATUS.expand) {
            newStatus = BAR_STATUS.fold;
        }
        else {
            newStatus = BAR_STATUS.expand;
        }
        barInfo.status = newStatus;
        this.pagenote.makelink();
    };
    AsideBar.prototype.setRef = function (dom) {
        var _this = this;
        var pagenote = this.pagenote;
        if (this.sideEl) {
            return;
        }
        this.sideEl = dom;
        var timer = null;
        moveable(dom, function (e) {
            var x = e.clientX + 50;
            var y = e.clientY - 10;
            var origin = pagenote.runningSetting.barInfo;
            origin.right = Math.max(1, (document.documentElement.clientWidth - x - 10));
            origin.right = Math.min(origin.right, document.documentElement.clientWidth - 20);
            origin.top = Math.max(Math.min(document.documentElement.clientHeight - 200, y), 0);
            clearTimeout(timer);
            timer = setTimeout(function () {
                pagenote.makelink();
            }, 600);
            _this.setState({
                barInfo: pagenote.runningSetting.barInfo,
            });
        }, false);
    };
    AsideBar.prototype.confirmShare = function () {
        this.pagenote.options.onShare(this.pagenote);
    };
    AsideBar.prototype.toggleHideSideBar = function () {
        var newStatus = this.state.barInfo.status || '';
        if (newStatus.indexOf(BAR_STATUS.expand) > -1) {
            newStatus = BAR_STATUS.fold;
        }
        else {
            newStatus = BAR_STATUS.expand;
        }
        var barInfo = this.pagenote.runningSetting.barInfo;
        barInfo.status = newStatus;
        this.setState({
            barInfo: barInfo,
        });
        this.pagenote.makelink();
    };
    AsideBar.prototype.bigPicture = function (e, snapshot, gallery, index) {
        if (gallery === void 0) { gallery = []; }
        if (index === void 0) { index = 0; }
        BigPicture({
            el: e.target,
            // imgSrc: snapshot,
            gallery: gallery,
            position: index,
            animationEnd: function () {
            },
        });
    };
    AsideBar.prototype.render = function () {
        var _this = this;
        var _a = this.state, status = _a.status, barInfo = _a.barInfo, steps = _a.steps, runindex = _a.runindex, categories = _a.categories, snapshots = _a.snapshots, allStepStatus = _a.allStepStatus;
        var barStatus = barInfo.status || '';
        var isExpand = barStatus === BAR_STATUS.expand;
        var showBar = steps.length > 0 || snapshots.length > 0;
        var top = barInfo.top;
        barInfo.right = Math.min(document.documentElement.clientWidth - 200, barInfo.right);
        var right = Math.max(barInfo.right, 0);
        var colorSet = new Set();
        steps.forEach(function (step) {
            colorSet.add(step.lightBg || step.bg);
        });
        var message = '浅高亮';
        if (allStepStatus === 1) {
            message = '深高亮';
        }
        else if (allStepStatus === 2) {
            message = '深高亮&显示批注';
        }
        return (status === this.pagenote.CONSTANT.DESTROY ? '' :
            React.createElement(React.Fragment, null, showBar &&
                React.createElement("pagenote-aside", { "data-status": isExpand ? 'expand' : 'fold', style: { right: right + 'px', top: top + 'px', position: 'fixed' } },
                    React.createElement("pagenote-actions", { ref: this.setRef.bind(this) },
                        React.createElement("pagenote-all-actions", null,
                            React.createElement(Tip, { placement: 'right', inner: true, message: message },
                                React.createElement("pagenote-light-aside-item-sign", { "data-level": 1, "data-active": allStepStatus, onClick: function () { _this.toggleAllLight(); } }))),
                        React.createElement("pagenote-action", { "data-status": isExpand ? 'expand' : '', "data-action": 'toggle', onClick: this.toggleHideSideBar.bind(this) },
                            React.createElement(ExpandIcon, null))),
                    React.createElement("pagenote-lights", null, steps.map(function (record, index) { return (React.createElement(StepSign, { key: record.lightId, step: record, index: index, running: index === runindex, dot: false, lastFocusId: _this.state.lastFocus, colors: _this.pagenote.options.brushes.filter(function (item) {
                            return item && item.bg;
                        }).map(function (brush) { return brush.bg; }), onClick: function (e) {
                            _this.setLastFocus(record.lightId);
                            record.lighting();
                        } })); })),
                    React.createElement("pagenote-infos", null,
                        React.createElement(Tags, { allTags: this.pagenote.options.categories, initTagSets: categories, onchange: function (values) { _this.setCategories(values); } }),
                        React.createElement("pagenote-snapshots", null, snapshots.map(function (img, index) { return (React.createElement("pagenote-snapshot", null,
                            React.createElement("pagenote-icon", null,
                                React.createElement(RemoveIcon, { onClick: function () { return _this.removeSnapshot(index); }, className: sideStyle.removeIcon })),
                            React.createElement("img", { onClick: function (e) {
                                    _this.bigPicture(e, img, snapshots.map(function (s) {
                                        return {
                                            src: s,
                                        };
                                    }), index);
                                }, src: img, alt: "" }))); }))))));
    };
    return AsideBar;
}(Component));
function StepSign(_a) {
    var step = _a.step, _b = _a.running, running = _b === void 0 ? false : _b, index = _a.index, dot = _a.dot, lastFocusId = _a.lastFocusId, onClick = _a.onClick, colors = _a.colors;
    var changeLevel = function (level) {
        step.level = level;
        step.save.call(step);
    };
    function toggleLight() {
        var nextStatus = step.data.lightStatus + 1;
        step.data.lightStatus = nextStatus > 2 ? 0 : nextStatus;
        step.data.annotationStatus = nextStatus === 2 ? 1 : 0;
    }
    var isVisible = step.runtime.isVisible ? '1' : '';
    var _c = step.data, tip = _c.tip, bg = _c.bg;
    return (React.createElement("pagenote-light-aside-item", { "data-active": step.data.lightStatus, "data-insign": isVisible, "data-level": 1, "data-dot": dot ? '1' : '0', "data-running": running, onClick: onClick, "data-focus": lastFocusId === step.lightId ? '1' : '0', style: {
            top: dot ? computeTop(step.y, index) + "px" : 'unset',
            '--color': bg,
            '--shadow-color': dot ? '#d8d8d8' : (tip ? bg : ''),
            position: dot ? 'absolute' : 'relative'
        } },
        React.createElement("pagenote-light-aside-item-container", null,
            React.createElement(LightRefAnotation, { step: step })),
        React.createElement("pagenote-light-anotation", null, step.tip &&
            React.createElement("pagenote-block", { dangerouslySetInnerHTML: { __html: step.tip } })),
        React.createElement("pagenote-light-aside-item-sign", { "data-active": step.data.lightStatus, "data-insign": isVisible, "data-level": 1, onClick: toggleLight }),
        React.createElement("pagenote-light-actions-container", null,
            React.createElement(LightActionBar, { step: step, colors: colors }))));
}
export default AsideBar;
//# sourceMappingURL=AsideBar.js.map