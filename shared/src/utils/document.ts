function getWebIcon():string {
    const iconEle = document.querySelector('link[rel~=icon]');
    // @ts-ignore
    return iconEle ? iconEle.href : '';
}

function getWebTitle():string {
    const title = document.querySelector('title');
    return title ? title.innerText : ''
}

function getWebDescription():string {
    const title = document.querySelector('meta[name=description]');
    return title ? title.getAttribute('content') : ''
}

const contentToFile = function (content:string, filename:string):void {
    const eleLink = document.createElement('a');
    eleLink.download = filename;
    eleLink.style.display = 'none';
    // 字符内容转变成blob地址
    const blob = new Blob([content]);
    eleLink.href = URL.createObjectURL(blob);
    // 触发点击
    document.body.appendChild(eleLink);
    eleLink.click();
    // 然后移除
    document.body.removeChild(eleLink);
};

function loadScript(src:string,globalKey?:string,callback?:Function):void {
    //@ts-ignore
    if(window && globalKey && window[globalKey]){
        typeof callback==='function' && callback();
        return;
    }else{
        const script = document.createElement('script');
        script.src = src;
        document.body.appendChild(script);
        // @ts-ignore
        script["onload"] = callback || function () {}
    }
}

function appendScriptsToBody(scripts:string[]):void {
    scripts.forEach(function (scriptSrc:string) {
        const script = document.createElement('script');
        script.src = scriptSrc;
        document.body.appendChild(script);
    });
}

function onVisibilityChange(callback:(hidden:boolean)=>void):()=>void {
    // 设置隐藏属性和改变可见属性的事件的名称
    let visibilityChange = 'visibilitychange';
    if (typeof document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support
        visibilityChange = "visibilitychange";
    } else { // @ts-ignore
        if (typeof document['msHidden'] !== "undefined") {
                visibilityChange = "msvisibilitychange";
        } else { // @ts-ignore
            if (typeof document['webkitHidden'] !== "undefined") {
                visibilityChange = "webkitvisibilitychange";
            }
        }
    }
    const listener = function(){
        callback(document.hidden)
    }
    document.addEventListener(visibilityChange,listener);
    return function () {
        document.removeEventListener(visibilityChange,listener)
    }
}

export {
    getWebIcon,
    getWebTitle,
    getWebDescription,
    contentToFile,
    loadScript,
    appendScriptsToBody,
    onVisibilityChange,
}