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
            item.target._light.changeData({
                isVisible: item.intersectionRatio>0
            },true)
        }
    })
}, options)

function initKeywordTags(){
    const step = this;
    const {bg,id,text,pre,suffix,lightId,lightStatus} = step.data;

    function highlightElement(target: HTMLElement) {
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

            wrapperLightAttr(lightElement,step.data)

            lightElement.onclick = function (e) {
                const {data} = step;
                const nextLightStatus = data.lightStatus + 1;
                toggleLightMenu(true,step)
                step.changeData({
                    lightStatus: nextLightStatus>2?0:nextLightStatus,
                    annotationStatus: nextLightStatus === LightStatus.LIGHT ? AnnotationStatus.SHOW : AnnotationStatus.HIDE
                });
                e.stopPropagation();
            };

            lightElement.ondblclick = function(e){
                e.stopPropagation();
                step.openEditor();
            }

            lightElement.onmouseenter = ()=> {
                clearTimeout(step.runtime.focusTimer);
                step.changeData({
                    isFocusTag: true,
                },true);

                // setTimeout(()=>{
                //   step.runtime.isFocusTag && toggleLightMenu(true,step);
                // },500)
            }
            lightElement.onmouseleave =  ()=> {
                step.runtime.focusTimer = setTimeout(()=>{
                    step.changeData({
                        isFocusTag: false
                    },true)
                },1000)
            }

            io.observe(lightElement)

            lightElement.remove = function () {
                io.unobserve(lightElement);
                removeElementHighlight(lightElement)
            }
            // @ts-ignore-next-line
            lightElement._light = step;
            return lightElement;
        });
        step.runtime.warn = result.match ? '' : '未找到匹配内容';
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
            step.changeData({
                lightStatus: LightStatus.LIGHT
            })
            e.stopPropagation();
        }

        const nodes = step.runtime.relatedNode || [];
        const lastNode = nodes[step.runtime.relatedNode.length-1];

        if(!lastNode){
            return;
        }

        appendElement.innerHTML  = '<svg t="1625328349729" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="10721" width="12" height="12"><path d="M800 289.356H224a31.97 31.97 0 0 0 0 63.94h576a31.97 31.97 0 0 0 0-63.94z m0 190.737H224a31.97 31.97 0 1 0 0 63.94h576a31.97 31.97 0 1 0 0-63.94z m0 190.737H224a31.97 31.97 0 0 0 0 63.94h576a31.97 31.97 0 0 0 0-63.94z" p-id="10722"></path><path d="M948.041 156.144A150.75 150.75 0 0 0 809.165 63.94h-0.279l-73.444 1.326a31.988 31.988 0 0 0 1.113 63.965l72.866-1.26a86.124 86.124 0 0 1 61.1 25.45c16.412 16.41 25.367 38.233 25.367 61.44v594.278c0 23.207-8.955 44.957-25.366 61.368a86.06 86.06 0 0 1-61.357 25.378h-594.33c-23.206 0-45.061-8.97-61.473-25.378a86.19 86.19 0 0 1-25.482-61.368V214.861a86.944 86.944 0 0 1 86.94-86.883h73.174a31.97 31.97 0 1 0 0-63.94h-73.159A150.827 150.827 0 0 0 63.94 214.86v594.278a150.599 150.599 0 0 0 150.895 150.686h594.33a150.328 150.328 0 0 0 150.66-150.686V214.861a149.837 149.837 0 0 0-11.784-58.717z" p-id="10723"></path><path d="M415.998 127.88h192a31.97 31.97 0 0 0 0-63.94h-192a31.97 31.97 0 0 0 0 63.94z" p-id="10724"></path></svg>'
        wrapperLightAttr(lastNode,step.data,appendElement)

        step.addListener('light',function (data: { bg: any; lightStatus: any; tip: any; }) {
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