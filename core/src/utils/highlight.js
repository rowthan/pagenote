
// 按字符串逐字高亮
function wrapMatchesAcrossElements(dict,regex, ignoreGroups, warpTagFun,filter, eachCb, endCb) {
    const matchIdxDef = ignoreGroups === 0 ? 0 : ignoreGroups+1;

    (function checkMatch(dict,matchIdx){
        const tempMatch = regex.exec(dict.value);
        if(tempMatch && tempMatch[matchIdx]){
            let start = tempMatch.index;
            if (matchIdx !== 0) {
                for (let i = 1; i < matchIdx; i++) {
                    start += tempMatch[i].length;
                }
            }
            // 当前字符串匹配到的开始偏移量、结束偏移量
            const end = start + tempMatch[matchIdx].length;

            // 对待高亮关键词字符串，进行包裹处理 标签处理
            wrapRangeInMappedTextNode(dict, start, end, node => {
                return filter(tempMatch[matchIdx], node);
            }, (node, lastIndex) => {
                regex.lastIndex = lastIndex; // 重置上次匹配结果
                eachCb(node);
            });
            checkMatch(dict,matchIdx);
        }
    })(dict,matchIdxDef)

    endCb();

    // 循环处理每一个文本节点
    function wrapRangeInMappedTextNode(dict, start, end, filter, eachCb) {
        // 给为for break 方式跳出
        dict.nodes.every((n, i) => {
            // 下一个节点
            const sibl = dict.nodes[i + 1];
            // 如果没有下一个节点，或者下一个节点的初始位置大于 高亮起始位置时。0-8,8-9,start 7
            if (typeof sibl === 'undefined' || sibl.start > start) { // TODO 判断优化
                if (!filter(n.node)) {
                    return false;
                }
                // map range from dict.value to text node
                const s = start - n.start,
                    e = (end > n.end ? n.end : end) - n.start,
                    startStr = dict.value.substr(0, n.start),
                    endStr = dict.value.substr(e + n.start);
                n.node = wrapRangeInTextNode(n.node, s, e);
                // 重置字典待匹配字符串
                dict.value = startStr + endStr;
                // 修正偏移量
                dict.nodes.forEach((k, j) => {
                    if (j >= i) {
                        if (dict.nodes[j].start > 0 && j !== i) {
                            dict.nodes[j].start -= e;
                        }
                        dict.nodes[j].end -= e;
                    }
                });
                end -= e;
                eachCb(n.node.previousSibling, n.start);
                if (end > n.end) {
                    start = n.end;
                } else {
                    return false;
                }
            }
            return true;
        });
    }

    // 文本节点包裹处理
    function wrapRangeInTextNode(node,start,end) {
        const startNode = node.splitText(start)
        const rest = startNode.splitText(end - start);
        const replaced = warpTagFun(startNode.textContent);
        startNode.parentNode.replaceChild(replaced, startNode);
        return rest;
    }
}

// 拆分一个 element，得到元素的文本节点集合，最小元素单位，element 整个文本字符串
function getTextNodes(element) {
    let nodes = [];
    const filter = {
        acceptNode: function (node) {
            const condition = node.nodeType === 3;
            return condition ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT
        }
    };
    const iter = document.createNodeIterator(element, NodeFilter.SHOW_TEXT, filter, false);
    let tempNote;
    let val = '';
    while (tempNote = iter.nextNode()) {
        nodes.push({
            node: tempNote,
            start: val.length,
            end: (val += tempNote.textContent).length
        })
    }
    const dict = {
        nodes: nodes,
        value: val,
    };
    return dict;
}

// 处理关键词转义
function formatKeyword(keyword){
    return keyword.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&').replace(/[\s]+/gmi, '[\\s]*');
}

// 高亮一个元素内的关键词，return {match:2,light:1,lights:[elements]}
const highlightKeywordInElement = function (element,keywords,pre='',next='',deep=20,warpTagFun,blackNodes=[]){
    // 返回结果
    const result = {
        match: 0,
        lightsElement: [],
    }
    if(!element || !keywords){
        return result;
    }

    // 包装方法，可自定义
    warpTagFun = warpTagFun || function (text){
        const light = document.createElement('light');
        light.dataset.highlight='1';
        light.style.color = 'red';
        light.textContent = text;
        return light;
    };
    const dict = getTextNodes(element);
    const handler = (kw,pre,suffix) => {
        const formatKw = formatKeyword(kw);
        const formatPre = formatKeyword(pre);
        const formatSuffix = formatKeyword(suffix);
        const regex = new RegExp('('+formatPre+')'+'\\s*('+formatKw+')\\s*'+'('+formatSuffix+')','gmi');  // TODO 考虑pre next (${formatPre}) (${formatSuffix})
        wrapMatchesAcrossElements(dict,regex, 1,warpTagFun, (term, node) => {
            const isBlack = blackNodes.some((black)=>{
                return black.contains(node);
            });
            const parent = node.nodeType===3 ? node.parentNode : node;
            let hasLighted = !!parent.dataset.highlight;
            return !isBlack && !hasLighted && node.tagName!=='LIGHT';
        }, element => {
            result.lightsElement.push(element);
        }, () => {

        });
    };

    handler(keywords,pre,next);
    return result;
};

// 移除高亮、还原
const removeElementHighlight = function (query){
    let element;
    if(typeof query==='string'){
        element = document.querySelector(query);
    }else if(query instanceof HTMLElement){
        element = query;
    }

    if(element.dataset.type==='img'){
        element.outerHTML = element.innerHTML;
    }else {
        const result = [].find.call(element.childNodes,((node)=>{
            return node.nodeType === 3 || node.nodeName==='#text'
        }));
        element.outerHTML = result?result.textContent : element.textContent;
    }
}

export {
    highlightKeywordInElement,
    removeElementHighlight,
}
