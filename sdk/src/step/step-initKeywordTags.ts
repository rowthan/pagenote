import {highlightKeywordInElement, LightElement, removeElementHighlight, wrapImages} from "../utils/highlight";
import {wrapperLightAttr} from "../utils/light";
import toggleLightMenu from "../light-menu";
import {getPagenoteRoot, whats} from "../utils";
import {AnnotationStatus, LightStatus,} from '../../../shared/src/@types/Types'
import IStep from "../pagenote-step";


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
    const step:IStep = this;

    step.addListener(function (target:any,key:string,value:any) {
        if(key==='relatedNode'){
            for(let i=0; i<value.length; i++){
                const lightElement = value[i];
                if(lightElement._light){
                    continue;
                }
                lightElement.onclick = function (e:Event) {
                    const {data} = step;
                    const nextLightStatus = (data.lightStatus || LightStatus.UN_LIGHT) + 1;
                    toggleLightMenu(true,step)
                    step.data.lightStatus = nextLightStatus > LightStatus.LIGHT ? LightStatus.UN_LIGHT : nextLightStatus;
                    switch (step.data.lightStatus){
                        case LightStatus.UN_LIGHT:
                            step.data.annotationStatus = AnnotationStatus.HIDE
                            break;
                        case LightStatus.LIGHT:
                            step.data.annotationStatus = AnnotationStatus.SHOW;
                            break;
                    }
                    if(step.data.tip){
                        step.runtime.lighting = 'annotation';
                    }
                    setTimeout(function () {
                        step.runtime.lighting = '';
                    },2000)
                    // step.data.annotationStatus = nextLightStatus === LightStatus.LIGHT ? AnnotationStatus.SHOW : AnnotationStatus.HIDE
                    e.stopPropagation();
                };

                lightElement.ondblclick = function(e:Event){
                    e.stopPropagation();
                    step.openEditor(true);
                }

                lightElement.onmouseenter = ()=> {
                    clearTimeout(step.runtime.focusTimer);
                    // 如果没有标记内容，则自动贴紧
                    if(!step.data.tip){
                        step.connectToKeywordTag();
                    }
                    // 鼠标经过后0.5s标记为 isFocusTag
                    step.runtime.focusTimer = setTimeout(()=>{
                        step.runtime.isFocusTag = true;
                    },300)
                }
                lightElement.onmouseleave =  ()=> {
                    clearTimeout(step.runtime.focusTimer);
                    step.runtime.focusTimer = setTimeout(()=>{
                        step.runtime.isFocusTag = false;
                    },800)
                }

                io.observe(lightElement)

                lightElement.remove = function () {
                    io.unobserve(lightElement);
                    removeElementHighlight(lightElement)
                }
                // @ts-ignore-next-line
                lightElement._light = step;
            }
        }
    },true,'initKeywordTag')

    const onDataChange = function () {
        const nodes = step.runtime.relatedNode || [];
        nodes.forEach((node: any)=>{
            wrapperLightAttr(node,step.data,null,step.runtime)
        })
    }

    step.addListener(onDataChange,false)
    step.addListener(onDataChange,true)

    const {bg,id,text,pre,suffix,lightId,lightStatus,images=[]} = step.data;

    function highlightElement(target: HTMLElement) {
        // 元素内的所有内容都被高亮时 直接高亮元素，不再使用 highlight 正则匹配
        // if(target.innerText.trim() === text){
        //     debugger
        // }

        // 查找文字、高亮元素
        let index = 0;
        const result = highlightKeywordInElement(target,text||'',pre||'',suffix||'',null,function(text){
            const lightElement: LightElement = document.createElement('light');
            lightElement.dataset.highlight = lightId;
            lightElement.dataset.lightindex = String(index);
            index++

            if(text){
                lightElement.textContent = text;
            }
            return lightElement;
        },[getPagenoteRoot()]);
        step.runtime.warn = result ? '' : '未找到匹配内容';
        if(result){
            step.runtime.relatedNode = [...step.runtime.relatedNode,...result.lightsElement];
            let position = {
                offsetBodyTop:0,
                offsetBodyLeft:0,
            };
            try{
                // @ts-ignore
                position = whats.compute(result.lightsElement[0])
            }catch (e) {

            }
            step.runtime.relatedNodePosition = {
                top: position.offsetBodyTop,
                left: position.offsetBodyLeft,
            }
        }
    }


    let timer = null;
    (function findElement(times){
        // @ts-ignore
        const targetEl = whats.getTarget(id);
        clearTimeout(timer);
        if(targetEl){
            if(text){
                highlightElement(targetEl);
            }
            images.forEach(function (image:{src:string}) {
                const relatedImage = wrapImages(targetEl,image.src);
                if(relatedImage){
                    const newRelated = [...step.runtime.relatedNode,relatedImage];
                    step.runtime.relatedNode = newRelated
                }
            })
        }else if(times<8){
            timer = setTimeout(()=>{
                findElement(++times)
            },2000*times)
        }else{
            highlightElement(document.body);
        }
    })(0);


}

export default initKeywordTags;
