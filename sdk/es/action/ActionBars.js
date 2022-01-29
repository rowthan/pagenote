import { computePosition, convertColor, isMobile } from "../utils";
// @ts-ignore
import Highlight from '@/assets/images/highlight.svg';
import root from 'react-shadow';
// @ts-ignore
import styles from './action-bar.less';
import React, { useMemo, useRef } from "react";
export default function ActionBars(_a) {
    var position = _a.position, brushes = _a.brushes, showButton = _a.showButton, target = _a.target, recordNew = _a.recordNew;
    var recordButtonX = position.x + 'px';
    var recordButtonY = position.y + "px";
    var show = target !== null;
    function stopPropagation(e) {
        // console.log(e,'stop')
        // e.stopPropagation();
        // e.preventDefault();
        // // @ts-ignore
        // e.nativeEvent.stopPropagation();
        // // @ts-ignore
        // e.nativeEvent.stopImmediatePropagation();
    }
    var ref = useRef(null);
    // useEffect(function () {
    //     ['click','mouseup',"mousedown",'touchstart'].forEach(function (event) {
    //         if(ref.current){
    //             ref?.current?.addEventListener(event,function (e: { stopPropagation: () => void; preventDefault: () => void; }) {
    //                 e.stopPropagation();
    //                 e.preventDefault();
    //             })
    //         }
    //     })
    // },[])
    return (React.createElement(root.div, { ref: ref },
        React.createElement("style", { type: "text/css" }, styles),
        React.createElement("div", { className: 'pagenote-action-container', style: {
                left: recordButtonX,
                top: recordButtonY,
            } }, useMemo(function () {
            return React.createElement("div", null, show &&
                React.createElement("div", { className: 'pagenote-block' },
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
                                transform: "translate(".concat(offsetX, "px,").concat(-offsetY, "px)"),
                                top: (offsetY) + 'px',
                                left: (-offsetX) + 'px',
                                width: radios + 'px',
                                height: radios + 'px',
                                // @ts-ignore
                                color: convertColor(item.bg).textColor,
                                // @ts-ignore
                                textShadow: "1px 1px 0px ".concat(convertColor(convertColor(item.bg).textColor).textColor),
                                // animation:`${(showAnimation&&index!==0)?'colorShow 3s ease-out':''}`,
                                // animationDelay: index*0.1+'s',
                                // transitionDelay: index*0.1+'s',
                            }, 
                            // onMouseUp={(e)=>{recordNew(item);}}
                            onClick: function (e) { recordNew(item); } },
                            React.createElement(Highlight, { "data-pagenotecolor": item.bg, style: { userSelect: 'none' }, fill: item.bg })));
                    }))));
        }, [brushes]))));
}
//# sourceMappingURL=ActionBars.js.map