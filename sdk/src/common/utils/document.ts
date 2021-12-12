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

export {
    getWebIcon,
    getWebTitle,
    getWebDescription,
    contentToFile,
    loadScript,
}