

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
},


highlight = function (node,reg){
    if (node.nodeType == 3) {  
        const match = node.data.match(new RegExp(reg));
        if (match) {
            const highlightEl = document.createElement("b");
            highlightEl.dataset.highlight="y"
            const wordNode = node.splitText(match.index)
            wordNode.splitText(match[0].length); // 切割成前 关键词 后三个Text 节点
            const wordClone = wordNode.cloneNode(true);//省略构建一个文本节点
            highlightEl.appendChild(wordClone);//highlight 节点构建成功
            wordNode.parentNode.replaceChild(highlightEl, wordNode);// 替换该文本节点
        }
    } else if (node.nodeType == 1 && node.childNodes&& // only element nodes that have children
        !/(script|style)/i.test(node.tagName) // ignore script
        && node.dataset.highlight!="y"
    ) { 
        for (var i = 0; i < node.childNodes.length; i++) {
            highlight(node.childNodes[i], reg);
            i++
        }
    }  
},


hightLightElement = function (element,text,hightlight){
    if(!element || !text){
        return
    }
    
    const highlightElements = element.querySelectorAll("b[data-highlight='y']")
    //还原高亮，即便是高亮 也要先还原高亮
    for(let i=0; i<highlightElements.length; i++){
        const ele = highlightElements[i],originText = ele.dataset['origintext'] || ele.innerHTML
        //如果是其他步骤高亮的则不还原
        if(originText!=text){
            continue;
        }
        ele.outerHTML = originText
    }
    // 如果是还原 则不进行之后操作
    if(!hightlight){
        element.dataset.highlightbk="n"
        return
    }

    element.dataset.highlightbk="y"
    highlight(element,new RegExp(text.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')))
    //TODO 增加背景突显动画
}


const gotoPosition = function(targetX,targetY,callback){
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

export {
    gotoPosition,
    getXY,
    hightLightElement,
    getViewPosition
}