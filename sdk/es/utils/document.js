import { throttle, convertColor } from "./index";
import md5 from "blueimp-md5";
import html2canvas from "html2canvas";
import Canvas2Image from "./canvas2image";
var IS_TOUCH = 'ontouchstart' in window, getXY = IS_TOUCH
    ? function (e) {
        var touch = e.touches[0] || e.changedTouches[0];
        return touch ? {
            x: touch.pageX,
            y: touch.pageY
        } : { x: 0, y: 0 };
    }
    : function (e) {
        var e = event || window.event;
        var x = e.pageX || e.clientX + getScroll().x;
        var y = e.pageY || e.clientY + getScroll().y;
        return { x: x, y: y };
    };
function wrapRangeInTextNode(node, start, end, color, id) {
    var hEl = 'light', startNode = node.splitText(start), ret = startNode.splitText(end - start);
    var highlightEl = document.createElement(hEl);
    highlightEl.dataset.highlight = id;
    highlightEl.style.backgroundColor = color;
    var _a = convertColor(color), textColor = _a.textColor, rgb = _a.rgb;
    var bottomColor = "rgb(" + (rgb[0] - 30) + "," + (rgb[1] - 30) + "," + (rgb[2] - 30) + ")";
    var bgColor = "rgba(" + rgb.toString() + ",1)";
    highlightEl.style = "--bgcolor:" + bgColor + ";--color:" + textColor + ";--bgbottomcolor:" + bottomColor;
    highlightEl.textContent = startNode.textContent;
    if (color === 'rgba(1,1,1,0.5)') {
        highlightEl.dataset.mask = '1';
    }
    startNode.parentNode.replaceChild(highlightEl, startNode);
    return ret;
}
// <div>ab<div>  ab
var highlightElement = function (node, keyword, color) {
    var matchReg = new RegExp(keyword);
    if (node.nodeType === 3) { // 文本节点
        var match = node.data.match(matchReg);
        if (match) {
            wrapRangeInTextNode(node, match.index, match.index + match[0].length, color);
        }
    }
    else if (node.nodeType === 1 && node.childNodes && // only element nodes that have children
        !/(script|style)/i.test(node.tagName) // ignore script
        && node.dataset.highlight !== "y") {
        for (var i = 0; i < node.childNodes.length; i++) {
            highlightElement(node.childNodes[i], keyword, color);
            i++;
        }
    }
}, highlightKeyword = function (wid, element, text, hightlight, color, blackNodes, callback) {
    if (color === void 0) { color = ''; }
    if (blackNodes === void 0) { blackNodes = []; }
    if (!element || !text) {
        callback({
            totalMatches: 0
        });
        return;
    }
    var id = md5(wid + text);
    // 如果是还原 则不进行之后操作
    if (!hightlight) {
        var highlightElements = element.querySelectorAll("light[data-highlight='" + id + "']");
        //还原高亮，即便是高亮 也要先还原高亮
        for (var i = 0; i < highlightElements.length; i++) {
            var ele = highlightElements[i];
            ele.outerHTML = [].find.call(ele.childNodes, (function (node) {
                return node.nodeType === 3 || node.nodeName === '#text';
            })).textContent;
        }
        var leftHighlight = element.querySelectorAll('light[data-highlight]');
        // if(leftHighlight.length===0){
        //     delete element.dataset.highlightbk
        // }
        return;
    }
    // element.dataset.highlightbk="y";
    var totalMatches = 0, kwArr = [text];
    var dict = getTextNodes(element);
    dict.id = id;
    dict.color = color;
    var hasLighted = 0;
    var handler = function (kw) {
        var regex = new RegExp(text.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&').replace(/[\s]+/gmi, '[\\s]+'), 'gmi');
        var matches = 0;
        wrapMatchesAcrossElements(dict, regex, 0, function (term, node) {
            var isBlack = blackNodes.some(function (black) {
                return black.contains(node);
            });
            var parent = node.parentNode || document.body;
            hasLighted = parent.dataset.highlight ? hasLighted + 1 : hasLighted;
            // 黑名单和已高亮过的不做高亮处理
            var valid = !isBlack && !parent.dataset.highlight;
            return valid;
        }, function (element) {
            matches++;
            totalMatches++;
            // console.log('each callback',element);
        }, function () {
            if (matches === 0) { // TODO 往上级寻找节点
                // console.log('没有匹配项')
            }
            if (kwArr[kwArr.length - 1] === kw) {
                // console.log('关键词已匹配完')
            }
            else {
                handler(kwArr[kwArr.indexOf(kw) + 1]);
            }
        });
    };
    if (kwArr.length === 0) {
        // console.log('done totalMatch')
    }
    else {
        handler(kwArr[0]);
        if (totalMatches === 0) {
            setTimeout(function () {
                handler(kwArr[0]);
            }, 2000);
        }
        typeof callback === 'function' && callback({
            totalMatches: totalMatches || hasLighted,
            id: dict.id,
        });
    }
};
var timer;
var gotoPosition = function (element, targetX, targetY, onFinished) {
    clearInterval(timer);
    var callback = function () {
        clearInterval(timer);
        typeof onFinished === "function" && onFinished();
    };
    if (!element) {
        callback();
    }
    var inBottomView = targetY > document.documentElement.clientHeight / 2;
    // 优先使用算法，移动到视野的 1/3位置，然后计算确认，兜底使用scrolltoView
    if (element && element.scrollIntoView) {
        element.scrollIntoView({ block: "center", behavior: 'smooth' });
        typeof callback === "function" && setTimeout(function () { return callback(); }, 100);
        return;
    }
    timer = setInterval(function () {
        //移动前
        var _a = getScroll(), beforeScrollLeft = _a.x, beforeScrollTop = _a.y;
        var distanceX = targetX - beforeScrollLeft, distanceY = targetY - beforeScrollTop;
        //移动后
        setScroll(beforeScrollLeft + distanceX / 6, beforeScrollTop + distanceY / 6);
        var _b = getScroll(), afterScrollLeft = _b.x, afterScrollTop = _b.y;
        if (beforeScrollTop === afterScrollTop && beforeScrollLeft === afterScrollLeft) {
            callback();
        }
    }, 30);
    function setScroll(x, y) {
        documentTarget.scrollLeft = x;
        documentTarget.scrollTop = y;
        window.scrollTo(x, y);
    }
    return;
};
var documentTarget = document.documentElement || document.body;
function getScroll() {
    var x = window.pageXOffset || documentTarget.scrollLeft || documentTarget.scrollLeft;
    var y = window.pageYOffset || documentTarget.scrollTop || documentTarget.scrollTop;
    return { x: x, y: y };
}
function emptyChildren(element) {
    while (element.hasChildNodes()) //当div下还存在子节点时 循环继续
     {
        element.removeChild(element.firstChild);
    }
}
function getViewPosition(elem) {
    var box = elem.getBoundingClientRect();
    var scroll = getScroll();
    return {
        top: box.top,
        left: box.left,
        width: box.width,
        height: box.height,
        bodyTop: box.top + scroll.y,
        bodyLeft: box.left + scroll.x,
    };
}
function getTextNodes(element) {
    var nodes = [];
    var filter = {
        acceptNode: function (node) {
            var condition = node.nodeType === 3;
            return condition ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
        }
    };
    var iter = document.createNodeIterator(element, NodeFilter.SHOW_TEXT, filter, false);
    var tempNote;
    var val = '';
    while (tempNote = iter.nextNode()) {
        nodes.push({
            node: tempNote,
            start: val.length,
            end: (val += tempNote.textContent).length
        });
    }
    var dict = {
        nodes: nodes,
        value: val,
    };
    return dict;
}
function wrapMatchesAcrossElements(dict, regex, ignoreGroups, filterCb, eachCb, endCb) {
    var matchIdx = ignoreGroups === 0 ? 0 : ignoreGroups + 1;
    var match;
    while ((match = regex.exec(dict.value)) !== null &&
        match[matchIdx] !== '') {
        // calculate range inside dict.value
        var start = match.index;
        if (matchIdx !== 0) {
            for (var i = 1; i < matchIdx; i++) {
                start += match[i].length;
            }
        }
        var end = start + match[matchIdx].length;
        // note that dict will be updated automatically, as it'll change
        // in the wrapping process, due to the fact that text
        // nodes will be splitted
        wrapRangeInMappedTextNode(dict, start, end, function (node) {
            return filterCb(match[matchIdx], node);
        }, function (node, lastIndex) {
            // console.log(node,lastIndex)
            regex.lastIndex = lastIndex;
            eachCb(node);
        });
    }
    endCb();
}
function wrapRangeInMappedTextNode(dict, start, end, filterCb, eachCb) {
    // iterate over all text nodes to find the one matching the positions
    dict.nodes.every(function (n, i) {
        var sibl = dict.nodes[i + 1];
        if (typeof sibl === 'undefined' || sibl.start > start) {
            if (!filterCb(n.node)) {
                return false;
            }
            // map range from dict.value to text node
            var s = start - n.start, e_1 = (end > n.end ? n.end : end) - n.start, startStr = dict.value.substr(0, n.start), endStr = dict.value.substr(e_1 + n.start);
            n.node = wrapRangeInTextNode(n.node, s, e_1, dict.color, dict.id);
            // recalculate positions to also find subsequent matches in the
            // same text node. Necessary as the text node in dict now only
            // contains the splitted part after the wrapped one
            dict.value = startStr + endStr;
            dict.nodes.forEach(function (k, j) {
                if (j >= i) {
                    if (dict.nodes[j].start > 0 && j !== i) {
                        dict.nodes[j].start -= e_1;
                    }
                    dict.nodes[j].end -= e_1;
                }
            });
            end -= e_1;
            eachCb(n.node.previousSibling, n.start);
            if (end > n.end) {
                start = n.end;
            }
            else {
                return false;
            }
        }
        return true;
    });
}
function getWebIcon() {
    var iconEle = document.querySelector('link[rel~=icon]');
    return iconEle ? iconEle.href : '';
}
function convertImgToBase64(url, width, height, callback, outputFormat) {
    var canvas = document.createElement('CANVAS');
    var ctx = canvas.getContext('2d');
    var img = new Image;
    img.crossOrigin = 'Anonymous';
    img.onload = function () {
        var width = img.width;
        var height = img.height;
        // 按比例压缩4倍
        // var rate = (width<height ? width/height : height/width)/4;
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height, 0, 0, width, height);
        var dataURL = canvas.toDataURL(outputFormat || 'image/png');
        callback.call(this, dataURL);
        canvas = null;
    };
    img.src = url;
}
function moveable(element, callback, childMove) {
    if (childMove === void 0) { childMove = true; }
    if (!element) {
        return;
    }
    var isMobile = 'ontouchstart' in window;
    element.style.cursor = 'move';
    var canMove = false;
    var downEvent = isMobile ? 'touchstart' : 'mousedown';
    element.addEventListener(downEvent, function (e) {
        if (childMove === false && e.target !== element) {
            return;
        }
        e.stopPropagation();
        setTimeout(function () {
            canMove = true;
        }, 300);
    }, { capture: true });
    var upEvent = isMobile ? 'touchend' : 'mouseup';
    document.addEventListener(upEvent, function () {
        canMove = false;
        setTimeout(function () {
            canMove = false;
            document.body.style.userSelect = 'auto';
        }, 300);
    }, { capture: true });
    var moveEvent = isMobile ? 'touchmove' : 'mousemove';
    document.addEventListener(moveEvent, throttle(function (e) {
        if (canMove) {
            document.body.style.userSelect = 'none';
            callback(isMobile ? e.touches[0] : e);
        }
    }, 1000 / 60), { capture: true });
}
function writeTextToClipboard(text) {
    try {
        return navigator.clipboard.writeText(text);
    }
    catch (e) {
        var textarea = document.createElement('textarea');
        textarea.textContent = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('Copy', false, null);
        document.body.removeChild(textarea);
        return Promise.resolve();
    }
}
function captureElementImage(target) {
    return new Promise(function (resolve, reject) {
        html2canvas(target, {
            useCORS: true,
            ignoreElements: function (element) {
                var isPagenote = element.tagName.toLowerCase().indexOf('pagenote') > -1;
                var unVisiable = getComputedStyle(element).opacity <= 0;
                return isPagenote || unVisiable;
            }
        }).then(function (canvas) {
            var result = Canvas2Image.convertToImage(canvas, target.offsetWidth, target.scrollHeight).src;
            resolve(result);
        }).catch(function (e) {
            reject(e);
        });
    });
}
var showCamera = function (snapshot) {
    var camera = document.createElement('pagenote-camera');
    var tip = '个快照';
    camera.innerHTML = "<div class='pagenote-camera-container'>\n                                  <div class='camera-top'>\n                                    <div class='zoom'></div>\n                                    <div class='mode-changer'></div>\n                                    <div class='sides'></div>\n                                    <div class='range-finder'></div>\n                                    <div class='focus'></div>\n                                    <div class='red'></div>\n                                    <div class='view-finder'></div>\n                                    <div class='flash'>\n                                      <div class='light'></div>\n                                    </div>\n                                  </div>\n                                  <div class='camera-mid'>\n                                    <div class='sensor'></div>\n                                    <div class='lens'></div> \n                                    <div class=\"tip\"><div>\u5DF2\u62CD\u7167\u5B8C\u6210\u5E76\u4FDD\u5B58\uFF0C\u4F60\u53EF\u4EE5\u5728\u7BA1\u7406\u9875\u8FDB\u884C\u67E5\u770B\u3001\u7F16\u8F91\u3002</div><button><a target=\"_blank\" href=\"https://pagenote.cn/me\">\u524D\u5F80\u67E5\u770B" + tip + "</a></button><button id=\"close-camera\">\u5173\u95ED\u6444\u50CF\u673A<span id=\"count-down\">8s</span></button></div>\n                                  </div>\n                                  <div class='camera-bottom'></div>\n                                  <div class=\"camera-picture\"><img src=" + snapshot + " alt=\"\"></div>\n                                </div>";
    document.body.appendChild(camera);
    var time = 8;
    var timer = setInterval(function () {
        document.getElementById('count-down').innerText = time + 's';
        time--;
        if (time <= 0) {
            destoryCa();
        }
    }, 1000);
    function destoryCa() {
        camera.parentNode.removeChild(camera);
        clearInterval(timer);
    }
    ;
    document.getElementById('close-camera').onclick = destoryCa;
};
function keepLastIndex(obj) {
    if (window.getSelection) { //ie11 10 9 ff safari
        obj.focus(); //解决ff不获取焦点无法定位问题
        var range = window.getSelection(); //创建range
        range.selectAllChildren(obj); //range 选择obj下所有子内容
        range.collapseToEnd(); //光标移至最后
    }
    else if (document.selection) { //ie10 9 8 7 6 5
        var range = document.selection.createRange(); //创建选择对象
        //var range = document.body.createTextRange();
        range.moveToElementText(obj); //range定位到obj
        range.collapse(false); //光标移至最后
        range.select();
    }
}
export { emptyChildren, gotoPosition, getScroll, highlightKeyword, getWebIcon, getViewPosition, moveable, writeTextToClipboard, captureElementImage, convertImgToBase64, showCamera, keepLastIndex };
//# sourceMappingURL=document.js.map