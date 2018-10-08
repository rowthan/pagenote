const gotoPosition = function(targetX=0,targetY=0,callback){
    const timer = setInterval(function () {
        //移动前
        const { x:beforeScrollLeft,y:beforeScrollTop} = getScroll();
        const distanceX = targetX - beforeScrollLeft
        , distanceY =  targetY - beforeScrollTop
        
        //移动后
        setScroll(beforeScrollLeft+Math.floor(distanceX/6),Math.floor(beforeScrollTop+distanceY/6))
        
        const {x:afterScrollLeft,y:afterScrollTop} = getScroll()
        
        if(beforeScrollTop === afterScrollTop && beforeScrollLeft === afterScrollLeft){
            clearInterval(timer)
            typeof callback === "function" && callback()
        }
    },30)
    return timer
}

const IS_TOUCH = 'ontouchstart' in window,
//TODO 优化移动设备
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
   return { 'x': x, 'y': y };
},

hightLightElement = function (element,text,revert){
    if(!element || text===undefined){
        return
    }
    //还原高亮
    if(revert===true){
        const highlightElements = element.querySelectorAll("b[data-highlight='easyshare']")
        for(let i=0; i<highlightElements.length; i++){
            console.log(i)
            const ele = highlightElements[i]
            //如果不是easyshare高亮处理的元素 且不是该文本高亮的内容时候
            if(ele.dataset["highlight"]===undefined && ele.dataset['originText']!=text){
                continue;
            }
            //TODO 优化 不通过 parent来修改
            ele.outerHTML = text
        }
        return;
    }
    //高亮
    const originhtml = text || element.innerHTML;//TODO 对原先的 html 引号做处理
    const left = '<b data-highlight="easyshare" data-originText="'+text+'" data-originhtml="'+originhtml+'" style="color:red">',
        right = '</b>',
        after = left+text+right
    let finder = new RegExp(text,"g")
    element.innerHTML = element.innerHTML.replace(finder,after)
    //TODO 还原背景色
    // element.style.background = "#f3f0ed"
    //TODO 增加背景突显动画
}


const documentTarget = document.documentElement || document.body
function getScroll(){
    var x = documentTarget.scrollLeft || documentTarget.scrollLeft;
    var y = documentTarget.scrollTop || documentTarget.scrollTop;
    return {x,y}
}

function setScroll(x=0,y=0){
    documentTarget.scrollLeft = documentTarget.scrollLeft = x;
    documentTarget.scrollTop =  documentTarget.scrollTop = y;
}

function getViewPosition(elem) { // crossbrowser version
    var box = elem.getBoundingClientRect();
    return { top: box.top, left: box.left };
}

export {
    gotoPosition,
    getXY,
    hightLightElement,
    getScroll,
    getViewPosition
}