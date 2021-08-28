import {highlightKeywordInElement, removeElementHighlight} from "../utils/highlight";
import {wrapperLightAttr} from "../utils/light";
import toggleLightMenu from "../light-menu";
import {whats} from "../utils/index";
import {AnnotationStatus, LightStatus} from "./const";

const options = {

}
const io = new IntersectionObserver(function (entries) {
    entries.forEach((item)=>{
        // @ts-ignore-next-line
        if(item.target && item.target._light){
            // @ts-ignore-next-line
            item.target._light.runtime.isVisible = item.intersectionRatio>0
        }
    })
}, options)

function initKeywordTags(){
    const step = this;
    const {bg,id,text,pre,suffix,lightId,lightStatus} = step.data;

    function highlightElement(target: HTMLElement) {
        // 元素内的所有内容都被高亮时 直接高亮元素，不再使用 highlight 正则匹配
        // if(target.innerText.trim() === text){
        //     debugger
        // }

        // 查找文字、高亮元素
        let index = 0;
        const result = highlightKeywordInElement(target,text,pre,suffix,null,function(text: string, children: { parentNode: { tagName: string; }; cloneNode: () => any; }){
            const lightElement = document.createElement('light');
            lightElement.dataset.highlight = lightId;
            lightElement.dataset.lightindex = String(index);
            index++

            if(text){
                lightElement.textContent = text;
            }
            if(children){
                // 已高亮过不再高亮
                if(children && children.parentNode.tagName==='LIGHT'){
                    return children;
                }
                lightElement.dataset.type='img'
                lightElement.appendChild(children.cloneNode());
            }



            lightElement.onclick = function (e) {
                const {data} = step;
                const nextLightStatus = data.lightStatus + 1;
                toggleLightMenu(true,step)
                step.data.lightStatus = nextLightStatus>2?0:nextLightStatus;
                switch (step.data.lightStatus){
                    case LightStatus.UN_LIGHT:
                        step.data.annotationStatus = AnnotationStatus.HIDE
                        break;
                    case LightStatus.LIGHT:
                        step.data.annotationStatus = AnnotationStatus.SHOW;
                        break;
                }
                // step.data.annotationStatus = nextLightStatus === LightStatus.LIGHT ? AnnotationStatus.SHOW : AnnotationStatus.HIDE
                e.stopPropagation();
            };

            lightElement.ondblclick = function(e){
                e.stopPropagation();
                step.openEditor();
            }

            lightElement.onmouseenter = ()=> {
                clearTimeout(step.runtime.focusTimer);
                step.runtime.isFocusTag = true;
            }
            lightElement.onmouseleave =  ()=> {
                step.runtime.focusTimer = setTimeout(()=>{
                    step.runtime.isFocusTag = false;
                },1000)
            }

            io.observe(lightElement)

            lightElement.remove = function () {
                io.unobserve(lightElement);
                removeElementHighlight(lightElement)
            }
            // @ts-ignore-next-line
            lightElement._light = step;

            wrapperLightAttr(lightElement,step.data)
            return lightElement;
        });
        step.runtime.warn = result ? '' : '未找到匹配内容';
        if(result){
            step.runtime.relatedNode.push(...result.lightsElement);
        }
    }

    function appendElement (){
        const appendElement = document.createElement('pagenote-icon');
        appendElement.dataset.size = 'small'
        appendElement.onclick=function (e) {
            step.openEditor(true,{

            });
            step.data.lightStatus = LightStatus.LIGHT
            e.stopPropagation();
        }

        const nodes = step.runtime.relatedNode || [];
        const lastNode = nodes[step.runtime.relatedNode.length-1];

        if(!lastNode){
            return;
        }

        appendElement.innerHTML  = '<svg t="1628959484097"  viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2050" width="32" height="32"><path d="M800 96a128 128 0 0 1 128 128v576a128 128 0 0 1-128 128H224A128 128 0 0 1 96 800V224A128 128 0 0 1 224 96z m0 64H224a64 64 0 0 0-64 64v576a64 64 0 0 0 64 64h576a64 64 0 0 0 64-64V224a64 64 0 0 0-64-64zM469.312 757.312a32 32 0 0 1-5.76-63.488l5.76-0.512H480V384a32 32 0 0 1 1.792-10.688h-108.48v32a32 32 0 0 1-26.24 31.488l-5.76 0.512a32 32 0 0 1-31.488-26.24l-0.512-5.76v-64a32 32 0 0 1 26.24-31.488l5.76-0.512h341.376a32 32 0 0 1 31.488 26.24l0.512 5.76v64a32 32 0 0 1-63.488 5.76l-0.512-5.76-0.064-32H542.208c0.512 1.6 0.96 3.2 1.28 4.928L544 384v309.312h10.688a32 32 0 0 1 5.76 63.488l-5.76 0.512h-85.376z" p-id="2051"></path></svg>'
        wrapperLightAttr(lastNode,step.data,appendElement)

        step.addListener(function (data: { bg: any; lightStatus: any; tip: any; }) {
            nodes.forEach((node: any, index: number)=>{
                if(index===nodes.length - 1){
                    wrapperLightAttr(node,data,appendElement)
                }else{
                    wrapperLightAttr(node,data)
                }
            })
        })
    }

    let timer = null;
    (function findElement(times){
        // @ts-ignore
        const targetEl = whats.getTarget(id);
        clearTimeout(timer);
        if(targetEl){
            highlightElement(targetEl);
            appendElement();
        }else if(times<5){
            timer = setTimeout(()=>{
                findElement(++times)
            },1000*times)
        }else{
            highlightElement(document.body);
            appendElement();
        }
    })(0)
}

export default initKeywordTags;