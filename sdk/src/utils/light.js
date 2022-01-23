import {convertColor} from "./index";

export function wrapperLightAttr(lightElement,{bg,lightStatus,tip},appendEl,runtime) {
    if(!bg){
        return;
    }
    const {textColor,rgb} = convertColor(bg);
    const bottomColor = `rgb(${(rgb[0]-30)},${(rgb[1]-30)},${(rgb[2]-30)})`;
    const bgColor = `rgba(${rgb.toString()},1)`;

    lightElement.dataset.active = [1,2,3].includes(lightStatus) ? `${lightStatus}` : (lightStatus ? '1' : '0');
    lightElement.dataset.note = !!tip ? '1' : '0'
    lightElement.dataset.lighting = runtime.lighting //? '1' : ''
    let variable = `--bgcolor:${bgColor};--color:${textColor};--bgbottomcolor:${bottomColor};`;
    if(lightElement.tagName.toUpperCase()==='LIGHT'){
        variable += `background-image: linear-gradient(0deg,${bgColor} 2em,${bgColor} 0);`
    }
    lightElement.style=variable

    if(appendEl){
        if(tip){
            lightElement.appendChild(appendEl)
         } else{
             appendEl.parentNode && appendEl.parentNode.removeChild(appendEl)
         }
    }
}

export function wrapperAnnotationAttr(element,color,show,tip,focus='',lighting) {
    element.dataset.visiable = show ? '1' :'0';
    element.dataset.tip = !!tip ? '1' : '0'
    element.style = `--color:${color}`;
    element.dataset.focus = focus
    element.dataset.lighting = lighting //? '1': '0'
}