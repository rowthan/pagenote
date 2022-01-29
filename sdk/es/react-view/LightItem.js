import React, { useEffect, useState } from "react";
import { highlightKeywordInElement } from "../utils/highlight";
import { whats } from "../utils";
import md5 from "md5";
import ReactDOM from "react-dom";
// @ts-ignore
import styles from './light.less';
export default function LightItem(_a) {
    var light = _a.light, remove = _a.remove;
    var _b = useState(null), target = _b[0], setTarget = _b[1];
    useEffect(function () {
        var element = whats.getTarget(light.id);
        if (element) {
            var text = light.text, pre = light.pre, suffix = light.suffix;
            highlightElement(element, text, pre, suffix);
        }
        return function () {
            var relatedNodes = document.querySelectorAll("light[data-highlight=".concat(light.id, "]"));
            for (var i = 0; i < relatedNodes.length; i++) {
                var tempNode = relatedNodes[i];
                var textNode = document.createTextNode(light.text);
                tempNode.outerHTML = light.text;
            }
        };
    }, []);
    function highlightElement(target, text, pre, suffix) {
        var index = 0;
        debugger;
        highlightKeywordInElement(target, text || '', pre || '', suffix || '', null, function (text) {
            var lightElement = document.createElement('light');
            lightElement.dataset.highlight = md5(text);
            lightElement.dataset.lightindex = String(index);
            // lightElement.dataset.lightid = md5(light.id);
            index++;
            setTarget(lightElement);
            return lightElement;
        }, []);
    }
    return target ? ReactDOM.createPortal(
    // @ts-ignore
    React.createElement("span", { className: 'light', style: { '--bgcolor': light.bg } },
        React.createElement("style", null, styles),
        light.text), target) : React.createElement("div", null);
}
//# sourceMappingURL=LightItem.js.map