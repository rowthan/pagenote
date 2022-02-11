import renderAnnotationMenu from "../documents/annotationMenus";
import {emptyChildren, keepLastIndex} from "../utils/document";
import {AnnotationStatus,} from '@pagenote/shared/lib/@types/Types'
import {wrapperAnnotationAttr} from "../utils/light";
import {throttle} from "../utils";
// @ts-ignore
import Draggable from 'draggable';
import IStep from "../pagenote-step";

function initAnnotation() {
    const step: IStep = this;

    const {bg,x,y,tip,lightId,text} = step.data;
    const element = document.createElement('pagenote-annotation');// 根容器
    element.dataset.lightid = lightId;
    const customInner = document.createElement('pagenote-annotation-inner') // 使用方自定义容器
    const header = document.createElement('pagenote-annotation-header');
    header.onclick = function () {
        step.lighting()
    };

    const actionArray = document.createElement('pagenote-annotation-menus')
    // actionArray.innerHTML = `<pagenote-block aria-controls="light-ref">${text}</pagenote-block>`


    renderAnnotationMenu(actionArray,{
        light:step,
        colors: step.options.colors,
        moreActions: [],
    })

    header.appendChild(actionArray);

    const ref = document.createElement('pagenote-annotation-ref');
    ref.innerText = text;
    header.appendChild(ref);

    customInner.appendChild(header);

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
    editor.onfocus =  function (e) {
        step.runtime.editing = true;
    }
    editor.onblur = function () {
        step.runtime.editing = false;
    }
    editor.addEventListener('keyup',function (e) {
        e.stopPropagation();
    },{capture:true})
    editor.oninput = throttle(function () {
        const content = editor.innerText.trim() ? editor.innerHTML : ''
        step.data.tip = content;
    },400)
    customInner.appendChild(editor);

    const customContent = document.createElement('pagenote-block');
    customContent.dataset.role = 'custom-content';
    customInner.appendChild(customContent);

    function renderContent() {
        emptyChildren(customContent);
    }

    renderContent();

    element.appendChild(customInner);

    let outTimer: NodeJS.Timeout = null;
    element.onmouseenter = ()=> {
        clearTimeout(outTimer);
        step.runtime.isFocusAnnotation = true;
    }
    element.onmouseleave = function () {
        outTimer = setTimeout(()=>{
            step.runtime.isFocusAnnotation = false;
            step.runtime.editing = false;
        },0)
    }

    const options = {
        grid: 1,
        setPosition: true,
        setCursor: false,
        handle: header,
        limit: {
          x: [10,window.innerWidth-250-10],
          y: [10,Math.max(document.documentElement.scrollHeight,window.innerHeight)]
        },
        onDragEnd: function(result: any, x: any, y: any){
            step.data.x = x;
            step.data.y = y;
        },
    };
    // @ts-ignore
    const drag = new Draggable (element, options).set(x,y);

    const container = step.runtime.relatedNode[0];
    container.appendChild(element);

    element.remove = function () {
        element.parentNode.removeChild(element);
    }

    this.runtime.relatedAnnotationNode = element;
    this.runtime.annotationDrag = drag;

    function checkShowAnnotation() {
        const hasTip = !!step.data.tip;
        return step.runtime.editing
            || step.runtime.isFocusTag
            || step.runtime.isFocusAnnotation
            || (step.data.annotationStatus === AnnotationStatus.SHOW && hasTip);
    }

    function checkShowRef(){
        const showMenu = step.runtime.editing || step.runtime.isFocusAnnotation;
        return showMenu?'menu': ''//((step.runtime.isFocusTag?'light':''))
    }

    function showTipStyle(){
        return step.data.tip || step.runtime.editing;
    }

    wrapperAnnotationAttr(customInner,bg,checkShowAnnotation(),showTipStyle(),checkShowRef(),step.runtime.lighting)
    this.addListener(function () {
        renderContent();
        wrapperAnnotationAttr(customInner,step.data.bg,checkShowAnnotation(),showTipStyle(),checkShowRef(),step.runtime.lighting);
        // editor.contentEditable = step.runtime.editing ? 'true' : 'false'
        if(step.runtime.editing){
            editor.focus();
            keepLastIndex(editor);
        } else{
            editor.blur();
        }
    },true,'annotation')
    this.addListener(function () {
        renderContent();
        wrapperAnnotationAttr(customInner,step.data.bg,checkShowAnnotation(),showTipStyle(),checkShowRef(),step.runtime.lighting);
    },false,'annotation')
}

export default initAnnotation
