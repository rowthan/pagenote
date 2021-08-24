import renderAnnotationMenu from "../documents/annotationMenus";
import {emptyChildren, keepLastIndex} from "../utils/document";
import {AnnotationStatus, LightStatus} from "./const";
import {wrapperAnnotationAttr} from "../utils/light";
import {throttle} from "../utils/index";
// @ts-ignore
import Draggable from 'draggable';

function initAnnotation() {
    const step = this;
    const renderMethod = step.options.renderAnnotation;
    if(renderMethod && typeof renderMethod!=="function"){
        return;
    }

    const {bg,x,y,tip,lightId} = step.data;
    const element = document.createElement('pagenote-annotation');// 根容器
    element.dataset.lightid = lightId;
    const customInner = document.createElement('pagenote-annotation-inner') // 使用方自定义容器
    const actionArray = document.createElement('pagenote-annotation-menus') // 拖拽容器
    // actionArray.innerHTML = `<pagenote-block aria-controls="light-ref">${text}</pagenote-block>`

    const appends = renderMethod(step.data,step);

    renderAnnotationMenu(actionArray,{
        light:step,
        colors: step.options.colors,
        moreActions: appends[1],
    })
    customInner.appendChild(actionArray);

    const editor = document.createElement('pagenote-block');
    editor.dataset.role = 'annotation-editor';
    editor.contentEditable = 'true';
    editor.innerHTML = tip;
    editor.onmouseleave = editor.onblur = function () {
        step.runtime.editing = false;
    }
    editor.ondblclick = function () {
        step.runtime.editing = true;
    }
    editor.oninput = throttle(function () {
        step.data.tip = editor.innerText ? editor.innerHTML : '';
    },400)
    customInner.appendChild(editor);

    const customContent = document.createElement('pagenote-block');
    customContent.dataset.role = 'custom-content';
    customInner.appendChild(customContent);

    function renderContent() {
        emptyChildren(customContent);
        const appends = renderMethod(step.data,step);
        if (appends[0]){
            customContent.appendChild(appends[0]);
        }
    }

    renderContent();

    element.appendChild(customInner);

    let timer: NodeJS.Timeout = null;
    element.onmouseenter = ()=> {
        clearTimeout(timer);
        step.runtime.isFocusAnnotation = true;
    }
    element.onmouseleave =  ()=> {
        timer = setTimeout(function () {
            step.runtime.isFocusAnnotation = false;
            step.runtime.editing = false;
        },200)
    }

    const options = {
        grid: 1,
        setPosition: true,
        setCursor: false,
        handle: actionArray,
        onDragEnd: function(result: any, x: any, y: any){
            step.data.x = x;
            step.data.y = y;
        }
    };
    // @ts-ignore
    const drag = new Draggable (element, options).set(x,y);

    const container = document.querySelector('pagenote-annotations');
    container.appendChild(element);

    element.remove = function () {
        element.parentNode.removeChild(element);
    }

    this.runtime.relatedAnnotationNode = element;
    this.runtime.annotationDrag = drag;

    function checkShowAnnotation() {
        const hasTip = !!step.data.tip;
        return (step.data.lightStatus===LightStatus.LIGHT && hasTip)
            || step.runtime.isFocusTag
            || step.runtime.isFocusAnnotation
            || (step.data.annotationStatus === AnnotationStatus.SHOW && hasTip);
    }

    wrapperAnnotationAttr(customInner,bg,checkShowAnnotation(),step.data.tip)
    this.addListener(function () {
        renderContent();
        wrapperAnnotationAttr(customInner,step.data.bg,checkShowAnnotation(),step.data.tip);
        editor.contentEditable = step.runtime.editing ? 'true' : 'false'
        if(step.runtime.editing){
            editor.focus();
            keepLastIndex(editor);
        } else{
            editor.blur();
        }
    },true,'annotation')
    this.addListener(function () {
        renderContent();
        wrapperAnnotationAttr(customInner,step.data.bg,checkShowAnnotation(),step.data.tip);
    },false,'annotation')
}

export default initAnnotation