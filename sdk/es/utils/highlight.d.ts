/**包裹img标签*/
interface WrappedImage extends HTMLImageElement {
    _originNode: HTMLImageElement;
}
/** 高亮一个元素内的关键词，return {match:2,light:1,lights:[elements]} */
interface LightElement extends HTMLElement {
    dataset: {
        lightid?: string;
        highlight?: string;
        lightindex?: string;
        type?: 'img' | undefined;
    };
}
/**包裹文本节点方法*/
interface WarpTagFun {
    (text: string): LightElement;
}
/**高亮结果*/
interface HighlightResult {
    match: number;
    lightsElement: LightElement[];
}
/**
 * 包裹 img 标签
 * */
declare function wrapImages(htmlNode: HTMLElement, imageSrc: string): WrappedImage;
/**在HTML element中高亮关键词*/
declare const highlightKeywordInElement: (element: HTMLElement, keywords: string, pre?: string, next?: string, deep?: number, warpTagFun?: WarpTagFun, blackNodes?: any[]) => HighlightResult;
/**移除高亮、还原HTML节点*/
declare const removeElementHighlight: (query: string | WrappedImage) => void;
export type { LightElement };
export { wrapImages, highlightKeywordInElement, removeElementHighlight, };
