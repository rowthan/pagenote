import IStep from './pagenote-step';
import './assets/styles/camera.scss';
import './assets/iconfont/icon.css';
import { Message } from "./utils/notification";
import { IOption } from "./types/Option";
import { PlainData, Step, Position } from "./common/Types";
declare type RuntimePlainData = Omit<PlainData, 'steps'> & {
    steps: IStep[];
};
declare class PagenoteCore {
    static readonly version = "5.3.11";
    readonly CONSTANT: {
        ID: string;
        UN_INIT: number;
        DESTROY: number;
        RE_ALIVE: number;
        WAITING: number;
        READY: number;
        RECORDING: number;
        PAUSE: number;
        RECORDED: number;
        REMOVED: number;
        REMOVEDALL: number;
        RECORDFAIL: number;
        FINNISHED: number;
        REPLAYING: number;
        PLAYANDWAIT: number;
        DONE: number;
        START_SYNC: number;
        SYNCED: number;
        SYNCED_ERROR: number;
        URLCHANGED: number;
        HASHCHANGED: number;
        LIGHT: number;
        DIS_LIGHT: number;
        SHARE_CONFIRM: string;
        SHARE_ING: string;
        SHARE_ERROR: string;
        SHARE_SUCCESS: string;
    };
    options: IOption;
    id: string;
    status: number;
    plainData: RuntimePlainData;
    target: Step;
    _runtime: {
        startPosition: Position;
        lastPosition: Position;
        lastEvent: Event;
        lastKeydownTime: number;
    };
    _listeners: Function[];
    constructor(id: string, options: IOption);
    init(initData: PlainData): void;
    record(targetInfo: Partial<Step>, callback?: (step: IStep) => void): void;
    addKeyDownListener(): void;
    addMoveListener(): void;
    addSelectionListener(): void;
    addKeyUpListener(): void;
    addShortCutListener(): void;
    addListener(fun: Function): void;
    showActionBar(): void;
    hideActionBar(): void;
    getStepIndex(lightId: string): number;
    removeStep(lightId: string): void;
    save(): void;
    notification(message: Message): void;
    updateSetting(setting: IOption): void;
    decodeData(data: any): {};
    encryptData(data: any): string;
    exportData(template: {
        template: string;
        fileExt: string;
        icon: string;
        name: string;
        description: string;
    }, data: any): {
        success: boolean;
        data: any;
    };
    i18n: {
        setLang: (lang: any, values: any) => void;
        t: (key: any, values?: any[]) => any;
        setLangType: (lang: any) => void;
        getLangType: () => string;
    };
}
export default PagenoteCore;
