declare function getWebIcon(): string;
declare function getWebTitle(): string;
declare function getWebDescription(): string;
declare const contentToFile: (content: string, filename: string) => void;
declare function loadScript(src: string, globalKey?: string, callback?: Function): void;
export { getWebIcon, getWebTitle, getWebDescription, contentToFile, loadScript, };
