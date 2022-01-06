/// <reference types="node" />
import { Step } from './common/Types';
interface StepOptions {
    colors: string[];
    renderAnnotation: any;
    remove: Function;
    save: Function;
    getIndex: {
        (id: string): number;
    };
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
declare class IStep {
    static lastFocus: string;
    options: StepOptions;
    listeners: {
        data: Record<string, Function>;
        runtime: Record<string, Function>;
    };
    data: Step;
    runtime: StepRuntime;
    constructor(initData: Step, options: StepOptions, callback: (step: IStep) => void);
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
    openEditor(show: boolean): void;
}
export default IStep;
