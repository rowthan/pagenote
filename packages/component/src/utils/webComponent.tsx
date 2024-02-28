import React, {PropsWithChildren} from "react";

export function isUsedAsWebComponent(props: PropsWithChildren<any>) {
    return props.container && props.container.nodeName === '#document-fragment'
}

/**获取用于节点渲染的 children*/ 
export function getChildren(props: PropsWithChildren<any>) {
    return isUsedAsWebComponent(props) ? (
        ((props.container.host?.innerText || props.container.host?.innerHTML) ? <slot></slot>: null)
    ) : props.children;
}


export function getComponentInnerText(props: PropsWithChildren<any>) {
    return isUsedAsWebComponent(props)? props.container.host.textContent : props.children?.toString();
}

export function getHostRoot(props: PropsWithChildren<any>){
    return isUsedAsWebComponent(props) ? props.container.host : null
}




export function namedNodeMapToObject(namedNodeMap: NamedNodeMap) {
    const obj: Record<string, any> = {};

    for (let i = 0; i < namedNodeMap.length; i++) {
        const attribute = namedNodeMap[i];
        obj[attribute.name] = attribute.value;
    }

    return obj;
}
