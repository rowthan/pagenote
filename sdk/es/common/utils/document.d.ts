declare function getWebIcon(): string;
declare function getWebTitle(): string;
declare function getWebDescription(): string;
declare const contentToFile: (content: string, filename: string) => void;
declare function loadScript(src: string, globalKey?: string, callback?: Function): void;
declare function appendScriptsToBody(scripts: string[]): void;
declare function onVisibilityChange(callback: Function): void;
export { getWebIcon, getWebTitle, getWebDescription, contentToFile, loadScript, appendScriptsToBody, onVisibilityChange, };
