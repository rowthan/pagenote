import {encryptData} from "./utils";

const IS_TOUCH = 'ontouchstart' in window,
 getXY = IS_TOUCH
? e => {
const touch = e.touches[0] || e.changedTouches[0]
return touch ? {
    x: touch.pageX,
    y: touch.pageY
} : { x: 0, y: 0 }
}
: e => {
   var e = event || window.event;
   var x = e.pageX || e.clientX + getScroll().x;
   var y = e.pageY || e.clientY + getScroll().y;
   return {x, y};
}

function wrapRangeInTextNode(node,start,end,color,id) {
    const hEl = 'light',
        startNode = node.splitText(start),
        ret = startNode.splitText(end - start);
    let highlightEl = document.createElement(hEl);
    highlightEl.dataset.highlight=id;
    highlightEl.style.backgroundColor=color;
    highlightEl.textContent = startNode.textContent;
    startNode.parentNode.replaceChild(highlightEl, startNode);
    return ret;
}

// <div>ab<div>  ab
const highlightElement = function (node,keyword,color){
    const matchReg = new RegExp(keyword);
    if (node.nodeType === 3) { // 文本节点
        let match = node.data.match(matchReg);
        if (match) {
            wrapRangeInTextNode(node,match.index,match.index+match[0].length,color);
        }
    } else if (node.nodeType === 1 && node.childNodes&& // only element nodes that have children
        !/(script|style)/i.test(node.tagName) // ignore script
        && node.dataset.highlight!=="y"
    ) { 
        for (let i = 0; i < node.childNodes.length; i++) {
            highlightElement(node.childNodes[i],keyword,color);
            i++
        }
    }
},


highlightKeyword = function (element,text,hightlight,color='',blackNodes=[],callback){
    if(!element || !text){
        callback({
            totalMatches:0
        });
        return;
    }
    // 如果是还原 则不进行之后操作
    if(!hightlight){
        const highlightElements = element.querySelectorAll(`light[data-highlight='${encryptData(text)}']`);
        //还原高亮，即便是高亮 也要先还原高亮
        for(let i=0; i<highlightElements.length; i++){
            const ele = highlightElements[i];
            ele.outerHTML = ele.innerHTML;
        }
        const leftHighlight = element.querySelectorAll('light[data-highlight]');
        if(leftHighlight.length===0){
            delete element.dataset.highlightbk
        }
        return
    }

    element.dataset.highlightbk="y";
    let totalMatches = 0,kwArr=[text];
    const dict = getTextNodes(element);
    dict.id = encryptData(text);
    dict.color = color;
    let hasLighted = 0;
    const handler = kw => {
        const regex = new RegExp(text.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&').replace(/[\s]+/gmi, '[\\s]+'),'gmi');
        let matches = 0;
        wrapMatchesAcrossElements(dict,regex, 0, (term, node) => {
            const isBlack = blackNodes.some((black)=>{
                return black.contains(node);
            });
            hasLighted = node.parentNode.dataset.highlight?hasLighted+1:hasLighted;
            // 黑名单和已高亮过的不做高亮处理
            const valid = !isBlack && !node.parentNode.dataset.highlight;
            return valid;
        }, element => {
            matches++;
            totalMatches++;
            // console.log('each callback',element);
        }, () => {
            if (matches === 0) { // TODO 往上级寻找节点
                // console.log('没有匹配项')
            }
            if (kwArr[kwArr.length - 1] === kw) {
                // console.log('关键词已匹配完')
            } else {
                handler(kwArr[kwArr.indexOf(kw) + 1]);
            }
        });
    };
    if(kwArr.length === 0){
        // console.log('done totalMatch')
    } else {
        handler(kwArr[0]);
        if(totalMatches===0){
            setTimeout(()=>{
                handler(kwArr[0]);
            },2000)
        }
        typeof callback === 'function' && callback({
            totalMatches: totalMatches || hasLighted,
        });
    }
};


const gotoPosition = function(element,targetX,targetY,callback){
    if(element&&element.scrollIntoView){
        element.scrollIntoView({block:"center",behavior:'smooth'});
        typeof callback === "function" && setTimeout(()=>callback(),500);
        return;
    }
    const timer = setInterval(function () {
        //移动前
        const { x:beforeScrollLeft,y:beforeScrollTop} = getScroll();
        const distanceX = targetX - beforeScrollLeft
        , distanceY =  targetY - beforeScrollTop
        
        //移动后
        setScroll(beforeScrollLeft+distanceX/6,beforeScrollTop+distanceY/6)
        
        const {x:afterScrollLeft,y:afterScrollTop} = getScroll()
        
        if(beforeScrollTop === afterScrollTop && beforeScrollLeft === afterScrollLeft){
            clearInterval(timer)
            typeof callback === "function" && callback()
        }
    },30)
    return timer
}

const documentTarget = document.documentElement || document.body
function getScroll(){
    var x = window.pageXOffset || documentTarget.scrollLeft || documentTarget.scrollLeft;
    var y = window.pageYOffset || documentTarget.scrollTop || documentTarget.scrollTop;
    return {x,y}
}

function setScroll(x,y){
    documentTarget.scrollLeft = x;
    documentTarget.scrollTop = y;
    window.scrollTo(x,y)
}

//TODO 获取元素位于body相对位置信息 getViewPosition + getScroll

function getViewPosition(elem) { // crossbrowser version
    var box = elem.getBoundingClientRect();
    return { top: box.top, left: box.left };
}

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

function wrapMatchesAcrossElements(dict,regex, ignoreGroups, filterCb, eachCb, endCb) {
    const matchIdx = ignoreGroups === 0 ? 0 : ignoreGroups + 1;
    let match;
    while (
        (match = regex.exec(dict.value)) !== null &&
        match[matchIdx] !== ''
        ) {
        // calculate range inside dict.value
        let start = match.index;
        if (matchIdx !== 0) {
            for (let i = 1; i < matchIdx; i++) {
                start += match[i].length;
            }
        }
        const end = start + match[matchIdx].length;
        // note that dict will be updated automatically, as it'll change
        // in the wrapping process, due to the fact that text
        // nodes will be splitted
        wrapRangeInMappedTextNode(dict, start, end, node => {
            return filterCb(match[matchIdx], node);
        }, (node, lastIndex) => {
            // console.log(node,lastIndex)
            regex.lastIndex = lastIndex;
            eachCb(node);
        });
    }
    endCb();
}

function wrapRangeInMappedTextNode(dict, start, end, filterCb, eachCb) {
    // iterate over all text nodes to find the one matching the positions
    dict.nodes.every((n, i) => {
        const sibl = dict.nodes[i + 1];
        if (typeof sibl === 'undefined' || sibl.start > start) {
            if (!filterCb(n.node)) {
                return false;
            }
            // map range from dict.value to text node
            const s = start - n.start,
                e = (end > n.end ? n.end : end) - n.start,
                startStr = dict.value.substr(0, n.start),
                endStr = dict.value.substr(e + n.start);
            n.node = wrapRangeInTextNode(n.node, s, e,dict.color,dict.id);
            // recalculate positions to also find subsequent matches in the
            // same text node. Necessary as the text node in dict now only
            // contains the splitted part after the wrapped one
            dict.value = startStr + endStr;
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

export {
    gotoPosition,
    highlightKeyword,
    getViewPosition
}