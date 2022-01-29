// @ts-nocheck
import whatsPure from "whats-element/pure";
import {AnnotationStatus, LightStatus, Target} from "../../../shared/src/@types/Types";
import {getScroll} from "./document";
// import console from "./console";
const whats = new whatsPure();

const isMobile = ('ontouchstart' in window) || window.innerWidth<600;

function getPagenoteRoot() {
    let root =  document.querySelector('pagenote-root');
    if(!root){
        root = document.createElement('pagenote-root');
        // Firefox 下 必须要放在 body 内 delete 键才会生效
        (document.body || document.documentElement).appendChild(root)
    }
    return root;
}

function getRootOffset() {
    const root = getPagenoteRoot();
    let offset = root.getBoundingClientRect();

    return {
        left: offset.left + getScroll().x,
        top: offset.top + getScroll().y,
        scrollHeight: root.parentElement.scrollHeight,
    };
}

const prepareSelectionTarget = function (enableMarkImg,positions): Target {
    const selection = document.getSelection();
    if(selection.rangeCount===0){
        // console.log('无选区')
        return null;
    }

    // 选区父节点是否存在
    const range0 = selection.getRangeAt(0);
    let parentElement = selection.anchorNode ? range0.commonAncestorContainer : null;
    if(parentElement && parentElement.nodeType===3){ // 如果父节点为文本节点，则需要再寻一级父节点
        parentElement = parentElement.parentNode;
    }
    const noParentElement = !parentElement || !parentElement.tagName;
    if(noParentElement){
        console.log('无父节点')
        return null;
    }

    function checkInPagenoteElement(element) {
        if(element && element.tagName){
            const tagName = element.tagName.toLowerCase();
            const isPagenote = ['light'].includes(tagName) || tagName.indexOf('pagenote')>-1;
            if(isPagenote){
                return true
            } else if(element.parentNode){
                return checkInPagenoteElement(element.parentNode);
            }
        } else {
            return false;
        }
    }

    // 选区 黑名单检测
    if(checkInPagenoteElement(parentElement) || checkInPagenoteElement(selection.anchorNode) || checkInPagenoteElement(selection.focusNode) ){
        console.log('黑名单')
        return null;
    }

    // 是否可编辑区
    let canHighlight = true;
    if(!parentElement || parentElement.contentEditable==='true'){
        canHighlight = false;
    }

    // 监测是否有图片资源
    const markImages = [];
    const selectedElementContent = range0.cloneContents();
    const children = selectedElementContent.children;
    for(let i=0; i< children.length; i++){
        const item = children[i];
        if(item.tagName==='IMG'){
            // 找到对应的图片节点
            const id = `img[src="${item.src}"]`;
            const elements = parentElement.querySelectorAll(id);
            for(let j=0; j<elements.length; j++){
                const element = elements[j];
                if(selection.containsNode(element)){
                    const imgId = whats.getUniqueId(element).wid;
                    const imgUrl = element.src;
                    markImages.push({
                        id: imgId,
                        src: imgUrl,
                        alt: element.alt,
                        // pre: element.previousSibling?.textContent,
                        // suffix: element.nextSibling?.textContent,
                    })
                    break;
                }
            }
        }
    }

    const selectedText = selection.toString().trim(); // 跨标签高亮
    if(!(selectedText || markImages.length)){
        // console.log('无内容')
        return null
    }

    /**上下文计算*/
    // TODO 双击情况下 ，before 计算会存在问题
    let before = range0.startContainer.textContent.substr(0,range0.startOffset);
    let after = range0.endContainer.textContent.substr(range0.endOffset,10);

    if(!before){
        const preElement = parentElement.previousSibling;
        if(preElement && parentElement.contains(preElement)){
            before = preElement.textContent;
        }
    }
    if(!after){
        const nextElement = parentElement.nextSibling;
        if(nextElement && parentElement.contains(nextElement)){
            after = nextElement.textContent;
        }
    }

    const selectionRects=selection.getRangeAt(0).getClientRects();
    let relativeRect=selectionRects[selectionRects.length-1];
    if(!relativeRect){
        console.log('无选区节点')
        return null;
    }


    // 鼠标起始位置
    const startPosition = positions[0];
    // 鼠标落点位置
    const endPosition = positions[1];
    // 正逆方向计算
    let offsetRelative:number;

    // 判断是顺、反方向
    let eOffsetX = endPosition.x - startPosition.x;
    let eOffsetY = endPosition.y - startPosition.y;
    // x,y 方向一致情况下，直接取值
    if(Math.abs(eOffsetY)>14){
        offsetRelative = eOffsetY > 1 ? 1: -1
    }else{
        offsetRelative = eOffsetX > 0 ? 1 : -1
    }
    // if(eOffsetY * eOffsetX < 0){
    //     offsetRelative = -1
    // } else {
    //     // 方向不一致的情况下，按照偏移量大计算
    //     const relativeDirection = Math.abs(eOffsetX) - Math.abs(eOffsetY) >=0 ? eOffsetX : eOffsetY;
    //     offsetRelative = relativeDirection>=0 ? 1 : -1;
    // }
    // console.log(startPosition,endPosition)
    // offsetRelative = eOffsetX * eOffsetY < 0;
    // if(eOffsetX * eOffsetY < 0){
    //     const relativeDirection = Math.abs(eOffsetX) - Math.abs(eOffsetY) >=0 ? eOffsetX : eOffsetY;
    //     offsetRelative = relativeDirection>=0 ? 1 : -1;
    // } else {
    //     offsetRelative = eOffsetX >= 0 ? 1 : -1;
    // }

    // 根据正逆方向，选择用于计算位置的选区标准，如果是逆向，则取第一个选区
    if(offsetRelative===-1){
        relativeRect = selectionRects[0]
    }

    const scrollY =  window.scrollY+relativeRect.y;
    const offsetX = offsetRelative === 1 ? relativeRect.width + 6 : -32;
    const offsetY = offsetRelative === 1 ? relativeRect.height + 4 : -32;
    let x = Math.max(Math.min(relativeRect.x + offsetX,window.innerWidth-150),20);
    let y = scrollY + offsetY;


    const whatsEl = whats.getUniqueId(parentElement);
    const cursorX = parseInt(x);
    const cursorY = parseInt(y);

    const rootOffset = getRootOffset();
    const ignoreOffsetY = cursorY - rootOffset.top;

    let clientX,clientY;
    if(offsetRelative===-1){
        clientX = relativeRect.left - 30;
        clientY = relativeRect.top - 30;
    } else{
        clientX = relativeRect.left + relativeRect.width;
        clientY = relativeRect.top + relativeRect.height;
    }

    const target = {
        x:cursorX - rootOffset.left,
        y: Math.min(ignoreOffsetY, scrollY+document.documentElement.scrollHeight - 60),
        offsetX: 0.5,
        offsetY: 0.9,
        pre:before,
        suffix:after,
        text:selectedText,
        tip:'', // 提供支持纯文本的取值方式
        time: Date.now(),
        id: whatsEl.wid,
        isActive: false,
        bg: '',
        parentW: parseInt(parentElement.clientWidth),
        clientX: clientX,
        clientY: clientY,
        canHighlight: canHighlight,
        selectionElements: selectedElementContent,
        images: markImages,
        annotationStatus: AnnotationStatus.HIDE,
        lightStatus: LightStatus.HALF
    };

    return target
}

// http://bai.com?a=1&b=2  output [a,b],{a:1,b:1}
function getParams(url) {
    const urlSearch = url || window.location.href;
    const paramStr = (urlSearch.match(/\?(.*)/)||[])[1];
    const paramObj = {};
    const paramKeys = [];
    if (!paramStr) {
        return {
            paramObj,
            paramKeys
        };
    }
    paramStr.split('&').forEach((item) => {
        const tempArr = item.split('=');
        if(tempArr[0]){
            paramKeys.push(tempArr[0]);
            paramObj[tempArr[0]] = tempArr[1];
        }
    });
    return {
        paramObj,
        paramKeys
    };
}

// TODO 优化精简字符串长度
function encryptData(string) {
    return btoa(encodeURI(JSON.stringify(string)))
}

function decryptedData(data) {
    let result = {};
    try {
        result = JSON.parse(decodeURI(atob(data)));
    }catch (e) {

    }
    return result;
}

function throttle(fn, interval = 300) {
    let canRun = true;
    return function () {
        if (!canRun) return;
        canRun = false;
        setTimeout(() => {
            fn.apply(this, arguments);
            canRun = true;
        }, interval);
    };
}

function debounce(fn, interval = 300) {
    let timeout = null;
    return function () {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            fn.apply(this, arguments);
        }, interval);
    };
}

// rgba(12,323,456) #123222
function convertColor(color='') {
    if(!color){
        return '#000000';
    }
    let rgb = [];
    let rate = 1;
    if(color.indexOf('rgb')>-1){
        rgb = color.match(/\((.*)\)/)[1].split(',');
        rgb = [parseInt(rgb[0]),parseInt(rgb[1]),parseInt(rgb[2])];
        if(rgb[3]!==undefined){
            rate = rgb[3];
        }
    }else{
        color = color.replace('#','');
        rgb = [color.substr(0,2),color.substr(2,2),color.substr(4,2),1]
        rgb = [parseInt(rgb[0],16),parseInt(rgb[1],16),parseInt(rgb[2],16)];
    }
    const r = rgb[0];
    const g = rgb[1];
    const b = rgb[2];
    const Y = (0.3*r + 0.59*g + 0.11*b)*Math.min(rate,1);
    return {
        rgb: rgb,
        textColor: Y >= 180 ? '#000000' : '#ffffff',
        y: Y,
    };
}



function computePosition(index,radio=30) {
    const p = 45//360/(colors.length-1);// 角度
    const hudu = ((2 * Math.PI / 360) * p ) * index;
    const offsetHudu = -45 * ( 2 * Math.PI / 360);
    const x =  Number.parseFloat(radio * Math.sin(hudu + offsetHudu)).toFixed(3);
    const y = Number.parseFloat(radio * Math.cos(hudu + offsetHudu)).toFixed(3);
    return {
        x:x,
        y:y,
    }
}

export {
    getParams,
    encryptData,
    decryptedData,
    throttle,
    debounce,
    convertColor,
    computePosition,
    prepareSelectionTarget,
    isMobile,
    whats,
    getPagenoteRoot,
    getRootOffset,
}

