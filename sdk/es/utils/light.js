import { convertColor } from "./index";
export function wrapperLightAttr(lightElement, _a, appendEl, runtime) {
    var bg = _a.bg, lightStatus = _a.lightStatus, tip = _a.tip;
    if (!bg) {
        return;
    }
    var _b = convertColor(bg), textColor = _b.textColor, rgb = _b.rgb;
    var bottomColor = "rgb(" + (rgb[0] - 30) + "," + (rgb[1] - 30) + "," + (rgb[2] - 30) + ")";
    var bgColor = "rgba(" + rgb.toString() + ",1)";
    lightElement.dataset.active = [1, 2, 3].includes(lightStatus) ? "" + lightStatus : (lightStatus ? '1' : '0');
    lightElement.dataset.note = !!tip ? '1' : '0';
    lightElement.dataset.lighting = runtime.lighting; //? '1' : ''
    lightElement.style = "--bgcolor:" + bgColor + ";--color:" + textColor + ";--bgbottomcolor:" + bottomColor + ";background-image: linear-gradient(0deg," + bgColor + " 2em," + bgColor + " 0);";
    if (appendEl) {
        if (tip) {
            lightElement.appendChild(appendEl);
        }
        else {
            appendEl.parentNode && appendEl.parentNode.removeChild(appendEl);
        }
    }
}
export function wrapperAnnotationAttr(element, color, show, tip, focus, lighting) {
    if (focus === void 0) { focus = ''; }
    element.dataset.visiable = show ? '1' : '0';
    element.dataset.tip = !!tip ? '1' : '0';
    element.style = "--color:" + color;
    element.dataset.focus = focus;
    element.dataset.lighting = lighting; //? '1': '0'
}
//# sourceMappingURL=light.js.map