import whatsPure from "whats-element/pure";
import { AnnotationStatus, LightStatus } from "../step/const";
import { getScroll } from "./document";
var whats = new whatsPure();
var isMobile = ('ontouchstart' in window) || window.innerWidth < 600;
function getPagenoteRoot() {
    var root = document.querySelector('pagenote-root');
    if (!root) {
        root = document.createElement('pagenote-root');
        // Firefox 下 必须要放在 body 内 delete 键才会生效
        (document.body || document.documentElement).appendChild(root);
    }
    return root;
}
function getRootOffset() {
    var root = getPagenoteRoot();
    var offset = root.getBoundingClientRect();
    return {
        left: offset.left + getScroll().x,
        top: offset.top + getScroll().y,
        scrollHeight: root.parentElement.scrollHeight,
    };
}
var prepareSelectionTarget = function (enableMarkImg, positions) {
    var selection = document.getSelection();
    if (selection.rangeCount === 0) {
        return;
    }
    // // pagenote 状态监测
    // const isWaiting = this.status === constant.WAITING && selectedText === this.target.text;
    // const isDestroy = this.status === this.CONSTANT.DESTROY;
    // if(isWaiting || isDestroy || selection.rangeCount===0){ // 避免重复计算\无选区
    //     return;
    // }
    // 选区父节点是否存在
    var range0 = selection.getRangeAt(0);
    var parentElement = selection.anchorNode ? range0.commonAncestorContainer : null;
    if (parentElement && parentElement.nodeType === 3) { // 如果父节点为文本节点，则需要再寻一级父节点
        parentElement = parentElement.parentNode;
    }
    var noParentElement = !parentElement || !parentElement.tagName;
    if (noParentElement) {
        return;
    }
    function checkInPagenoteElement(element) {
        if (element && element.tagName) {
            var tagName = element.tagName.toLowerCase();
            var isPagenote = ['light'].includes(tagName) || tagName.indexOf('pagenote') > -1;
            if (isPagenote) {
                return true;
            }
            else if (element.parentNode) {
                return checkInPagenoteElement(element.parentNode);
            }
        }
        else {
            return false;
        }
    }
    if (checkInPagenoteElement(parentElement) || checkInPagenoteElement(selection.anchorNode) || checkInPagenoteElement(selection.focusNode)) {
        return;
    }
    // 是否可编辑区
    var canHighlight = true;
    if (!parentElement || parentElement.contentEditable === 'true') {
        canHighlight = false;
    }
    // TODO 监测是否有图片、视频等其他资源
    var markImages = [];
    var selectedElementContent = range0.cloneContents();
    if (enableMarkImg) {
        var children = selectedElementContent.children;
        for (var i = 0; i < children.length; i++) {
            var item = children[i];
            if (item.tagName === 'IMG') {
                // 找到对应的图片节点
                var id = "img[src=\"".concat(item.src, "\"]");
                var elements = parentElement.querySelectorAll(id);
                for (var j = 0; j < elements.length; j++) {
                    var element = elements[j];
                    if (selection.containsNode(element)) {
                        var imgId = whats.getUniqueId(element).wid;
                        var imgUrl = element.src;
                        markImages.push({
                            id: imgId,
                            src: imgUrl,
                            alt: element.alt,
                            // pre: element.previousSibling?.textContent,
                            // suffix: element.nextSibling?.textContent,
                        });
                        break;
                    }
                }
            }
        }
    }
    var selectedText = selection.toString().trim(); // 跨标签高亮
    if (!(selectedText || markImages.length)) {
        return;
    }
    // TODO 双击情况下 ，before 计算会存在问题
    var before = range0.startContainer.textContent.substr(0, range0.startOffset);
    var after = range0.endContainer.textContent.substr(range0.endOffset, 10);
    if (!before) {
        var preElement = parentElement.previousSibling;
        if (preElement && parentElement.contains(preElement)) {
            before = preElement.textContent;
        }
    }
    if (!after) {
        var nextElement = parentElement.nextSibling;
        if (nextElement && parentElement.contains(nextElement)) {
            after = nextElement.textContent;
        }
    }
    var selectionRects = selection.getRangeAt(0).getClientRects();
    var relativeRect = selectionRects[selectionRects.length - 1];
    if (!relativeRect) {
        return;
    }
    // 鼠标起始位置
    var startPosition = positions[0];
    // 鼠标落点位置
    var endPosition = positions[1];
    // 正逆方向计算
    var offsetRelative = 1;
    // 判断是正逆方向
    var eOffsetX = endPosition.x - startPosition.x;
    var eOffsetY = endPosition.y - startPosition.y;
    if (eOffsetX * eOffsetY >= 0) {
        offsetRelative = eOffsetX >= 0 ? 1 : -1;
    }
    else {
        var relativeDirection = Math.abs(eOffsetX) - Math.abs(eOffsetY) >= 0 ? eOffsetX : eOffsetY;
        offsetRelative = relativeDirection >= 0 ? 1 : -1;
    }
    // 根据正逆方向，选择用于计算位置的选区标准，如果是逆向，则取第一个选区
    if (offsetRelative === -1) {
        relativeRect = selectionRects[0];
    }
    var scrollY = window.scrollY + relativeRect.y;
    var offsetX = offsetRelative === 1 ? relativeRect.width + 6 : -32;
    var offsetY = offsetRelative === 1 ? relativeRect.height + 4 : -32;
    var x = Math.max(Math.min(relativeRect.x + offsetX, window.innerWidth - 150), 20);
    var y = scrollY + offsetY;
    var whatsEl = whats.getUniqueId(parentElement);
    var cursorX = parseInt(x);
    var cursorY = parseInt(y);
    var rootOffset = getRootOffset();
    var ignoreOffsetY = cursorY - rootOffset.top;
    var target = {
        x: cursorX - rootOffset.left,
        y: Math.min(ignoreOffsetY, scrollY + document.documentElement.scrollHeight - 60),
        offsetX: 0.5,
        offsetY: 0.9,
        pre: before,
        suffix: after,
        text: selectedText,
        tip: '',
        time: new Date().getTime(),
        id: whatsEl.wid,
        isActive: false,
        bg: '',
        parentW: parseInt(parentElement.clientWidth),
        // clientX: e.clientX,
        // clientY: e.clientY,
        canHighlight: canHighlight,
        selectionElements: selectedElementContent,
        images: markImages,
        annotationStatus: AnnotationStatus.HIDE,
        lightStatus: LightStatus.HALF
    };
    return target;
};
// http://bai.com?a=1&b=2  output [a,b],{a:1,b:1}
function getParams(url) {
    var urlSearch = url || window.location.href;
    var paramStr = (urlSearch.match(/\?(.*)/) || [])[1];
    var paramObj = {};
    var paramKeys = [];
    if (!paramStr) {
        return {
            paramObj: paramObj,
            paramKeys: paramKeys
        };
    }
    paramStr.split('&').forEach(function (item) {
        var tempArr = item.split('=');
        if (tempArr[0]) {
            paramKeys.push(tempArr[0]);
            paramObj[tempArr[0]] = tempArr[1];
        }
    });
    return {
        paramObj: paramObj,
        paramKeys: paramKeys
    };
}
// TODO 优化精简字符串长度
function encryptData(string) {
    return btoa(encodeURI(JSON.stringify(string)));
}
function decryptedData(data) {
    var result = {};
    try {
        result = JSON.parse(decodeURI(atob(data)));
    }
    catch (e) {
    }
    return result;
}
function throttle(fn, interval) {
    if (interval === void 0) { interval = 300; }
    var canRun = true;
    return function () {
        var _this = this;
        if (!canRun)
            return;
        canRun = false;
        setTimeout(function () {
            fn.apply(_this, arguments);
            canRun = true;
        }, interval);
    };
}
function debounce(fn, interval) {
    if (interval === void 0) { interval = 300; }
    var timeout = null;
    return function () {
        var _this = this;
        clearTimeout(timeout);
        timeout = setTimeout(function () {
            fn.apply(_this, arguments);
        }, interval);
    };
}
// rgba(12,323,456) #123222
function convertColor(color) {
    if (color === void 0) { color = ''; }
    if (!color) {
        return '#000000';
    }
    var rgb = [];
    var rate = 1;
    if (color.indexOf('rgb') > -1) {
        rgb = color.match(/\((.*)\)/)[1].split(',');
        rgb = [parseInt(rgb[0]), parseInt(rgb[1]), parseInt(rgb[2])];
        if (rgb[3] !== undefined) {
            rate = rgb[3];
        }
    }
    else {
        color = color.replace('#', '');
        rgb = [color.substr(0, 2), color.substr(2, 2), color.substr(4, 2), 1];
        rgb = [parseInt(rgb[0], 16), parseInt(rgb[1], 16), parseInt(rgb[2], 16)];
    }
    var r = rgb[0];
    var g = rgb[1];
    var b = rgb[2];
    var Y = (0.3 * r + 0.59 * g + 0.11 * b) * Math.min(rate, 1);
    return {
        rgb: rgb,
        textColor: Y >= 180 ? '#000000' : '#ffffff',
        y: Y,
    };
}
function computePosition(index, radio) {
    if (radio === void 0) { radio = 30; }
    var p = 45; //360/(colors.length-1);// 角度
    var hudu = ((2 * Math.PI / 360) * p) * index;
    var offsetHudu = -45 * (2 * Math.PI / 360);
    var x = Number.parseFloat(radio * Math.sin(hudu + offsetHudu)).toFixed(3);
    var y = Number.parseFloat(radio * Math.cos(hudu + offsetHudu)).toFixed(3);
    return {
        x: x,
        y: y,
    };
}
export { getParams, encryptData, decryptedData, throttle, debounce, convertColor, computePosition, prepareSelectionTarget, isMobile, whats, getPagenoteRoot, getRootOffset, };
//# sourceMappingURL=index.js.map