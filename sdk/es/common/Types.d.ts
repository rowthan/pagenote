declare enum AnnotationStatus {
    fixed = 1,
    un_fixed = 0
}
declare enum LightStatus {
    un_light = 0,
    half_light = 1,
    light = 2
}
interface Step {
    bg: string;
    id: string;
    isActive: string;
    offsetX: number;
    offsetY: number;
    parentW: number;
    x: number;
    y: number;
    time: string;
    pre: string;
    tip: string;
    suffix: string;
    text: string;
    annotationStatus: AnnotationStatus;
    lightStatus: LightStatus;
}
interface PlainData {
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
}
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
    setData(webPage: UpdateProps<WebPage, AllowUpdateKeys>): boolean;
    createDataHash(): string;
}
declare class WebPageItem implements IWebPage {
    data: WebPage;
    lastHash: string;
    constructor(webPage: WebPage);
    setData(webPage: WebPage): boolean;
    isValid(): boolean;
    createDataHash(): string;
}
export type { PlainData, WebPage, Step, };
export { WebPageItem };
