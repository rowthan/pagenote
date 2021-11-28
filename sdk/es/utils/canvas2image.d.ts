export default Canvas2Image;
declare namespace Canvas2Image {
    export { saveAsImage };
    export function saveAsPNG(canvas: any, width: any, height: any): void;
    export function saveAsJPEG(canvas: any, width: any, height: any): void;
    export function saveAsGIF(canvas: any, width: any, height: any): void;
    export function saveAsBMP(canvas: any, width: any, height: any): void;
    export { convertToImage };
    export function convertToPNG(canvas: any, width: any, height: any): HTMLImageElement;
    export function convertToJPEG(canvas: any, width: any, height: any): HTMLImageElement;
    export function convertToGIF(canvas: any, width: any, height: any): HTMLImageElement;
    export function convertToBMP(canvas: any, width: any, height: any): HTMLImageElement;
}
/**
 * saveAsImage
 * @param canvasElement
 * @param {String} image type
 * @param {Number} [optional] png width
 * @param {Number} [optional] png height
 */
declare function saveAsImage(canvas: any, width: any, height: any, type: any): void;
declare function convertToImage(canvas: any, width: any, height: any, type: any): HTMLImageElement;
