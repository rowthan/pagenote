import renderAnnotationMenu from "../documents/annotationMenus";
import { emptyChildren, keepLastIndex } from "../utils/document";
import { AnnotationStatus } from "./const";
import { wrapperAnnotationAttr } from "../utils/light";
import { throttle } from "../utils/index";
// @ts-ignore
import Draggable from 'draggable';
function initAnnotation() {
    var step = this;
    var renderMethod = step.options.renderAnnotation;
    if (renderMethod && typeof renderMethod !== "function") {
        return;
    }
    var _a = step.data, bg = _a.bg, x = _a.x, y = _a.y, tip = _a.tip, lightId = _a.lightId, text = _a.text;
    var element = document.createElement('pagenote-annotation'); // 根容器
    element.dataset.lightid = lightId;
    var customInner = document.createElement('pagenote-annotation-inner'); // 使用方自定义容器
    var header = document.createElement('pagenote-annotation-header');
    header.onclick = function () {
        step.lighting();
    };
    var actionArray = document.createElement('pagenote-annotation-menus');
    // actionArray.innerHTML = `<pagenote-block aria-controls="light-ref">${text}</pagenote-block>`
    var appends = renderMethod(step.data, step);
    renderAnnotationMenu(actionArray, {
        light: step,
        colors: step.options.colors,
        moreActions: appends[1] || [],
    });
    header.appendChild(actionArray);
    var ref = document.createElement('pagenote-annotation-ref');
    ref.innerText = text;
    header.appendChild(ref);
    customInner.appendChild(header);
    var editor = document.createElement('pagenote-block');
    editor.dataset.role = 'annotation-editor';
    editor.contentEditable = 'true';
    editor.innerHTML = tip;
    editor.onmouseleave = editor.onblur = function () {
        step.runtime.editing = false;
    };
    editor.ondblclick = function () {
        step.runtime.editing = true;
    };
    editor.onfocus = function (e) {
        step.runtime.editing = true;
    };
    editor.onblur = function () {
        step.runtime.editing = false;
    };
    editor.addEventListener('keyup', function (e) {
        e.stopPropagation();
    }, { capture: true });
    editor.oninput = throttle(function () {
        var content = editor.innerText.trim() ? editor.innerHTML : '';
        step.data.tip = content;
    }, 400);
    customInner.appendChild(editor);
    var customContent = document.createElement('pagenote-block');
    customContent.dataset.role = 'custom-content';
    customInner.appendChild(customContent);
    function renderContent() {
        emptyChildren(customContent);
        var appends = renderMethod(step.data, step);
        if (appends[0]) {
            customContent.appendChild(appends[0]);
        }
    }
    renderContent();
    element.appendChild(customInner);
    var outTimer = null;
    element.onmouseenter = function () {
        clearTimeout(outTimer);
        step.runtime.isFocusAnnotation = true;
    };
    element.onmouseleave = function () {
        outTimer = setTimeout(function () {
            step.runtime.isFocusAnnotation = false;
            step.runtime.editing = false;
        }, 0);
    };
    var options = {
        grid: 1,
        setPosition: true,
        setCursor: false,
        handle: header,
        limit: {
            x: [10, window.innerWidth - 250 - 10],
            y: [10, Math.max(document.documentElement.scrollHeight, window.innerHeight)]
        },
        onDragEnd: function (result, x, y) {
            step.data.x = x;
            step.data.y = y;
        },
    };
    // @ts-ignore
    var drag = new Draggable(element, options).set(x, y);
    var container = document.querySelector('pagenote-annotations');
    container.appendChild(element);
    element.remove = function () {
        element.parentNode.removeChild(element);
    };
    this.runtime.relatedAnnotationNode = element;
    this.runtime.annotationDrag = drag;
    function checkShowAnnotation() {
        var hasTip = !!step.data.tip;
        return step.runtime.editing
            || step.runtime.isFocusTag
            || step.runtime.isFocusAnnotation
            || (step.data.annotationStatus === AnnotationStatus.SHOW && hasTip);
    }
    function checkShowRef() {
        var showMenu = step.runtime.editing || step.runtime.isFocusAnnotation;
        return showMenu ? 'menu' : ''; //((step.runtime.isFocusTag?'light':''))
    }
    function showTipStyle() {
        return step.data.tip || step.runtime.editing;
    }
    wrapperAnnotationAttr(customInner, bg, checkShowAnnotation(), showTipStyle(), checkShowRef(), step.runtime.lighting);
    this.addListener(function () {
        renderContent();
        wrapperAnnotationAttr(customInner, step.data.bg, checkShowAnnotation(), showTipStyle(), checkShowRef(), step.runtime.lighting);
        // editor.contentEditable = step.runtime.editing ? 'true' : 'false'
        if (step.runtime.editing) {
            editor.focus();
            keepLastIndex(editor);
        }
        else {
            editor.blur();
        }
    }, true, 'annotation');
    this.addListener(function () {
        renderContent();
        wrapperAnnotationAttr(customInner, step.data.bg, checkShowAnnotation(), showTipStyle(), checkShowRef(), step.runtime.lighting);
    }, false, 'annotation');
}
export default initAnnotation;
//# sourceMappingURL=step-initAnnotation.js.map