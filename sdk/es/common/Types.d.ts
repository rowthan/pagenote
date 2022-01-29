declare enum AnnotationStatus {
    fixed = 1,
    un_fixed = 0,
    SHOW = 2,
    HIDE = 0
}
declare enum LightStatus {
    un_light = 0,
    half_light = 1,
    light = 2,
    LIGHT = 2,
    UN_LIGHT = 0
}
declare type Target = Step & {
    clientX: number;
    clientY: number;
    bg: string;
};
declare type Step = {
    x: number;
    y: number;
    id: string;
    level?: number;
    bg: string;
    text?: string;
    pre?: string;
    suffix?: string;
    tip: string;
    isActive: boolean;
    offsetX?: number;
    offsetY?: number;
    parentW?: number;
    lightId?: string;
    images?: any[];
    lightStatus: LightStatus;
    annotationStatus: AnnotationStatus;
    lightBg?: string;
    daskBg?: string;
    isFocusTag?: boolean;
    time?: number;
};
declare type Position = {
    x: number;
    y: number;
};
declare type PlainData = {
    url: string;
    images: string[];
    categories: string[];
    snapshots: string[];
    setting: any;
    steps: Step[];
    note?: string;
    title?: string;
    version?: string;
    icon?: string;
    createAt?: number;
    description?: string;
    lastModified?: number;
};
declare type WebPageIds = {
    key: string;
    url: string;
    urls: string[];
};
declare type WebPageTimes = {
    createAt: number;
    updateAt: number;
    lastSyncTime?: number;
    mtimeMs?: number;
    expiredAt?: number;
};
declare type WebPageSiteInfo = {
    deleted: boolean;
    icon: string;
    title: string;
    version: string;
    description: string;
};
declare type WebPageDatas = {
    plainData: PlainData;
};
declare type WebPage = WebPageIds & WebPageTimes & WebPageDatas & WebPageSiteInfo;
declare type UpdateProps<T, Key extends keyof T> = {
    [key in Key]?: T[key];
};
declare type AllowUpdateKeys = keyof WebPageDatas | keyof WebPageSiteInfo | 'url' | 'urls';
interface IWebPage {
    data: WebPage;
    lastHash: string;
    isValid(): boolean;
    isEmpty(): boolean;
    setData(webPage: UpdateProps<WebPage, AllowUpdateKeys>): boolean;
    createDataHash(): string;
}
declare class WebPageItem implements IWebPage {
    data: WebPage;
    lastHash: string;
    constructor(webPage: WebPage);
    setData(webPage: WebPage): boolean;
    isValid(): boolean;
    isEmpty(): boolean;
    createDataHash(): string;
}
export type { PlainData, WebPage, Step, Position, Target, };
export { WebPageItem, LightStatus, AnnotationStatus };
