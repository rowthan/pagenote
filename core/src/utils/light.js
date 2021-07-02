import {convertColor} from "./index";

export function wrapperLightAttr(lightElement,color,isActive) {
    const {textColor,rgb} = convertColor(color);
    const bottomColor = `rgb(${(rgb[0]-30)},${(rgb[1]-30)},${(rgb[2]-30)})`;
    const bgColor = `rgba(${rgb.toString()},1)`;

    lightElement.dataset.active = isActive ? '1' : '0';
    lightElement.style=`--bgcolor:${bgColor};--color:${textColor};--bgbottomcolor:${bottomColor}`;
}