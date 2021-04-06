import {Step} from "../pagenote-step";

enum BAR_STATUS{
    fold,
    expand,
}

class OptionsProps{
    initType?: string;
    dura?: number;
    saveInURL?: boolean;
    saveInLocal?: boolean;
    maxMarkNumber?: number;
    enableMarkImg?: boolean;
    blacklist: string[];
    autoLight?: boolean;
    colors?: string[];
    shortCuts: string[];
    barInfo?: {right:number,top:number,status:BAR_STATUS};
    actionBarOffset?: {offsetX:number,offsetY:number};
    showIconAnimation?: boolean;
    onShare?: object;
    functionColors: string[];
    sideBarActions: string[];
    categories: string[];
    showBarTimeout?: number;
    keyupTimeout?: number;
}

interface Pagenote {
    options: OptionsProps;

    record(info:object): Step;
    remove(index:number): boolean;
    replay(index:number,goto:boolean,autoNext:boolean,isActive:boolean): void;
    makelink(fun: any): void;
    openModal(): void;
    _syncModal(): void;
    generateMD(): void;
    notification(message: string,type: string,duration:number,position:{x:string,y:string}): void;
    capture(target: HTMLElement): void;
    triggerListener(): void;

    decodeData(): string;
    encryptData(): string;
}
