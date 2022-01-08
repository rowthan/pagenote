import ToolTip from "rc-tooltip";
import './tip.less';
export default function Tip(_a) {
    var message = _a.message, children = _a.children, _b = _a.inner, inner = _b === void 0 ? false : _b, _c = _a.placement, placement = _c === void 0 ? 'top' : _c;
    return (React.createElement(ToolTip, { destroyTooltipOnHide: { keepParent: false }, align: {
            offset: [0, 0],
        }, overlayStyle: { zIndex: 9999999 }, placement: placement, trigger: ['hover'], getTooltipContainer: function (a) {
            return inner ? a.parentNode : document.body;
        }, offsetX: 10, overlay: React.createElement("span", null, message) }, children));
}
//# sourceMappingURL=Tip.js.map