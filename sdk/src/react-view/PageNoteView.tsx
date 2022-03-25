import { PlainData, Target } from "@pagenote/shared/lib/@types/data";
import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactDom from "react-dom";
import ActionBars from "../action/ActionBars";
import { isMoble } from "../utils/device";
import debounce from "lodash/debounce";
import throttle from "lodash/throttle";
import { prepareSelectionTarget } from "../utils";
import "./pagenote.global.scss";
import root from "react-shadow";
import Lights from "./Lights";
import { WebPageItem } from "@pagenote/shared/lib/models/WebPageItem";
import SelectionUtil from "../utils/selectionUtil";
import { PageNoteProps, Runtime } from "./types";
import { $emit, $off, $on, EVENT_NAME } from "./emit";

function getRootElement():Element {
    const tagRoot = 'pagenote-root';
    let root = document.querySelector(tagRoot);
    if(!root){
        root = document.createElement(tagRoot)
        document.body.appendChild(root);
    }
    return root
}

const render = function (options:PageNoteProps) {
    ReactDom.render(<PageNoteView options={options}/>,getRootElement())
}

const DEBOUNCE_TIME = 100;

function PageNoteView({ options }:{options:PageNoteProps}) {
    const [data,setData] = useState<PlainData>(function () {
        const webPage = new WebPageItem();
        return webPage.data.plainData
    });
    const [runtime,setRuntime] = useState<Runtime>(function () {
        return {
            startPosition: {
                x: 0,
                y: 0
            },
            lastPosition: {
                x: 0,
                y: 0,
            },
            lastEvent: null,
            lastKeydownTime: 0,
            isPressing: false,
        }
    })
    const [target,setTarget] = useState<Target>(function () {
        return null
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
        $emit(EVENT_NAME.DATA_CHANGE,data)
    },[data])

    // 数据与 外部 JS 打通
    useEffect(()=>{
        const changeData = function(data:PlainData) {
            // TODO schema 校验
            setData(data)
        }
        $on(EVENT_NAME.TRIGGER_CHANGE_DATA,changeData)
        return function() {
            $off(EVENT_NAME.TRIGGER_CHANGE_DATA,changeData)
        }
    },[])

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
        SelectionUtil.removeAllRanges()
    }

    function remove(index:number) {
        const steps = data.steps;
        steps.splice(index,1);
        save({
            steps: steps
        })
    }

    function save(changeData:Partial<PlainData>={}) {
        const newData = {
            ...data,
            ...changeData
        }
        setData(newData)
        $emit(EVENT_NAME.DATA_CHANGE,newData)
    }


    const position = {
        x: target?.clientX,
        y: target?.clientY,
    }

    return(
        <root.aside ref={rootAside}>
            <ActionBars position={position} showButton={true} brushes={options.brushes} recordNew={recordNew} target={target}/>
            <Lights lights={data.steps} remove={remove} save={save} />
        </root.aside>
    )
}

export {
    render
};
