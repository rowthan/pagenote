import { AnnotationStatus } from "../common/Types";
declare const whats: any;
declare const isMobile: boolean;
declare function getPagenoteRoot(): Element;
declare function getRootOffset(): {
    left: number;
    top: number;
    scrollHeight: number;
};
declare const prepareSelectionTarget: (enableMarkImg: any, positions: any) => {
    x: number;
    y: number;
    offsetX: number;
    offsetY: number;
    pre: string;
    suffix: string;
    text: string;
    tip: string;
    time: number;
    id: any;
    isActive: boolean;
    bg: string;
    parentW: number;
    canHighlight: boolean;
    selectionElements: DocumentFragment;
    images: {
        id: any;
        src: any;
        alt: any;
    }[];
    annotationStatus: AnnotationStatus;
    lightStatus: any;
};
declare function getParams(url: any): {
    paramObj: {};
    paramKeys: any[];
};
declare function encryptData(string: any): string;
declare function decryptedData(data: any): {};
declare function throttle(fn: any, interval?: number): () => void;
declare function debounce(fn: any, interval?: number): () => void;
declare function convertColor(color?: string): "#000000" | {
    rgb: number[];
    textColor: string;
    y: number;
};
declare function computePosition(index: any, radio?: number): {
    x: string;
    y: string;
};
export { getParams, encryptData, decryptedData, throttle, debounce, convertColor, computePosition, prepareSelectionTarget, isMobile, whats, getPagenoteRoot, getRootOffset, };
