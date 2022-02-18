import {PlainData, Position, Step, Target} from "@pagenote/shared/lib/@types/Types";
import React, {useCallback, useEffect, useRef, useState} from "react";
import ReactDom from "react-dom";
import ActionBars from "../action/ActionBars";
import {isMoble} from "../utils/device";
import debounce from "lodash/debounce";
import throttle from 'lodash/throttle';
import noop from 'lodash/noop'
import {prepareSelectionTarget} from "../utils";
import {IOption} from "../types/Option";
import root from 'react-shadow';
import Lights from "./Lights";
import {WebPageItem} from "../types/WebPageItem";

interface Props {
    plainData?: PlainData,
    options?: IOption,
    onChange: (data:PlainData)=>void
}

const render = function (plainData:PlainData,onChange: (data: PlainData) => void) {
    const tagRoot = 'pagenote-root';
    let root = document.querySelector(tagRoot);
    if(!root){
       root = document.createElement(tagRoot)
       document.body.appendChild(root);
    }
    ReactDom.render(<PageNoteView plainData={plainData} onChange={onChange}/>,root)
}

interface Runtime {
    startPosition?: Position,
    lastPosition?: Position
    lastEvent?: Event
    lastKeydownTime?: number
    isPressing?: boolean,
}

const DEBOUNCE_TIME = 100;

function PageNoteView({plainData,onChange=noop}:Props) {
    const option = {
        brushes: [
            {
                bg:'#cc7c7c',shortcut:'', label:'', level:1
            },
            {
                bg:'#999999',shortcut:'', label:'', level:1
            },
            {
                bg:'#55cdff',shortcut:'', label:'', level:1
            },
            {
                bg:'#693131',shortcut:'', label:'', level:1
            },
            {
                bg:'#4accff',shortcut:'', label:'', level:1
            },
        ]
    }
    const [data,setData] = useState<PlainData>(function () {
        if(plainData){
            return plainData
        }else{
            const webPage = new WebPageItem();
            return webPage.data.plainData
        }
    });
    const [runtime,setRuntime] = useState(function () {
        return {
            startPosition: {},
            lastPosition: {},
            lastEvent: null,
            lastKeydownTime: 0,
            isPressing: false,
        } as Runtime
    })
    const [target,setTarget] = useState(function () {
        return null as Target
    })
    const [scrollY,setScrollY] = useState(0)
    const rootAside = useRef(null)
    useEffect(function () {
        // mousedown
        const onUp = debounce(function (e:MouseEvent & KeyboardEvent) {
            if(e.target === rootAside.current){
                return;
            }
            const data = {
                lastEvent: e,
                isPressing: false,
                lastPosition: {
                    x: e.x,
                    y: e.y,
                },
            }
            setRuntimeData(data)
            console.log('up')
        },DEBOUNCE_TIME)
        const upEvent = isMoble?'touchend' :'mouseup';
        document.addEventListener(upEvent,onUp,{capture:true})

        // mouseup
        const downEvent = isMoble?'touchstart' :'mousedown';
        const onDown =  (e:MouseEvent)=>{
            if(e.target === rootAside.current){
                return;
            }
            const data = {
                isPressing: true,
                lastEvent: e,
                startPosition: {
                    x: e.x,
                    y: e.y
                },
                lastKeydownTime: Date.now()
            }
            setRuntimeData(data)
            console.log('down',e)
        }
        document.addEventListener(downEvent,onDown,{capture:true})

        // dragend
        const dragEndEvent = 'dragend';
        const onDragEnd = ()=>{
            setRuntimeData({
                isPressing: false,
            })
        }
        document.addEventListener(dragEndEvent,onDragEnd,{capture:true})

        // scroll
        const scrollEvent = 'scroll';
        const onScroll = throttle(function () {
            setScrollY(window.scrollY)
        },5)
        window.addEventListener(scrollEvent,onScroll)

        return function remove() {
            document.removeEventListener(upEvent,onUp,{capture: true})
            document.removeEventListener(downEvent,onDown,{capture: true})
            document.removeEventListener(dragEndEvent,onDragEnd,{capture:true})
        }
    },[runtime])

    useEffect(function () {
        const target = prepareSelectionTarget(true, [runtime.startPosition,runtime.lastPosition])
        setTarget(target)
    },[runtime.isPressing,scrollY])

    useEffect(function () {
        onChange(data)
    },[data])

    useEffect(function () {

    })


    const setRuntimeData = useCallback((data: Partial<Runtime>)=> {
        const newRuntime = {
            ...runtime,
            ...data,
        }
        setRuntime(newRuntime)
    },[runtime])

    function recordNew(info: {bg: string}) {
        console.log('record new',target)
        const steps = data.steps;
        steps.push({
            ...target,
            bg: info.bg,
        });
        setData({
            ...data,
            steps: steps,
        })
        setTarget(null);
    }

    function remove(index:number) {
        const steps = data.steps;
        steps.splice(index,1);
        setData({
            ...data,
            steps: steps,
        })
    }


    const position = {
        x: target?.clientX,
        y: target?.clientY,
    }
    return(
        <root.aside ref={rootAside}>
            <ActionBars position={position} showButton={true}  brushes={option.brushes} recordNew={recordNew} target={target}/>
            <Lights lights={data.steps} remove={remove} />
        </root.aside>
    )
}

export {
    render
};
