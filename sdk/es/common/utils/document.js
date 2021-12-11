function getWebIcon() {
    var iconEle = document.querySelector('link[rel~=icon]');
    // @ts-ignore
    return iconEle ? iconEle.href : '';
}
function getWebTitle() {
    var title = document.querySelector('title');
    return title ? title.innerText : '';
}
function getWebDescription() {
    var title = document.querySelector('meta[name=description]');
    return title ? title.getAttribute('content') : '';
}
export { getWebIcon, getWebTitle, getWebDescription, };
//# sourceMappingURL=document.js.map