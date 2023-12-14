
/**包裹img标签*/
interface WrappedImage extends HTMLImageElement {
    _originNode: HTMLImageElement,
}

/**节点字典*/
interface Dict {
    nodes:{
        node: Text,
        start: number,
        end: number
    }[],
    value: string,
}

/** 高亮一个元素内的关键词，return {match:2,light:1,lights:[elements]} */
interface LightElement extends HTMLElement{
    dataset:{
        highlight?: string
        lightindex?: string
        type?: 'img' | undefined
    }
}

/**包裹文本节点方法*/
interface WarpTagFun {
    (text:string):LightElement
}

interface ElementFilter {
    (text:string,node:Node):boolean
}

const defaultWrapperFun = function (text){
    const light = document.createElement('light') as LightElement;
    light.dataset.highlight='1';
    light.style.color = 'red';
    light.textContent = text;
    return light;
} as WarpTagFun;

/**高亮结果*/
interface HighlightResult {
    match: number,
    lightsElement: LightElement[],
}



// 按字符串逐字高亮
function wrapMatchesAcrossElements(dict:Dict,regex:RegExp, ignoreGroups:number, warpTagFun:WarpTagFun,filter:ElementFilter, eachCb:(node:HTMLElement)=>void, endCb:()=>void) {
    const matchIdxDef = ignoreGroups+1;

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
            wrapRangeInMappedTextNode(dict, start, end, (node: Node) => {
                return filter(tempMatch[matchIdx], node);
            }, (node, lastIndex) => {
                regex.lastIndex = lastIndex; // 重置上次匹配结果
                eachCb(node);
            });
            // 继续查找后续节点，匹配关键词。能够做到一个根节点下高亮相同的关键词
            checkMatch(dict,matchIdx);
        }
    })(dict,matchIdxDef)

    endCb();

    // 循环处理每一个文本节点
    function wrapRangeInMappedTextNode(dict:Dict, start:number, end:number, filter:(node:Node)=>boolean, eachCb:(node:HTMLElement,start:number)=>void) {
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
                eachCb(<HTMLElement>n.node.previousSibling, n.start);
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
    function wrapRangeInTextNode(node:Text,start:number,end:number) {
        const startNode = node.splitText(start)
        const rest = startNode.splitText(end - start);
        const replaced = warpTagFun(startNode.textContent);
        startNode.parentNode.replaceChild(replaced, startNode);
        return rest;
    }
}

/**
 * 包裹 img 标签
 * */
function wrapImages(htmlNode:HTMLElement,imageSrc:string):WrappedImage{
    const target = <HTMLImageElement>htmlNode.querySelector(`img[src="${imageSrc}"]`);
    if(target){
        const warppedImg: WrappedImage = document.createElement('light-img') as WrappedImage;
        warppedImg.appendChild(target.cloneNode());
        target.parentElement.replaceChild(warppedImg,target);
        warppedImg._originNode = target
        return warppedImg;
    }
}


/** 获取元素的文本节点集合，最小元素单位，element 整个文本字符串 <div>文字 <span>内容</span></div> => {value: "文字 内容",nodes:[{node:"文字",start:0,end:2}]} */
function getTextNodes(element:HTMLElement):Dict {
    let nodes = [];
    const filter = {
        acceptNode: function (node:Node) {
            const condition = node.nodeType === 3;
            return condition ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT
        }
    };
    const iter = document.createNodeIterator(element, NodeFilter.SHOW_TEXT, filter);
    let tempNote:Node;
    let val = '';
    while (tempNote = iter.nextNode()) {
        nodes.push({
            node: tempNote as Text,
            start: val.length,
            end: (val += tempNote.textContent).length
        })
    }
    const dict:Dict = {
        nodes: nodes,
        value: val,
    };
    return dict;
}

/**转义正则关键词*/
function formatKeyword(keyword:string){
    if(!keyword){
        return "\\s*"
    }
    return keyword.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&').replace(/[\s]+/gmi, '[\\s]*');
}


/**在HTML element中高亮关键词*/
const highlightKeywordInElement = function (element:HTMLElement,keywords:string,pre='',next='',deep=20,warpTagFun:WarpTagFun=defaultWrapperFun,blackNodes:any[]=[]):HighlightResult{
    const result:HighlightResult = {
        match: 0,
        lightsElement: [],
    }

    const dict = getTextNodes(element);
    const handler = (kw:string,pre='',suffix='') => {
        const formatKw = formatKeyword(kw);
        const formatPre = formatKeyword(pre.trim());
        const formatSuffix = formatKeyword(suffix.trim());

        const hasSuffix = !!suffix;
        const checkStr = `(${formatPre}\\s*)(${formatKw})\\s*${hasSuffix ? `(${formatSuffix})`:''}`

        const regex = new RegExp(checkStr,'gmi');
        wrapMatchesAcrossElements(dict,regex, 1,warpTagFun, (term, node) => {
            const isBlack = (blackNodes || []).some((block)=>{
                return block && block.contains(node);
            });
            console.log(node,node.nodeType)
            const parent = node.nodeType===3 ? node.parentNode : node;
            // const parent = node.parentNode;
            // @ts-ignore
            let hasLighted = !!parent.dataset.highlight;
            // @ts-ignore
            return !isBlack && !hasLighted && node.tagName!=='LIGHT';
        }, element => {
            result.match ++;
            result.lightsElement.push(element);
        }, () => {
        });
    };
    handler(keywords,pre,next);
    // if(result.match===0){
    //     handler(keywords)
    // }
    return result;
};

declare const ele : HTMLElement | WrappedImage;
function isWrappedImg(ele: HTMLElement|WrappedImage): ele is WrappedImage{
    return '_originNode' in ele;
}

/**移除高亮、还原HTML节点*/
const removeElementHighlight = function (query:string|WrappedImage){
    let element:HTMLElement;
    if(typeof query==='string'){
        element = document.querySelector(query);
    }else if(query instanceof HTMLElement){
        element = query;
    }

    if(!element){
        return
    }

    if(isWrappedImg(element)){
        element.parentNode.replaceChild(element._originNode,element);
    }else {
        const result = [].find.call(element.childNodes,((node: Node)=>{
            return node.nodeType === 3 || node.nodeName==='#text'
        }));
        element.outerHTML = result?result.textContent : element.textContent;
    }
}

export type {
    LightElement
}
export {
    wrapImages,
    highlightKeywordInElement,
    removeElementHighlight,
}
