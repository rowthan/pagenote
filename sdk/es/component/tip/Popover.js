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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { createRef } from 'preact';
import ToolTip from "rc-tooltip";
import './popover.less';
export default function Popover(_a) {
    var message = _a.message, children = _a.children, _b = _a.inner, inner = _b === void 0 ? false : _b, props = __rest(_a, ["message", "children", "inner"]);
    var ref = createRef();
    return (React.createElement(ToolTip, __assign({ destroyTooltipOnHide: { keepParent: false }, 
        // align={{
        //   offset: [0, 10],
        // }}
        overlayStyle: { zIndex: 9999999 }, prefixCls: 'rc-popover', placement: "bottom", trigger: ['click'], 
        // offsetX={10}
        overlay: React.createElement("span", null, message), getTooltipContainer: function (a) {
            return inner ? a.parentNode : document.body;
        } }, props), children));
}
//# sourceMappingURL=Popover.js.map