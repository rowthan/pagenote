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
import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactDom from "react-dom";
import ActionBars from "../action/ActionBars";
import { isMoble } from "../utils/device";
// import console from "../utils/console";
import debounce from "lodash/debounce";
import throttle from 'lodash/throttle';
import { prepareSelectionTarget } from "../utils";
import root from 'react-shadow';
import Lights from "./Lights";
var render = function (plainData, onChange) {
    var tagRoot = 'pagenote-root';
    var root = document.querySelector(tagRoot);
    if (!root) {
        root = document.createElement(tagRoot);
        document.body.appendChild(root);
    }
    ReactDom.render(React.createElement(PageNoteView, { plainData: plainData, onChange: onChange }), root);
};
var DEBOUNCE_TIME = 100;
function PageNoteView(_a) {
    var plainData = _a.plainData, onChange = _a.onChange;
    var option = {
        brushes: [
            {
                bg: '#cc7c7c', shortcut: '', label: '', level: 1
            },
            {
                bg: '#999999', shortcut: '', label: '', level: 1
            },
            {
                bg: '#55cdff', shortcut: '', label: '', level: 1
            },
            {
                bg: '#693131', shortcut: '', label: '', level: 1
            },
            {
                bg: '#4accff', shortcut: '', label: '', level: 1
            },
        ]
    };
    var _b = useState(plainData), data = _b[0], setData = _b[1];
    var _c = useState(function () {
        return {
            startPosition: {},
            lastPosition: {},
            lastEvent: null,
            lastKeydownTime: 0,
            isPressing: false,
        };
    }), runtime = _c[0], setRuntime = _c[1];
    var _d = useState(function () {
        return null;
    }), target = _d[0], setTarget = _d[1];
    var _e = useState(0), scrollY = _e[0], setScrollY = _e[1];
    var rootAside = useRef(null);
    useEffect(function () {
        // mousedown
        var onUp = debounce(function (e) {
            if (e.target === rootAside.current) {
                return;
            }
            var data = {
                lastEvent: e,
                isPressing: false,
                lastPosition: {
                    x: e.x,
                    y: e.y,
                },
            };
            setRuntimeData(data);
            console.log('up');
        }, DEBOUNCE_TIME);
        var upEvent = isMoble ? 'touchend' : 'mouseup';
        document.addEventListener(upEvent, onUp, { capture: true });
        // mouseup
        var downEvent = isMoble ? 'touchstart' : 'mousedown';
        var onDown = function (e) {
            if (e.target === rootAside.current) {
                return;
            }
            var data = {
                isPressing: true,
                lastEvent: e,
                startPosition: {
                    x: e.x,
                    y: e.y
                },
                lastKeydownTime: Date.now()
            };
            setRuntimeData(data);
            console.log('down', e);
        };
        document.addEventListener(downEvent, onDown, { capture: true });
        // dragend
        var dragEndEvent = 'dragend';
        var onDragEnd = function () {
            setRuntimeData({
                isPressing: false,
            });
        };
        document.addEventListener(dragEndEvent, onDragEnd, { capture: true });
        // scroll
        var scrollEvent = 'scroll';
        var onScroll = throttle(function () {
            setScrollY(window.scrollY);
        }, 5);
        window.addEventListener(scrollEvent, onScroll);
        return function remove() {
            document.removeEventListener(upEvent, onUp, { capture: true });
            document.removeEventListener(downEvent, onDown, { capture: true });
            document.removeEventListener(dragEndEvent, onDragEnd, { capture: true });
        };
    }, [runtime]);
    useEffect(function () {
        var target = prepareSelectionTarget(true, [runtime.startPosition, runtime.lastPosition]);
        setTarget(target);
    }, [runtime.isPressing, scrollY]);
    useEffect(function () {
        onChange(data);
    }, [data]);
    useEffect(function () {
    });
    var setRuntimeData = useCallback(function (data) {
        var newRuntime = __assign(__assign({}, runtime), data);
        setRuntime(newRuntime);
    }, [runtime]);
    function recordNew(info) {
        console.log('record new', target);
        var steps = data.steps;
        steps.push(__assign(__assign({}, target), { bg: info.bg }));
        setData(__assign(__assign({}, data), { steps: steps }));
        setTarget(null);
    }
    function remove(index) {
        var steps = data.steps;
        steps.splice(index, 1);
        setData(__assign(__assign({}, data), { steps: steps }));
    }
    var position = {
        x: target === null || target === void 0 ? void 0 : target.clientX,
        y: target === null || target === void 0 ? void 0 : target.clientY,
    };
    return (React.createElement(root.aside, { ref: rootAside },
        React.createElement(ActionBars, { position: position, showButton: true, brushes: option.brushes, recordNew: recordNew, target: target }),
        React.createElement(Lights, { lights: data.steps, remove: remove })));
}
export { render };
//# sourceMappingURL=PageNoteView.js.map