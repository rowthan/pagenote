import {convertColor} from "./index";

export function wrapperLightAttr(lightElement,color,status) {
    const {textColor,rgb} = convertColor(color);
    const bottomColor = `rgb(${(rgb[0]-30)},${(rgb[1]-30)},${(rgb[2]-30)})`;
    const bgColor = `rgba(${rgb.toString()},1)`;

    lightElement.dataset.active = [1,2,3].includes(status) ? `${status}` : (status ? '1' : '0');
    lightElement.style=`--bgcolor:${bgColor};--color:${textColor};--bgbottomcolor:${bottomColor}`;
}

export function wrapperAnnotationAttr(element,color,show) {
    element.dataset.visiable = show ? '1' :'0';
    element.style = `--color:${color}`;
}