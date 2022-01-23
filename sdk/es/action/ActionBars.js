import { computePosition, convertColor, isMobile } from "../utils";
import Highlight from '@/assets/images/highlight.svg';
import root from 'react-shadow';
import styles from './action-bar.less';
import React from "react";
export default function ActionBars(_a) {
    var position = _a.position, brushes = _a.brushes, showButton = _a.showButton, target = _a.target, recordNew = _a.recordNew;
    var recordButtonX = position.x + 'px';
    var recordButtonY = position.y + "px";
    return (React.createElement(root.div, null,
        React.createElement("style", { type: "text/css" }, styles),
        React.createElement("div", { className: 'pagenote-block', style: {
                position: "absolute",
                zIndex: 2147483648,
                left: recordButtonX,
                top: recordButtonY,
                transition: ".5s",
                userSelect: "none",
                textAlign: 'left'
            } }, showButton
            &&
                React.createElement("div", { className: 'pagenote-block', onClick: function (e) { e.stopPropagation(); } }, target &&
                    React.createElement("div", { className: 'pagenote-colors-container' }, brushes.map(function (item, index) {
                        var radios = 30;
                        var _a = (isMobile || index === 0) ? {
                            x: (index) * -40,
                            y: 0,
                        } : computePosition(index - 1, radios), offsetX = _a.x, offsetY = _a.y;
                        if (!item) {
                            return (React.createElement("div", { className: 'pagenote-color-button', key: index }));
                        }
                        return (React.createElement("div", { className: 'pagenote-color-button', key: index, "data-pagenotecolor": item.bg, style: {
                                // @ts-ignore
                                '--color': item.bg,
                                transform: "translate(" + offsetX + "px," + -offsetY + "px)",
                                top: (offsetY) + 'px',
                                left: (-offsetX) + 'px',
                                width: radios + 'px',
                                height: radios + 'px',
                                // @ts-ignore
                                color: convertColor(item.bg).textColor,
                                // @ts-ignore
                                textShadow: "1px 1px 0px " + convertColor(convertColor(item.bg).textColor).textColor,
                                // animation:`${(showAnimation&&index!==0)?'colorShow 3s ease-out':''}`,
                                // animationDelay: index*0.1+'s',
                                // transitionDelay: index*0.1+'s',
                            }, onMouseUpCapture: function (e) { recordNew(item); } },
                            React.createElement(Highlight, { "data-pagenotecolor": item.bg, style: { userSelect: 'none' }, fill: item.bg })));
                    }))))));
}
//# sourceMappingURL=ActionBars.js.map