export function getParams(url: any): {
    paramObj: {};
    paramKeys: any[];
};
export function encryptData(string: any): string;
export function decryptedData(data: any): {};
export function throttle(fn: any, interval?: number): () => void;
export function debounce(fn: any, interval?: number): () => void;
export function convertColor(color?: string): "#000000" | {
    rgb: number[];
    textColor: string;
    y: number;
};
export function computePosition(index: any, radio?: number): {
    x: string;
    y: string;
};
export function prepareSelectionTarget(enableMarkImg: any, positions: any): {
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
    annotationStatus: any;
    lightStatus: any;
};
export const isMobile: boolean;
export const whats: any;
export function getPagenoteRoot(): Element;
export function getRootOffset(): {
    left: number;
    top: number;
    scrollHeight: number;
};
