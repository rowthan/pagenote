import React, {useEffect, Fragment, useState} from "react";
import {Step} from "@pagenote/shared/lib/@types/Types";
import {highlightKeywordInElement, LightElement} from "../utils/highlight";
import {getPagenoteRoot, whats} from "../utils";
import md5 from "md5";
import ReactDOM from "react-dom";
import root from 'react-shadow';
// @ts-ignore
import styles from './lightItem.less';

interface Props {
    light: Step,
    remove:()=>void
}

export default function LightItem({light,remove}:Props) {
    const [targets, setTargets] = useState<LightElement[]>([]);
    useEffect(function () {
        const element = whats.getTarget(light.id)
        if(element){
            const {text,pre,suffix} = light;
            highlightElement(element,text,pre,suffix)
        }

        // 还原节点
        return function () {
            const relatedNodes: NodeListOf<HTMLElement> = document.querySelectorAll(`light[data-highlight=${light.id}]`)
            for(let i=0; i<relatedNodes.length; i++){
                const tempNode = relatedNodes[i];
                const textNode = document.createTextNode(light.text)
                tempNode.outerHTML = light.text;
            }
        }
    },[light])


    function highlightElement(target: HTMLElement,text:string,pre?:string,suffix?:string) {
        let index = 0;
        const result = highlightKeywordInElement(target,text||'',pre||'',suffix||'',null,function(text){
            const lightElement: LightElement = document.createElement('light');
            lightElement.dataset.highlight = md5(text);
            lightElement.dataset.lightindex = String(index);
            lightElement._originText = text;
            // lightElement.dataset.lightid = md5(light.id);
            index++
            return lightElement;
        },[]);

        setTargets(result.lightsElement)
    }

    return <>
        {
            targets.map((target,index)=>(
                <Fragment key={index}>
                    {
                        ReactDOM.createPortal(
                            // @ts-ignore
                            <span className='light' style={{'--bgcolor':light.bg}}>
                                <style>{styles}</style>
                                {target._originText}
                            </span>,
                            target,
                        )
                    }
                </Fragment>
            ))
        }
    </>
}
