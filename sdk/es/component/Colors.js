import "./light/light-node.scss";
import ColorIcon from "../assets/images/color.svg";
export default function Colors(_a) {
    var colors = _a.colors, current = _a.current, selectColor = _a.selectColor;
    var setColor = function (color) {
        selectColor(color);
    };
    return (React.createElement("pagenote-colors", null,
        React.createElement("pagenote-color-items", null, colors.map(function (color) {
            return React.createElement("pagenote-icon", { "aria-controls": 'color-item', onClick: function () { setColor(color); }, "data-active": "".concat(color === current ? '1' : ''), style: { backgroundColor: color } });
        })),
        React.createElement("pagenote-icon", null,
            React.createElement(ColorIcon, { width: 20, height: 20, fill: current }))));
}
;
//# sourceMappingURL=Colors.js.map