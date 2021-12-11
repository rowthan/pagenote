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

export {
    getWebIcon,
    getWebTitle,
    getWebDescription,
}