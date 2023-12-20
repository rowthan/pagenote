import React, {PropsWithChildren} from "react";

export function isUsedAsWebComponent(props: PropsWithChildren<any>) {
    return props.container && props.container.nodeName === '#document-fragment'
}

export function getChildren(props: PropsWithChildren<any>) {
    return isUsedAsWebComponent(props) ? <slot></slot> : props.children;
}

export function getComponentInnerText(props: PropsWithChildren<any>) {
    return isUsedAsWebComponent(props)? props.container.host.textContent : props.children?.toString();
}


export function applyCss(css: string,applyRoot?: Document) {
    if(!css){
        return
    }

    if(applyRoot){
        const sheet = new CSSStyleSheet();
        sheet.replaceSync(css);
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



export function namedNodeMapToObject(namedNodeMap: NamedNodeMap) {
    const obj: Record<string, any> = {};

    for (let i = 0; i < namedNodeMap.length; i++) {
        const attribute = namedNodeMap[i];
        obj[attribute.name] = attribute.value;
    }

    return obj;
}
