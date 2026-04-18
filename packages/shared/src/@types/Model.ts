import {AnnotationShowType, AnnotationStatus, ContentType} from "./data";
import {LightStatus, LightType} from "../pagenote-brush";

export type BasicIndexFields = {
    key: string;
    /**数据真实的创建、最后更新时间*/
    createAt: number,
    updateAt: number,
    visitedAt?: number, // 最后访问时间

    /**版本号信息*/
    dataV?: number
    extV?: number
    did?: string
    /**本地删除标记*/
    deleted: boolean,
}

/**表关联依据*/
export type LinkPageInfo = {
    webpageKey?: string;
    source?: string
    sessionId?: string;
}

type CommonModelInfo = BasicIndexFields & LinkPageInfo;

/**网页*/
export type WebPage = Omit<CommonModelInfo, 'webpageKey'>  & {
    key: string, // 此数据的唯一标识符，一般为 URL，但也可能是hash值
    /**关联网页标准*/
    source?: string,
    canonical?: string // 同一文档标识地址
    urls?: string[], // 此条数据绑定的 URL 集合
    url: string
    pathname: string
    domain: string  // 域名
    urlSearch?: string
    urlHash?: string

    /**指纹、附属信息相关*/
    icon: string,
    title: string
    keywords?: string[]
    description: string, // 网站描述
    hash?: string,
    fingerprint?: string, // 指纹信息
    images?: string[]
    thumb: string, // 预览缩略图

    /**个性化数据*/
    pin?:boolean,
    categories?: string[],

    /**@deprecated*/
    plainData?: any
}

/**笔记备忘录**/
export type Note = CommonModelInfo & {
    // 笔记的数据存储形式
    plainType:"html"|"slate"|"markdown"|"tiptap";
    // html 表现形式内容
    html?: string;
    // 笔记的结构化数据形式
    slate?: any;
    // 笔记的 markdown 数据形式
    markdown?: string;
    tiptap?: Object;
    plainText?: string // 纯文本信息
    tags?: string[]
    /**@deprecated*/
    relatedType?: "domain"|"url"|"custom"
    /**@deprecated*/
    url?: string
    /**@deprecated*/
    path?: string
    /**@deprecated*/
    domain?: string
}

/**标记*/
export type Light = CommonModelInfo & {
    wid?: string // whats-element id
    /**@deprecated*/
    pageId?: string;
    /**@deprecated*/
    domain: string;
    /**@deprecated*/
    path: string;
    /**@deprecated*/
    alt?: string;
    /**@deprecated*/
    comment?: string;
    deviceWidth?: number;
    deviceHeight?: number;

    /**批注信息*/
    annotationW?: number
    annotationH?: number
    annotationX?: number
    annotationY?: number

    x?: number, // 标记在文档中基于 body 的 x轴 位置
    y?: number, // 标记在文档中基于 body 的 y轴 位置
    // TODO 使用 wid 全面替换 ID
    id?: string, // 标记的元素节点，在文档中唯一标识符，取值参考 whats-element
    tip?: string, // 标记的笔记（用户输入）
    /**标记背景色*/
    bg?: string,
    /**前景色*/
    color?: string
    /**@deprecated*/
    isActive?: boolean, // 是否为激活状态
    /**@deprecated*/
    lightStatus?: LightStatus // 高亮状态
    annotationStatus?: AnnotationStatus,
    annotationShowType?: AnnotationShowType,

    lightType?: LightType | string, // 画笔类型，删除线、高亮
    level?: number, // 高亮层级

    /**选区类型，默认文本选区*/
    selectionType?: 'text' | 'image',

    /**基于文本的上下文信息*/
    text?: string, // 标记的文本内容
    pre? : string, // 标记的文本内容 上文信息
    suffix?: string, // 标记的文本内容 下文信息
    /**选择为图片的链接地址*/
    imgSrc?: string
    /**@deprecated*/
    images?: { id?: string, src?: string, alt?: string }[], // 图片高亮，待支持
    //兄弟、父节点上下文信息
    // next?: string,
    // prev?: string,
    // parent?: string,
    // nextSibling?: string,


    /**基于选区的存储信息*/
    range:{
        startContainerWid: string, // 选区开始的节点 wid
        endContainerWid: string, // 选区结束的节点 wid
        startOffset?: number,
        endOffset?: number
    }
    /**基于文本的位置信息*/
    textPosition?: {
        start: number,
        end: number
    }




    clientX?: number,
    clientY?: number,
    /**@deprecated*/
    offsetX?: number, // 批注与高亮元素的相对偏移量
    /**@deprecated*/
    offsetY?: number, // 批注与高亮元素的相对偏移量
    /**@deprecated*/
    parentW?: number, // 高亮元素父节点宽度
    /**@deprecated*/
    lightId?: string, // 每一条标记的唯一 hash id
    /**@deprecated*/
    lightBg?: string, // 将废弃
    /**@deprecated*/
    daskBg?: string, // 将废弃
    /**@deprecated*/
    isFocusTag?: boolean,
    /**@deprecated*/
    time?: number,
    createAt?: number, // 创建时间
    updateAt: number, // 修改时间
    /**@deprecated*/
    score?: number, // 此条笔记重要评分
    originContext?: string, // 原始上下文
    deleted: boolean // 删除标记
    author?: string // 原始作者
    url?: string
    pageKey?: string
    urlPath?: string
    /**数据源，如来自哪个网页*/
    source?: string
    // 标记关联网页，匹配规则
    /**@deprecated*/
    matchUrls?: string[]
    hash?: string
    v?: number // 数据版本
}

/**截图**/
export type SnapshotResource = CommonModelInfo & {
    url: string, // 可访问的URL 地址，base64 或链接
    uri?: string // 互联网可访问的链接地址
    alt?: string // 图片说明
    thumb?: string, // 缩略图
    width: number,
    height: number,
    contentType: ContentType,
    /**@deprecated*/
    pageKey: string // 关联的网页key
    /**@deprecated*/
    pageUrl: string // 关联的网页url
    type?: string
}

/**离线网页*/
export type OfflineHTML = CommonModelInfo & {
    key?: string,
    resourceId?: string, // 插件本地获取该资源的唯一标识

    name?: string, // 文件名

    description?: string

    icon?: string // 图标

    originUrl: string // 原始资源对应的链接地址，可能会无法访问的资源
    onlineUri?: string // 可联网被访问的链接；可能是基于 originUrl 处理上传云盘、图床的二次生成链接。相对稳定的资源。

    contentType?: ContentType, // 文件类型
    contentLength?: number, // 资源size
    lastModified?: string,
    ETag?: string,
    data: string, // 资源内容，只支持字符串存储，不支持二进制数据

    relatedPageKey?: string, //关联的网页key
    relatedPageUrl?: string // 关联的网址

    deleted: boolean,
    // size?: number
    domain?: string
    thumb?: string // 快照缩略图
    // 数据资源的存储时间信息
    visitedAt?: number // 资源访问最后时间
    createAt?: number,
    updateAt: number
}
