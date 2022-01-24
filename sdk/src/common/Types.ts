const md5 = require('md5');

enum AnnotationStatus {
    fixed=1,
    un_fixed=0,
}

enum LightStatus {
    un_light=0,
    half_light=1,
    light=2,
}

enum LightType {
    normal = 'light',
    lineThrough= 'del'
}

interface Step {
    lightType:LightType,
    bg: string,
    id: string,
    isActive: string,
    offsetX: number,
    offsetY: number,
    parentW: number,
    x: number,
    y: number,
    time: string,
    pre: string,
    tip: string,
    suffix: string,
    text: string,
    annotationStatus: AnnotationStatus,
    lightStatus: LightStatus
}

interface PlainData {
    url: string,
    images: string[],
    categories: string[],
    snapshots: string[],
    setting: any,
    steps: Step[],

    // TODO 废弃 SDK 不处理
    title?: string,
    version?: string,
    icon?: string,
    createAt?: number,
    description?: string,
    lastModified?: number,
}

type WebPageIds = {
    key: string, // 此数据的唯一标识符，一般为 URL，但也可能是hash值
    url: string, // 此条数据绑定的 URL
    urls: string[], // 此条数据绑定的 URL 集合
}

type WebPageTimes = {
    createAt: number,
    updateAt: number,
    lastSyncTime?: number, // 云盘最后同步时间
    mtimeMs?: number, // 文件夹最后同步时间
    expiredAt?: number, // 时效过期时间
}

type WebPageSiteInfo = {
    deleted: boolean,
    icon: string,
    title: string,
    version: string,
    description: string,
}

type WebPageDatas = {
    plainData: PlainData,
}

type WebPage = WebPageIds & WebPageTimes & WebPageDatas & WebPageSiteInfo;

type UpdateProps<T,Key extends keyof T> = {[key in Key]?: T[key]}
type AllowUpdateKeys = keyof  WebPageDatas | keyof  WebPageSiteInfo | 'url' | 'urls'

interface IWebPage{
    data: WebPage,
    lastHash: string
    isValid():boolean, // 数据有效性校验，判断该数据是否有效
    setData(webPage:UpdateProps<WebPage, AllowUpdateKeys>):boolean,
    createDataHash():string,
}

const EMPTY_HASH = 'empty'

class WebPageItem implements IWebPage{
    // createAt: number;
    // deleted: boolean;
    // description: string;
    // expiredAt: number;
    // icon: string;
    // key: string;
    // lastSyncTime: number;
    // mtimeMs: number;
    // plainData: PlainData;
    // title: string;
    // updateAt: number;
    // url: string;
    // urls: string[];
    // version: string;

    data: WebPage;
    lastHash: string = EMPTY_HASH;

    constructor(webPage:WebPage) {
        this.data = webPage;
        this.lastHash = this.createDataHash();
    }

    setData(webPage: WebPage):boolean{
        for(let i in webPage){
            // @ts-ignore
            if(webPage[i]!==undefined){
                // @ts-ignore
                this.data[i] = webPage[i]
            }
            this.data.updateAt = Date.now();
        }
        const currentHash = this.createDataHash();
        const changed = currentHash !== this.lastHash
        this.lastHash = currentHash;
        return changed
    }

    isValid() {
        const {plainData} = this.data;
        return plainData?.steps.length > 0 || plainData?.snapshots.length > 0
    }

    createDataHash(){
        if(!this.isValid()){
            return EMPTY_HASH
        }
        const data = this.data;
        const string = JSON.stringify({
            version: data.version,
            deleted: data.deleted,
            plainData: data.plainData,
            description: data.description,
            icon: data.icon,
            urls: data.urls,
        })
        return md5(string)
    }
}

export type {
    PlainData,
    WebPage,
}

export {
    WebPageItem,
    LightType,
    LightStatus
}
