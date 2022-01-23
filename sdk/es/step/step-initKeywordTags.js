var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { highlightKeywordInElement, removeElementHighlight, wrapImages } from "../utils/highlight";
import { wrapperLightAttr } from "../utils/light";
import toggleLightMenu from "../light-menu";
import { getPagenoteRoot, whats } from "../utils";
import { AnnotationStatus, LightStatus, } from '../common/Types';
var options = {};
var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (item) {
        // @ts-ignore-next-line
        if (item.target && item.target._light) {
            // @ts-ignore-next-line
            item.target._light.runtime.isVisible = item.intersectionRatio > 0;
        }
    });
}, options);
function initKeywordTags() {
    var step = this;
    step.addListener(function (target, key, value) {
        if (key === 'relatedNode') {
            var _loop_1 = function (i) {
                var lightElement = value[i];
                if (lightElement._light) {
                    return "continue";
                }
                lightElement.onclick = function (e) {
                    var data = step.data;
                    var nextLightStatus = (data.lightStatus || LightStatus.UN_LIGHT) + 1;
                    toggleLightMenu(true, step);
                    step.data.lightStatus = nextLightStatus > LightStatus.LIGHT ? LightStatus.UN_LIGHT : nextLightStatus;
                    switch (step.data.lightStatus) {
                        case LightStatus.UN_LIGHT:
                            step.data.annotationStatus = AnnotationStatus.HIDE;
                            break;
                        case LightStatus.LIGHT:
                            step.data.annotationStatus = AnnotationStatus.SHOW;
                            break;
                    }
                    if (step.data.tip) {
                        step.runtime.lighting = 'annotation';
                    }
                    setTimeout(function () {
                        step.runtime.lighting = '';
                    }, 2000);
                    // step.data.annotationStatus = nextLightStatus === LightStatus.LIGHT ? AnnotationStatus.SHOW : AnnotationStatus.HIDE
                    e.stopPropagation();
                };
                lightElement.ondblclick = function (e) {
                    e.stopPropagation();
                    step.openEditor(true);
                };
                lightElement.onmouseenter = function () {
                    clearTimeout(step.runtime.focusTimer);
                    // 如果没有标记内容，则自动贴紧
                    if (!step.data.tip) {
                        step.connectToKeywordTag();
                    }
                    // 鼠标经过后0.5s标记为 isFocusTag
                    step.runtime.focusTimer = setTimeout(function () {
                        step.runtime.isFocusTag = true;
                    }, 300);
                };
                lightElement.onmouseleave = function () {
                    clearTimeout(step.runtime.focusTimer);
                    step.runtime.focusTimer = setTimeout(function () {
                        step.runtime.isFocusTag = false;
                    }, 800);
                };
                io.observe(lightElement);
                lightElement.remove = function () {
                    io.unobserve(lightElement);
                    removeElementHighlight(lightElement);
                };
                // @ts-ignore-next-line
                lightElement._light = step;
            };
            for (var i = 0; i < value.length; i++) {
                _loop_1(i);
            }
        }
    }, true, 'initKeywordTag');
    var onDataChange = function () {
        var nodes = step.runtime.relatedNode || [];
        nodes.forEach(function (node) {
            wrapperLightAttr(node, step.data, null, step.runtime);
        });
    };
    step.addListener(onDataChange, false);
    step.addListener(onDataChange, true);
    var _a = step.data, bg = _a.bg, id = _a.id, text = _a.text, pre = _a.pre, suffix = _a.suffix, lightId = _a.lightId, lightStatus = _a.lightStatus, _b = _a.images, images = _b === void 0 ? [] : _b;
    function highlightElement(target) {
        // 元素内的所有内容都被高亮时 直接高亮元素，不再使用 highlight 正则匹配
        // if(target.innerText.trim() === text){
        //     debugger
        // }
        // 查找文字、高亮元素
        var index = 0;
        var result = highlightKeywordInElement(target, text || '', pre || '', suffix || '', null, function (text) {
            var lightElement = document.createElement('light');
            lightElement.dataset.highlight = lightId;
            lightElement.dataset.lightindex = String(index);
            index++;
            if (text) {
                lightElement.textContent = text;
            }
            return lightElement;
        }, [getPagenoteRoot()]);
        step.runtime.warn = result ? '' : '未找到匹配内容';
        if (result) {
            step.runtime.relatedNode = __spreadArray(__spreadArray([], step.runtime.relatedNode, true), result.lightsElement, true);
            var position = {
                offsetBodyTop: 0,
                offsetBodyLeft: 0,
            };
            try {
                // @ts-ignore
                position = whats.compute(result.lightsElement[0]);
            }
            catch (e) {
            }
            step.runtime.relatedNodePosition = {
                top: position.offsetBodyTop,
                left: position.offsetBodyLeft,
            };
        }
    }
    var timer = null;
    (function findElement(times) {
        // @ts-ignore
        var targetEl = whats.getTarget(id);
        clearTimeout(timer);
        if (targetEl) {
            if (text) {
                highlightElement(targetEl);
            }
            images.forEach(function (image) {
                var relatedImage = wrapImages(targetEl, image.src);
                if (relatedImage) {
                    var newRelated = __spreadArray(__spreadArray([], step.runtime.relatedNode, true), [relatedImage], false);
                    step.runtime.relatedNode = newRelated;
                }
            });
        }
        else if (times < 8) {
            timer = setTimeout(function () {
                findElement(++times);
            }, 2000 * times);
        }
        else {
            highlightElement(document.body);
        }
    })(0);
}
export default initKeywordTags;
//# sourceMappingURL=step-initKeywordTags.js.map