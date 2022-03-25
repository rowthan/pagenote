import React, {Fragment, useEffect, useState} from "react";
import {AnnotationStatus, Step} from "@pagenote/shared/lib/@types/data";
import {highlightKeywordInElement, LightElement} from "../utils/highlight";
import {whats} from "../utils";
import md5 from "md5";
import ReactDOM from "react-dom";
import root from 'react-shadow/styled-components';
// @ts-ignore
import styles from './lightItem.less';
// @ts-ignore
import editorStyles from './editor.less'
import Tip from "../component/tip/Tip";
import i18n from "../locale/i18n";
// @ts-ignore
import PinIcon from "../assets/images/pin.svg";
// @ts-ignore
import CopyIcon from "../assets/images/copy.svg";
// @ts-ignore
import NoteIcon from "../assets/images/note.svg";
// @ts-ignore
import DeleteIcon from "../assets/images/delete.svg";
import Colors from "../component/Colors";
import Draggable, {DraggableData, DraggableEvent} from 'react-draggable'
import Editor from '../component/Editor'
import useEventListener from "../hooks/useEventListener";
import debounce from "lodash/debounce";

type Light = Step & {
    _relatedElements?: LightElement[],
}
interface Props {
    light: Light,
    remove:()=>void
    save:()=>void
}

export default function LightItem({light,remove,save}:Props) {
    const [targets, setTargets] = useState<LightElement[]>([]);
    // const targets = useRef<LightElement[]>([]);
    const [focused,setFocus] = useState<AnnotationStatus>(light.annotationStatus);
    const lightId = md5(light.id+light.text)
    useEffect(function () {
        const element = whats.getTarget(light.id)
        let elements:LightElement[] = [];
        if(element){
            const {text,pre,suffix} = light;
            elements = highlightElement(element,text,pre,suffix);
            // TODO 如果没有找到元素，渲染至 HTML 节点上，使用 fixed 定位，可使用 shake shake查找元素
            setTargets(elements)
            light._relatedElements = elements || []
        }

        // 还原节点
        return function () {
            for(let i=0; i<elements.length; i++){
                const tempNode = elements[i];
                const textNode = document.createTextNode(light.text)
                tempNode.outerHTML = tempNode._originText;
            }
        }
    },[light])


    function highlightElement(target: HTMLElement,text:string,pre?:string,suffix?:string):LightElement[] {
        let index = 0;
        const result = highlightKeywordInElement(target,text||'',pre||'',suffix||'',null,function(text){
            const lightElement: LightElement = document.createElement('light');
            lightElement.dataset.highlight = lightId;
            lightElement.dataset.lightindex = String(index);
            // @ts-ignore
            lightElement.style = '--bgcolor:'+light.bg;
            lightElement._originText = text;
            // lightElement.dataset.lightid = md5(light.id);
            index++
            return lightElement;
        },[]);

        return result.lightsElement
    }

    function onEnter() {
        if(light.annotationStatus!==AnnotationStatus.fixed){
            setFocus(AnnotationStatus.SHOW)
        }
    }

    function togglePin() {
        const state = light.annotationStatus === AnnotationStatus.SHOW ? AnnotationStatus.HIDE : AnnotationStatus.SHOW;
        light.annotationStatus = state;
        save()
    }


    return <>
        {
            targets.map((target,index)=>(
                <Fragment key={index}>
                    {
                        ReactDOM.createPortal(
                            <Fragment>
                                <span onMouseEnter={onEnter} onClick={togglePin}>
                                    {target._originText}
                                </span>
                                {
                                    index===0 && <ActionMenu save={save} light={light} state={focused} remove={remove} changeState={setFocus} />
                                }
                            </Fragment>,
                            target,
                        )
                    }
                </Fragment>
            ))
        }
    </>
}

interface ActionMenuProps {
    changeState: (state: AnnotationStatus)=>void,
    remove: ()=>void,
    light: Light,
    save: ()=>void
    state: AnnotationStatus,
}

const ActionMenu = function ({light,remove,save,state}:ActionMenuProps) {
    const pin = false;
    const currentColor = light.bg;
    const copied = true;
    const colors = ['red','blue']

    const [position,setPosition] = useState(function () {
        return{
            top: 0,
            left: 0,
        }
    })


    function onchangeColor() {
        
    }


    function handleStart() {

    }

    function handleDrag() {

    }

    function handleStop(e:DraggableEvent,data:DraggableData) {
        console.log(data)
        light.offsetX = data.x;
        light.offsetY = data.y;
        setTimeout(function () {
            save()
        },100)
    }

    function computePosition() {
        const relatedElement = light._relatedElements[0];
        if(relatedElement){
            const rect = relatedElement.getBoundingClientRect();
            setPosition({
                left: rect.left,
                top: rect.top,
            })
        }
    }


    useEventListener<MouseEvent>('scroll',debounce(function (e) {
        computePosition()
    },15))


    useEffect(function () {
        computePosition()
    },[])

    const show = [AnnotationStatus.SHOW,AnnotationStatus.fixed].includes(state)

    return(
        show &&
        <root.aside>
            <style>
                {styles}
                {editorStyles}
            </style>
            <Draggable
                handle=".header"
                defaultPosition={{x: light.offsetX, y: light.offsetY}}
                position={null}
                grid={[2, 2]}
                scale={0.9}
                bounds={ {left: -400,top: -400, right:1600,bottom:200} }
                onStart={handleStart}
                onDrag={handleDrag}
                onStop={handleStop}>
                <aside className='annotation' style={{top: position.top+'px',left: position.left+'px'}}>
                    <div className='header'>
                        <div className='menus' onClick={(e)=>{e.stopPropagation()}}>
                            <Tip placement='top' inner={true} message={(!pin?i18n.t('pin'):i18n.t('un_pin'))+'[p]'}>
                            <span className='pagenote-icon' aria-controls='pin' data-status={pin?'pin':''}>
                                <PinIcon fill={pin ? currentColor : '#fff'} />
                            </span>
                            </Tip>
                            <Tip placement="bottom" inner={true} message={i18n.t(copied?'copied':'copy_keyword_annotation')+'[c]'}>
                            <span className='pagenote-icon'>
                                <CopyIcon fill={currentColor}  width={20} height={20}  />
                            </span>
                            </Tip>
                            <Tip placement="top" inner={true} message={i18n.t('comment')+'[m]'}>
                            <span className='pagenote-icon'>
                                <NoteIcon fill={currentColor} width={20} height={20}/>
                            </span>
                            </Tip>
                            <Tip placement="top" inner={true} message={i18n.t('change_color')}>
                                <Colors colors={colors} current={currentColor} selectColor={onchangeColor}></Colors>
                            </Tip>
                            <Tip placement="top" inner={true} message={i18n.t('remove_marks')}>
                            <span className='pagenote-icon' aria-controls="delete-icon">
                                <DeleteIcon  width={20} height={20} fill={currentColor}  onClick={remove} />
                            </span>
                            </Tip>
                        </div>
                        <div className='ref'>
                            {light.text}
                        </div>
                    </div>
                    <div className="editor">
                        <Editor tip={light.tip}/>
                    </div>
                </aside>
            </Draggable>
        </root.aside>
    )
}
