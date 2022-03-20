var defaultWrapperFun = function (text) {
    var light = document.createElement('light');
    light.dataset.highlight = '1';
    light.style.color = 'red';
    light.textContent = text;
    return light;
};
// 按字符串逐字高亮
function wrapMatchesAcrossElements(dict, regex, ignoreGroups, warpTagFun, filter, eachCb, endCb) {
    var matchIdxDef = ignoreGroups + 1;
    (function checkMatch(dict, matchIdx) {
        var tempMatch = regex.exec(dict.value);
        if (tempMatch && tempMatch[matchIdx]) {
            var start = tempMatch.index;
            if (matchIdx !== 0) {
                for (var i = 1; i < matchIdx; i++) {
                    start += tempMatch[i].length;
                }
            }
            // 当前字符串匹配到的开始偏移量、结束偏移量
            var end = start + tempMatch[matchIdx].length;
            // 对待高亮关键词字符串，进行包裹处理 标签处理
            wrapRangeInMappedTextNode(dict, start, end, function (node) {
                return filter(tempMatch[matchIdx], node);
            }, function (node, lastIndex) {
                regex.lastIndex = lastIndex; // 重置上次匹配结果
                eachCb(node);
            });
            // 继续查找后续节点，匹配关键词。能够做到一个根节点下高亮相同的关键词
            checkMatch(dict, matchIdx);
        }
    })(dict, matchIdxDef);
    endCb();
    // 循环处理每一个文本节点
    function wrapRangeInMappedTextNode(dict, start, end, filter, eachCb) {
        // 给为for break 方式跳出
        dict.nodes.every(function (n, i) {
            // 下一个节点
            var sibl = dict.nodes[i + 1];
            // 如果没有下一个节点，或者下一个节点的初始位置大于 高亮起始位置时。0-8,8-9,start 7
            if (typeof sibl === 'undefined' || sibl.start > start) { // TODO 判断优化
                if (!filter(n.node)) {
                    return false;
                }
                // map range from dict.value to text node
                var s = start - n.start, e_1 = (end > n.end ? n.end : end) - n.start, startStr = dict.value.substr(0, n.start), endStr = dict.value.substr(e_1 + n.start);
                n.node = wrapRangeInTextNode(n.node, s, e_1);
                // 重置字典待匹配字符串
                dict.value = startStr + endStr;
                // 修正偏移量
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
    // 文本节点包裹处理
    function wrapRangeInTextNode(node, start, end) {
        var startNode = node.splitText(start);
        var rest = startNode.splitText(end - start);
        var replaced = warpTagFun(startNode.textContent);
        startNode.parentNode.replaceChild(replaced, startNode);
        return rest;
    }
}
/**
 * 包裹 img 标签
 * */
function wrapImages(htmlNode, imageSrc) {
    var target = htmlNode.querySelector("img[src=\"".concat(imageSrc, "\"]"));
    if (target) {
        var warppedImg = document.createElement('light-img');
        warppedImg.appendChild(target.cloneNode());
        target.parentElement.replaceChild(warppedImg, target);
        warppedImg._originNode = target;
        return warppedImg;
    }
}
/** 获取元素的文本节点集合，最小元素单位，element 整个文本字符串 <div>文字 <span>内容</span></div> => {value: "文字 内容",nodes:[{node:"文字",start:0,end:2}]} */
function getTextNodes(element) {
    var nodes = [];
    var filter = {
        acceptNode: function (node) {
            var condition = node.nodeType === 3;
            return condition ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
        }
    };
    var iter = document.createNodeIterator(element, NodeFilter.SHOW_TEXT, filter);
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
/**转义正则关键词*/
function formatKeyword(keyword) {
    if (!keyword) {
        return "\\s*";
    }
    return keyword.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&').replace(/[\s]+/gmi, '[\\s]*');
}
/**在HTML element中高亮关键词*/
var highlightKeywordInElement = function (element, keywords, pre, next, deep, warpTagFun, blackNodes) {
    if (pre === void 0) { pre = ''; }
    if (next === void 0) { next = ''; }
    if (deep === void 0) { deep = 20; }
    if (warpTagFun === void 0) { warpTagFun = defaultWrapperFun; }
    if (blackNodes === void 0) { blackNodes = []; }
    var result = {
        match: 0,
        lightsElement: [],
    };
    var dict = getTextNodes(element);
    var handler = function (kw, pre, suffix) {
        if (pre === void 0) { pre = ''; }
        if (suffix === void 0) { suffix = ''; }
        var formatKw = formatKeyword(kw);
        var formatPre = formatKeyword(pre.trim());
        var formatSuffix = formatKeyword(suffix.trim());
        var hasSuffix = !!suffix;
        var checkStr = "(".concat(formatPre, "\\s*)(").concat(formatKw, ")\\s*").concat(hasSuffix ? "(".concat(formatSuffix, ")") : '');
        var regex = new RegExp(checkStr, 'gmi');
        wrapMatchesAcrossElements(dict, regex, 1, warpTagFun, function (term, node) {
            var isBlack = (blackNodes || []).some(function (block) {
                return block && block.contains(node);
            });
            console.log(node, node.nodeType);
            var parent = node.nodeType === 3 ? node.parentNode : node;
            // const parent = node.parentNode;
            // @ts-ignore
            var hasLighted = !!parent.dataset.highlight;
            // @ts-ignore
            return !isBlack && !hasLighted && node.tagName !== 'LIGHT';
        }, function (element) {
            result.match++;
            result.lightsElement.push(element);
        }, function () {
        });
    };
    handler(keywords, pre, next);
    // if(result.match===0){
    //     handler(keywords)
    // }
    return result;
};
function isWrappedImg(ele) {
    return '_originNode' in ele;
}
/**移除高亮、还原HTML节点*/
var removeElementHighlight = function (query) {
    var element;
    if (typeof query === 'string') {
        element = document.querySelector(query);
    }
    else if (query instanceof HTMLElement) {
        element = query;
    }
    if (!element) {
        return;
    }
    if (isWrappedImg(element)) {
        element.parentNode.replaceChild(element._originNode, element);
    }
    else {
        var result = [].find.call(element.childNodes, (function (node) {
            return node.nodeType === 3 || node.nodeName === '#text';
        }));
        element.outerHTML = result ? result.textContent : element.textContent;
    }
};
export { wrapImages, highlightKeywordInElement, removeElementHighlight, };
//# sourceMappingURL=highlight.js.map