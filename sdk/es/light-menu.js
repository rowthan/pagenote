import { render } from 'react-dom';
import { getScroll } from "./utils/document";
import LightActionBar from "./component/LightActionBar";
var toggleLightMenu = (function () {
    var toggleLightBar;
    return function (show, light, position, colors) {
        return; // 封禁该功能
        if (toggleLightBar) {
            return toggleLightBar(show, light, position);
        }
        function Menu(_a) {
            var light = _a.light, pos = _a.pos;
            var top, left;
            if (!pos) {
                var scroll_1 = getScroll();
                var relativeNode = light.runtime.relatedNode[0] || light.runtime.relatedAnnotationNode;
                var triggerPosition = relativeNode.getBoundingClientRect();
                top = Math.max(triggerPosition.top - 40 + scroll_1.y, 40);
                left = triggerPosition.left + scroll_1.x + triggerPosition.width / 2 - 56;
            }
            else {
                top = pos.top;
                left = pos.left;
            }
            return React.createElement("pagenote-block", { onClick: function (e) { e.stopPropagation(); }, style: "position:absolute; z-index:999999;top:".concat(top, "px;left:").concat(left, "px;\n                    ") },
                React.createElement(LightActionBar, { step: light, colors: colors }));
        }
        toggleLightBar = function (show, light, position) {
            render(show ? React.createElement(Menu, { light: light, pos: position }) : null, document.documentElement);
        };
        toggleLightBar(show, light, position);
        document.addEventListener('click', function (e) {
            toggleLightBar(false);
        });
    };
})();
export default toggleLightMenu;
//# sourceMappingURL=light-menu.js.map