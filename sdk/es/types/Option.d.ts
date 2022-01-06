interface IBrush {
    bg: string;
    shortcut: string;
    label: string;
    level: number;
}
interface FunctionColor {
    eventid: string;
    onclick: Function;
    shortcut?: string;
}
interface IOption {
    debug: boolean;
    dura: number;
    enableMarkImg: boolean;
    blacklist: any[];
    autoLight: boolean;
    beforeRecord: {
        (): boolean;
    };
    brushes: IBrush[];
    barInfo: object;
    actionBarOffset: {
        offsetX: number;
        offsetY: number;
    };
    showIconAnimation: boolean;
    onShare: Function;
    functionColors: FunctionColor[];
    sideBarActions: any[];
    categories: string[];
    showBarTimeout: number;
    keyupTimeout: number;
    autoTag: boolean;
    renderAnnotation: Function;
}
export type { IOption, IBrush };
