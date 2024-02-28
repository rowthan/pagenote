export function applyCss(css: string,applyRoot?: Document | HTMLElement) {
    if(!css){
        return
    }

    if(applyRoot){
        const sheet = new CSSStyleSheet();
        sheet.replaceSync(css);
        //@ts-ignore
        applyRoot.adoptedStyleSheets.push(sheet)
    }else{
        // 创建一个 style 元素
        const styleElement = document.createElement('style');
        // 将样式字符串赋值给 style 元素的 textContent
        styleElement.textContent = css;
        // 将 style 元素添加到页面的 head 元素中
        (document.head || document.body || document).appendChild(styleElement);
    }
}