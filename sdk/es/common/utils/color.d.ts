declare const stringToColor: (str: string, alpha?: number) => string;
/**
 * 传入一个颜色值，返回文本色、背景色
 * color: rgb(255,24,244) => {rgb:[],textColor}
 * */
declare function convertColor(color?: string): {
    rgb: [number, number, number];
    textColor: string;
};
export { stringToColor, convertColor, };
