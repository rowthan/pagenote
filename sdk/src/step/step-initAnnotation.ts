import renderAnnotationMenu from "../documents/annotationMenus";
import {emptyChildren} from "../utils/document";
import {LightStatus} from "./const";
import {wrapperAnnotationAttr} from "../utils/light";
// @ts-ignore
import Draggable from 'draggable';

function initAnnotation() {
    const step = this;
    const renderMethod = step.options.renderAnnotation;
    if(typeof renderMethod!=="function"){
        return;
    }

    const {bg,x,y,text} = step.data;
    const element = document.createElement('pagenote-annotation');// 根容器
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

    const customContent = document.createElement('pagenote-block');
    customContent.dataset.role = 'custom-content';
    customInner.appendChild(customContent);

    function renderContent() {
        emptyChildren(customContent);
        const appends = renderMethod(step.data,step);
        customContent.appendChild(appends[0]);
    }

    customContent.appendChild(appends[0]);

    element.appendChild(customInner);

    // TODO 统一优化
    element.onmouseenter = ()=> {
        clearTimeout(step.runtime.focusTimer)
        step.changeData({
            isFocusAnnotation: true
        },true)
    }
    element.onmouseleave =  ()=> {
        step.changeData({
            isFocusAnnotation: false
        },true)
    }

    const options = {
        grid: 4,
        setPosition: true,
        setCursor: false,
        handle: actionArray,
        onDragEnd: function(result: any, x: any, y: any){
            step.changeData({
                x,y,
            })
        }
    };
    // @ts-ignore
    new Draggable (element, options).set(x,y);
    const container = document.querySelector('pagenote-annotations');
    container.appendChild(element);

    element.remove = function () {
        element.parentNode.removeChild(element);
    }

    this.runtime.relatedAnnotationNode = element;

    function checkShowAnnotation() {
        return step.data.lightStatus===LightStatus.LIGHT || step.runtime.isFocusTag || step.runtime.isFocusAnnotation;
    }

    wrapperAnnotationAttr(customInner,bg,checkShowAnnotation())
    this.addListener(['annotation','isFocusTag'],function (data: { bg: any; }, change: any) {
        renderContent();
        wrapperAnnotationAttr(customInner,data.bg,checkShowAnnotation());
    })
    // @ts-ignore
    element.toggleShow = wrapperAnnotationAttr;
}

export default initAnnotation