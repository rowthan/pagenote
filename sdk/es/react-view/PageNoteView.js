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
import React, { useState } from "react";
import ReactDom from "react-dom";
import ActionBars from "../action/ActionBars";
import { isMoble } from "../utils/device";
import console from "../utils/console";
import debounce from "lodash/debounce";
import throttle from 'lodash/throttle';
import { prepareSelectionTarget } from "../utils";
var render = function (plainData) {
    var tagRoot = 'pagenote-root';
    var root = document.querySelector(tagRoot);
    if (!root) {
        root = document.createElement(tagRoot);
        document.body.appendChild(root);
    }
    ReactDom.render(React.createElement(PageNoteView, { plainData: plainData }), root);
};
var DEBOUNCE_TIME = 30;
function PageNoteView(_a) {
    var plainData = _a.plainData;
    var _b = useState(plainData), data = _b[0], setData = _b[1];
    var _c = useState(function () {
        return {
            startPosition: null,
            lastPosition: null,
            lastEvent: null,
            lastKeydownTime: 0,
            isPressing: false,
        };
    }), runtime = _c[0], setRuntime = _c[1];
    function setRuntimeData(data) {
        setRuntime(__assign(__assign({}, runtime), data));
    }
    function recordNew() {
    }
    // start
    function addKeyDownListener() {
        var downEvent = isMoble ? 'touchstart' : 'mousedown';
        var onDown = function (e) {
            console.log('down');
            setRuntimeData({
                isPressing: true,
                lastEvent: e,
                startPosition: {
                    x: e.x,
                    y: e.y
                },
                lastKeydownTime: Date.now()
            });
        };
        document.addEventListener(downEvent, onDown, { capture: true });
    }
    // move
    function addMoveListener() {
        var _this = this;
        var downEvent = isMoble ? 'touchmove' : 'mousemove';
        var onMouseMove = debounce(function (e) {
            if (_this._runtime.isPressing) {
                console.log('move');
                setRuntimeData({
                    lastPosition: {
                        x: e.x,
                        y: e.y,
                    }
                });
            }
        }, DEBOUNCE_TIME);
        document.addEventListener(downEvent, onMouseMove, { capture: true });
    }
    // select
    function addSelectionListener() {
        var selectionChange = throttle(function () {
            console.log('selection change');
            // this.computeTarget()
        }, DEBOUNCE_TIME);
        document.addEventListener('selectionchange', selectionChange, { capture: true });
    }
    // end
    function addKeyUpListener() {
        var downEvent = isMoble ? 'touchend' : 'mouseup';
        var that = this;
        var onUp = function (e) {
            console.log('up', e);
            setRuntimeData({
                lastEvent: e,
                isPressing: false,
                lastPosition: {
                    x: e.x,
                    y: e.y,
                },
            });
            that.computeTarget();
        };
        document.addEventListener(downEvent, onUp, { capture: true });
    }
    function computeTarget() {
        if (runtime.isPressing === true) {
            return;
        }
        var target = prepareSelectionTarget(true, [runtime.startPosition, runtime.lastPosition]);
        setRuntimeData({
            target: target
        });
    }
    return (React.createElement("div", null,
        React.createElement(ActionBars, { position: runtime.lastPosition, showButton: true, brushes: [{ bg: '#999999', shortcut: '', label: '', level: 1 }], recordNew: recordNew, target: runtime.target })));
}
export { render };
//# sourceMappingURL=PageNoteView.js.map