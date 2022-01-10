import md5 from 'md5';

enum AnnotationStatus {
    fixed=1,
    un_fixed=0,
    SHOW=2,
    HIDE=0
}

enum LightStatus {
    un_light=0,
    half_light=1,
    light=2,
    LIGHT=2,
    UN_LIGHT=0
}

type Step = {
    x: number, // 标记在文档中基于 body 的 x轴 位置
    y: number, // 标记在文档中基于 body 的 y轴 位置
    id: string, // 标记的元素节点，在文档中唯一标识符，取值参考 whats-element
    level?: number, // 高亮层级
    bg: string, // 标记背景色
    text?: string, // 标记的文本内容
    pre? : string, // 标记的文本内容 上文信息
    suffix?: string, // 标记的文本内容 下文信息
    tip: string, // 标记的笔记（用户输入）
    isActive: boolean, // 是否为激活状态
    offsetX?: number, // 批注与高亮元素的相对偏移量
    offsetY?: number, // 批注与高亮元素的相对偏移量
    parentW?: number, // 高亮元素父节点宽度
    lightId?: string, // 每一条标记的唯一 hash id
    images?: any[], // 图片高亮，待支持
    lightStatus: LightStatus
    annotationStatus: AnnotationStatus,
    lightBg?: string, // 将废弃
    daskBg?: string, // 将废弃
    isFocusTag?: boolean,
    time?: number,
}

type Position = {
    x:number,
    y:number
}

type PlainData = {
    url: string,
    images: string[],
    categories: string[],
    snapshots: string[],
    setting: any,
    steps: Step[],
    note?: string,

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

    data: WebPage = {
        createAt: 0,
        deleted: false,
        description: "",
        icon: "",
        key: "",
        plainData: undefined,
        title: "",
        updateAt: 0,
        url: "",
        urls: [],
        version: ""
    };
    lastHash: string = EMPTY_HASH;

    constructor(webPage:WebPage) {
        this.setData(webPage);
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
    Step,
    Position,
}

export {
    WebPageItem,
    LightStatus,
    AnnotationStatus
}
