import React, {useEffect, useRef, useState} from "react";
import {Step} from "../../../shared/src/@types/Types";
import {highlightKeywordInElement, LightElement} from "../utils/highlight";
import {getPagenoteRoot, whats} from "../utils";
import md5 from "md5";
import ReactDOM from "react-dom";
// @ts-ignore
import styles from './light.less';

interface Props {
    light: Step,
    remove:()=>void
}

export default function LightItem({light,remove}:Props) {
    const [target, setTarget] = useState(null);
    useEffect(function () {
        const element = whats.getTarget(light.id)
        if(element){
            const {text,pre,suffix} = light;
            highlightElement(element,text,pre,suffix)
        }

        return function () {
            const relatedNodes: NodeListOf<HTMLElement> = document.querySelectorAll(`light[data-highlight=${light.id}]`)
            for(let i=0; i<relatedNodes.length; i++){
                const tempNode = relatedNodes[i];
                const textNode = document.createTextNode(light.text)
                tempNode.outerHTML = light.text;
            }
        }
    },[])


    function highlightElement(target: HTMLElement,text:string,pre?:string,suffix?:string) {
        let index = 0;
        debugger
        highlightKeywordInElement(target,text||'',pre||'',suffix||'',null,function(text){
            const lightElement: LightElement = document.createElement('light');
            lightElement.dataset.highlight = md5(text);
            lightElement.dataset.lightindex = String(index);
            // lightElement.dataset.lightid = md5(light.id);
            index++
            setTarget(lightElement)
            return lightElement;
        },[]);
    }

    return target ? ReactDOM.createPortal(
        // @ts-ignore
        <span className='light' style={{'--bgcolor':light.bg}}>
            <style>{styles}</style>
            {light.text}
        </span>,
        target,
    ): <div></div>
}
