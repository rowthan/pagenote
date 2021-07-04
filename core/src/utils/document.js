import { throttle, convertColor} from "./index";
import md5 from "blueimp-md5";
import html2canvas from "html2canvas";
import Canvas2Image from "./canvas2image";

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
    const {textColor,rgb} = convertColor(color);
    const bottomColor = `rgb(${(rgb[0]-30)},${(rgb[1]-30)},${(rgb[2]-30)})`;
    const bgColor = `rgba(${rgb.toString()},1)`;
    highlightEl.style=`--bgcolor:${bgColor};--color:${textColor};--bgbottomcolor:${bottomColor}`;

    highlightEl.textContent = startNode.textContent;
    if(color==='rgba(1,1,1,0.5)'){
        highlightEl.dataset.mask = '1';
    }
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


highlightKeyword = function (wid,element,text,hightlight,color='',blackNodes=[],callback){
    if(!element || !text){
        callback({
            totalMatches:0
        });
        return;
    }
    const id = md5(wid+text);
    // 如果是还原 则不进行之后操作
    if(!hightlight){
        const highlightElements = element.querySelectorAll(`light[data-highlight='${id}']`);
        //还原高亮，即便是高亮 也要先还原高亮
        for(let i=0; i<highlightElements.length; i++){
            const ele = highlightElements[i];
            ele.outerHTML = [].find.call(ele.childNodes,((node)=>{
                return node.nodeType === 3 || node.nodeName==='#text'
            })).textContent;
        }
        const leftHighlight = element.querySelectorAll('light[data-highlight]');
        // if(leftHighlight.length===0){
        //     delete element.dataset.highlightbk
        // }
        return
    }

    // element.dataset.highlightbk="y";
    let totalMatches = 0,kwArr=[text];
    const dict = getTextNodes(element);
    dict.id = id;
    dict.color = color;
    let hasLighted = 0;
    const handler = kw => {
        const regex = new RegExp(text.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&').replace(/[\s]+/gmi, '[\\s]+'),'gmi');
        let matches = 0;
        wrapMatchesAcrossElements(dict,regex, 0, (term, node) => {
            const isBlack = blackNodes.some((black)=>{
                return black.contains(node);
            });
            const parent = node.parentNode || document.body;
            hasLighted = parent.dataset.highlight?hasLighted+1:hasLighted;
            // 黑名单和已高亮过的不做高亮处理
            const valid = !isBlack && !parent.dataset.highlight;
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
            id: dict.id,
        });
    }
};

let lock = false
const gotoPosition = function(element,targetX,targetY,onFinished){
    if(lock){
        // 互斥锁
        setTimeout(()=>{
            gotoPosition(element,targetX,targetY,onFinished)
        },1000)
        return;
    }
    lock = true;
    const callback = function () {
        lock = false;
        typeof onFinished === "function" && onFinished()
    }
    if(!element){
        callback()
    }
    const inBottomView = targetY>document.documentElement.clientHeight/2;
    // 优先使用算法，移动到视野的 1/3位置，然后计算确认，兜底使用scrolltoView
    if(inBottomView && element&&element.scrollIntoView){
        element.scrollIntoView({block:"center",behavior:'smooth'});
        typeof callback === "function" && setTimeout(()=>callback(),100);
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
            callback();
        }
    },30)
    function setScroll(x,y){
        documentTarget.scrollLeft = x;
        documentTarget.scrollTop = y;
        window.scrollTo(x,y)
    }
    return
}

const documentTarget = document.documentElement || document.body
function getScroll(){
    var x = window.pageXOffset || documentTarget.scrollLeft || documentTarget.scrollLeft;
    var y = window.pageYOffset || documentTarget.scrollTop || documentTarget.scrollTop;
    return {x,y}
}


function emptyChildren(element) {
    while(element.hasChildNodes()) //当div下还存在子节点时 循环继续
    {
        element.removeChild(element.firstChild);
    }
}

function getViewPosition(elem) { // crossbrowser version
    var box = elem.getBoundingClientRect();
    const scroll = getScroll();
    return {
        top: box.top,
        left: box.left,
        bodyTop: box.top + scroll.y,
        bodyLeft: box.left + scroll.x,
    };
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

function getWebIcon() {
    const iconEle = document.querySelector('link[rel~=icon]');
    return iconEle ? iconEle.href : window.location.origin+'/favicon.ico';
}

function convertImgToBase64(url,width,height, callback, outputFormat){
    var canvas = document.createElement('CANVAS');
    var ctx = canvas.getContext('2d');
    var img = new Image;
    img.crossOrigin = 'Anonymous';
    img.onload = function(){
        var width = img.width;
        var height = img.height;
        // 按比例压缩4倍
        // var rate = (width<height ? width/height : height/width)/4;

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img,0,0,width,height,0,0,width,height);
        var dataURL = canvas.toDataURL(outputFormat || 'image/png');
        callback.call(this, dataURL);
        canvas = null;
    };
    img.src = url;
}


function moveable(element,callback,childMove=true) {
    if(!element) {
        return
    }
    const isMobile = 'ontouchstart' in window;
    element.style.cursor = 'move';
    let canMove = false;
    const downEvent = isMobile?'touchstart':'mousedown';
    element.addEventListener(downEvent,function (e) {
        if(childMove===false && e.target !== element){
            return;
        }
        e.stopPropagation();
        setTimeout(()=>{
            canMove = true;
        },300);
    },{capture: true});
    const upEvent = isMobile?'touchend':'mouseup';
    document.addEventListener(upEvent,function () {
        canMove = false;
        setTimeout(()=>{
            canMove = false;
            document.body.style.userSelect='auto';
        },300)
    },{capture: true});
    const moveEvent = isMobile?'touchmove':'mousemove';
    document.addEventListener(moveEvent,throttle(function (e) {
        if(canMove){
            document.body.style.userSelect='none';
            callback(isMobile?e.touches[0]:e)
        }
    },1000/60),{capture: true})
}

function writeTextToClipboard(text) {
    try {
        return  navigator.clipboard.writeText(text)
    } catch (e) {
        const textarea = document.createElement('textarea');
        textarea.textContent = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('Copy', false, null);
        document.body.removeChild(textarea)
    }
}

function captureElementImage(target) {
    return new Promise((resolve,reject)=>{
        html2canvas(target,{
            useCORS: true,
            ignoreElements: function (element) {
                const isPagenote = element.tagName.toLowerCase().indexOf('pagenote')>-1;
                const unVisiable = getComputedStyle(element).opacity<=0;
                return isPagenote || unVisiable;
            }
        }).then((canvas)=>{
            const result = Canvas2Image.convertToImage(canvas,target.offsetWidth,target.scrollHeight).src;
            resolve(result);
        }).catch((e)=>{
            reject(e);
        })
    });
}

var showCamera = function (snapshot) {
    const camera = document.createElement('pagenote-camera');
    const tip = '个快照';
    camera.innerHTML = `<div class='pagenote-camera-container'>
                                  <div class='camera-top'>
                                    <div class='zoom'></div>
                                    <div class='mode-changer'></div>
                                    <div class='sides'></div>
                                    <div class='range-finder'></div>
                                    <div class='focus'></div>
                                    <div class='red'></div>
                                    <div class='view-finder'></div>
                                    <div class='flash'>
                                      <div class='light'></div>
                                    </div>
                                  </div>
                                  <div class='camera-mid'>
                                    <div class='sensor'></div>
                                    <div class='lens'></div> 
                                    <div class="tip"><div>已拍照完成并保存，你可以在管理页进行查看、编辑。</div><button><a target="_blank" href="https://pagenote.cn/me">前往查看${tip}</a></button><button id="close-camera">关闭摄像机<span id="count-down">8s</span></button></div>
                                  </div>
                                  <div class='camera-bottom'></div>
                                  <div class="camera-picture"><img src=${snapshot} alt=""></div>
                                </div>`;
    document.body.appendChild(camera);


    let time = 8;
    const timer = setInterval(()=>{
        document.getElementById('count-down').innerText = time + 's';
        time--;
        if(time<=0){
            destoryCa();
        }
    },1000);

    function destoryCa() {
        camera.parentNode.removeChild(camera);
        clearInterval(timer);
    };

    document.getElementById('close-camera').onclick = destoryCa;
};

export {
    emptyChildren,
    gotoPosition,
    getScroll,
    highlightKeyword,
    getWebIcon,
    getViewPosition,
    moveable,
    writeTextToClipboard,
    captureElementImage,
    convertImgToBase64,
    showCamera
}
