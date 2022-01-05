/// <reference types="node" />
import { StepProps } from "./step/const";
interface StepOptions {
    colors: string[];
    renderAnnotation: any;
    save: Function;
}
declare type StepRuntime = {
    warn: string;
    isVisible: boolean;
    isFocusTag: boolean;
    isFocusAnnotation: boolean;
    relatedNode: HTMLElement[];
    relatedNodePosition: {
        top: number;
        left: number;
    };
    relatedAnnotationNode: HTMLElement;
    focusTimer: NodeJS.Timer;
    annotationDrag: any;
    editing: boolean;
    lighting: '' | 'light';
};
declare class Step {
    options: StepOptions;
    listeners: {
        data: Record<string, Function>;
        runtime: Record<string, Function>;
    };
    data: any;
    runtime: StepRuntime;
    static lastFocus: string;
    constructor(info: StepProps, options: StepOptions, callback?: Function);
    init(): void;
    initKeywordTags(): void;
    initAnnotation(): void;
    gotoView(): void;
    lighting(): void;
    connectToKeywordTag(): void;
    changeStatus(cnt: number): void;
    delete(): void;
    copyToClipboard(copyAll: boolean, position: {
        x: string;
        y: string;
    }): void;
    addListener(fun: Function, isRuntime?: boolean, funId?: string): void;
    getCurrentIndex(): number;
    openEditor(show: boolean): void;
    getNear(loop?: boolean): any[];
}
export default Step;
