export function emptyChildren(element: any): void;
export function gotoPosition(element: any, targetX: any, targetY: any, onFinished: any): void;
export function getScroll(): {
    x: number;
    y: number;
};
export function highlightKeyword(wid: any, element: any, text: any, hightlight: any, color: string, blackNodes: any[], callback: any): void;
export function getWebIcon(): any;
export function getViewPosition(elem: any): {
    top: any;
    left: any;
    width: any;
    height: any;
    bodyTop: any;
    bodyLeft: any;
};
export function moveable(element: any, callback: any, childMove?: boolean): void;
export function writeTextToClipboard(text: any): Promise<void>;
export function captureElementImage(target: any): Promise<any>;
export function convertImgToBase64(url: any, width: any, height: any, callback: any, outputFormat: any): void;
export function showCamera(snapshot: any): void;
export function keepLastIndex(obj: any): void;
