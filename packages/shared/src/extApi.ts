import type {BackupData, ContentType, Step, WebPage,} from "./@types/data";
import type {Find, FindResponse, Projection, Query} from "./@types/database";
import type {
    BaseMessageHeader,
    BaseMessageResponse,
    IBaseMessageListener,
    IExtenstionMessageListener
} from "@pagenote/bridge";
import type {Action} from "./pagenote-actions/@types";
import type {ConvertMethod} from "./pagenote-convert";
import type {Brush} from "./pagenote-brush";
import type {BrowserType} from "./utils/browser";

type AbstractInfo = {
    id: string // 唯一标识，本地、远程联系的唯一ID

    /**本地读写基于的，操作ID*/
    l_id?: string
    /**远程读写基于的，操作ID，如文件系统的，文件名路径；数据库系统的 自动生成ID；notion 系统的 page ID*/
    c_id?: string

    /**1. 文件相关指标，文件指标相同的情况下，可以避免进一步比较文件内容是否相同**/
    etag?: string // etag hash标识，
    lastmod?: string // 文件的最后修改时间 GTM 格式

    mtimeMs?: number // 文件系统的最后修改时间，单位 s

    /**2. 数据相关指标*/
    updateAt: number // 数据的最后更新时间
}

type ComputeRequestToBackground<Funs extends Record<string, IBaseMessageListener<any, any, any>>> = {
    [fun in keyof Funs]: {
       <Response extends Parameters<Parameters<Funs[fun]>[2]>[0]>(arg: Parameters<Funs[fun]>[0], header?: Partial<BaseMessageHeader>): Promise<Response>
    }
}

type ComputeRequestToFront<Funs extends Record<string, IBaseMessageListener<any, any, any>>> = {
    [fun in keyof Funs]: {
        (arg: Parameters<Funs[fun]>[0], header?: Partial<BaseMessageHeader>): Promise<Parameters<Parameters<Funs[fun]>[2]>[0]>
    }
}

export type ComputeRequestApiMapDefine<Funs extends Record<string, IBaseMessageListener<any, any, any>>> = {
    [fun in keyof Funs]: boolean
}

type ResponseType<T> = T extends BaseMessageResponse<infer R> ? R : T
type ComputeServerResponse<Funs extends Record<string, IRequest<any, any>>> = {
    [fun in keyof Funs]: IExtenstionMessageListener<Parameters<Funs[fun]>[0], ResponseType<ReturnType<Funs[fun]>>>
}

interface IRequest<PARAMS, RESPONSE> {
    (params: PARAMS): BaseMessageResponse<RESPONSE>
}

export type SyncStat = {
    lastSyncAt: number; // 上次同步时间
    connected: boolean; // 连通性检查
    resolving: boolean; // 正在同步中
    message?: string; // 备注信息
    hasToken: boolean;
    manageUrl: string;
    icon?: string;
}


export namespace lightpage {

    export const id = 'lightpage';

    type PartWebpage = Partial<WebPage>
    type PartStep = Partial<Step>

    export type ExportFilters = {
        db: string
        table: string,
        query?: Query<any>
    }[]

    // 服务端可接受的请求API TODO 合并 light page snapshot 接口，
    export type response = {
        // 1.页面
        addPages: IExtenstionMessageListener<WebPage[], string[]>
        removePages: IExtenstionMessageListener<{ keys: string[], removeRelated?: ('light' | 'snapshot')[] }, number>
        updatePages: IExtenstionMessageListener<PartWebpage[], number>
        queryPages: IExtenstionMessageListener<Find<WebPage>, FindResponse<PartWebpage>>
        groupPages: IExtenstionMessageListener<{ groupBy: keyof WebPage, query?: Query<WebPage>, projection?: Projection<WebPage> }, Record<string, PartWebpage[]>>,


        /**单次请求对网页、标记、快照总体的存储（增量存储）*/
        saveLightPage: IExtenstionMessageListener<PartWebpage, WebPage | null>,
        /**查询网页携带的全量数据： 网页、标记、快照*/
        getLightPageDetail: IExtenstionMessageListener<{ key?: string, url?: string }, WebPage | null>,


        /**导入备份文件**/
        importBackup: IExtenstionMessageListener<{backupData?: BackupData, filePath?: string }, {
            db: string
            table: string,
            keys: string[]
        }[]>

        exportBackup: IExtenstionMessageListener<ExportFilters, {
            db: string
            table: string,
            keys: string[]
        }[]>

        [key: string]: IExtenstionMessageListener<any, any>
    }

    export type request = ComputeRequestToBackground<response>
}

export namespace setting {
    export const id = 'setting';

    export enum SDK_VERSION {
        ts_format = '1'
    }

    // 插件内部的配置项，不在各端同步
    type Inner_Setting = {
        _syncClipboard?: boolean
        _syncPage?: boolean,
        _syncLight?: boolean,
        _syncSnapshot?: boolean,
        [key: string]: string | boolean | any
    }

    // 可在各端同步的设置
    export type COMMON_SDK_SETTING =  {
        lastModified?: number, // TODO 删除
        brushes: Brush[],

        // TODO 删除 提取至一级目录下
        actions: Action[],
        disableList?: string[],
        controlC?: boolean,
        convertMethods?: ConvertMethod[], // TODO 删除

        showBarTimeout: number,
        keyupTimeout: number,
    }

    export type SDK_SETTING = Inner_Setting & COMMON_SDK_SETTING

    /**搜索引擎*/
    export type ISearchEngine = {
        type?: string, // 搜索引擎类别，如baidu\google
        needPreResolveLink?: boolean, // 是否需要前置解析搜索结果。如百度需要（需要请求百度API才能得知真正的URL），Google 不需要
        resultItemSelector?: string, // 搜索结果一条数据节点选择器
        linkSelector?: string, // 获取链接对象，默认 a

        linkDataSetAttr?: string, // 可以从 dataset 中直接获取的URL 熟悉
        appendRootSelector?: string, // 向页面中，植入元素的根节点
        queryKey?: string, // 从URL中获取搜索词的，键值

        inputSelector?: string // 从DOM中获取搜索词的元素 input 节点
        checkRules: string[], // 检测当前某个URL是否符合当前搜索引擎配置
    }

    export interface response {

        // 获取用户可用配置
        getUserSetting: IExtenstionMessageListener<void, SDK_SETTING>
        // 本地设置存储
        getSetting: IExtenstionMessageListener<void, SDK_SETTING>
        saveSetting: IExtenstionMessageListener<Partial<SDK_SETTING>, SDK_SETTING>
        resetSetting: IExtenstionMessageListener<void, SDK_SETTING>

        //@deprecated
        getSearchEngines: IExtenstionMessageListener<void, ISearchEngine[]>

        [key: string]: IExtenstionMessageListener<any, any>
    }

    export type request = ComputeRequestToBackground<response>


}

export namespace browserAction {
    export const id = 'browserAction'

    // 浏览器图标样式描述
    export enum ActionImageType {
        enable = 'images/light-32.png',
        disable = 'images/light-disable.png',
    }

    export type BadgeProps = {
        icon?: string,
        text?: string,
        color?: string,
        title?: string,
        popup?: string,
    }

    type ActionClickParams = { onclick: (tab: chrome.tabs.Tab) => void, tabId?: number }
    type DisplayParams = { info: Partial<BadgeProps>, tabId?: number }

    export type response = {
        setBrowserActionDisplay: IExtenstionMessageListener<DisplayParams, BadgeProps>
        setBrowserActionClick: IExtenstionMessageListener<ActionClickParams, BadgeProps | undefined>
        getBrowserActionInfo: IExtenstionMessageListener<{ tabId?: number }, BadgeProps>
        [key: string]: IExtenstionMessageListener<any, any>
    }
    export type request = ComputeRequestToBackground<response>
}

export namespace action {
    import CaptureVisibleTabOptions = chrome.tabs.CaptureVisibleTabOptions;
    import AlarmCreateInfo = chrome.alarms.AlarmCreateInfo;
    import Tab = chrome.tabs.Tab;
    import QueryInfo = chrome.tabs.QueryInfo;
    import TabGroup = chrome.tabGroups.TabGroup;
    export const id = 'action'

    export interface injectParams {
        tabId?: number
        scripts: string[],
        css: string[],
        allFrames: boolean,
    }

    export interface ClipboardItem {
        text: string,
    }


    export type ScheduleTask = {
        terminal: string
        params: any
    } & AlarmCreateInfo

    export type response = {
        injectCodeToPage: IExtenstionMessageListener<injectParams, boolean>
        track: IExtenstionMessageListener<[category: string, eventAction: string, eventLabel: string, eventValue: number, page?: string], void>
        report: IExtenstionMessageListener<{ errorInfo: any }, void>
        captureView: IExtenstionMessageListener<CaptureVisibleTabOptions, string>
        // injectToFrontPage: IExtenstionMessageListener<{ url: string, isIframe: boolean }, string>
        usage: IExtenstionMessageListener<void, { storageSize: number }>

        getMemoryRuntime: IExtenstionMessageListener<string, any>
        setMemoryRuntime: IExtenstionMessageListener<Record<string, any>, any>

        /**持久化的存储*/
        getPersistentValue: IExtenstionMessageListener<string, any>
        setPersistentValue: IExtenstionMessageListener<{ key: string, value: any }, boolean>

        // backup: IExtenstionMessageListener<{dataTypes: BackupDataType[]}, BackupData>
        // backupList: IExtenstionMessageListener<{ dataType: BackupDataType, projectionField?: string }, BackupData[]>

        addScheduleTask: IExtenstionMessageListener<ScheduleTask, number>

        /**防止重复打开新标签*/
        openTab: IExtenstionMessageListener<{ url: string, reUse: boolean, tab: { tabId?: string | number, windowId?: string | number, groupInfo?: Partial<TabGroup> } }, { tab: Tab }>

        // getCurrentTab: IExtenstionMessageListener<void, Tab>
        queryTabs: IExtenstionMessageListener<QueryInfo, Tab[]>

        [key: string]: IExtenstionMessageListener<any, any>
    }

    export type request = ComputeRequestToBackground<response>
}

export namespace actions{
    export const id = 'actions'
    export type response = {
        runYaml: IExtenstionMessageListener<{ yaml: string } | {id: string}, { run_names: string[] }>
        callAction: IExtenstionMessageListener<{
            uses: string,
            with: any
        }, any>
    }
    export type request = ComputeRequestToBackground<response>
}

export namespace developer {
    import TabGroup = chrome.tabGroups.TabGroup;
    import Tab = chrome.tabs.Tab;
    export const id = 'developer'

    export enum LogLevel {
        DEBUG = 'debug',
        INFO = 'info',
        WARN = 'warn',
        ERROR = 'error',
    }

    export interface LogInfo<T = any> {
        id?: string;
        createAt: number,
        level: LogLevel | string,
        namespace: string,
        stack?: string,  // TODO 删除
        meta?: T, // TODO 删除
        version: string
        json?: Record<string, any>
        message?: string,
        tag?: 'remove' | 'add' | 'action' | string
    }

    export interface Permission {
        namespace: string;
        granted: boolean;
        description: string;
        domain: string;
    }

    export type RequestBackProxyRequest = {
        namespace: string //命名空间
        type: string, // 方法名称
        params: any // 请求参数
        header?: Partial<BaseMessageHeader>,
    }

    export type response = {
        log: IExtenstionMessageListener<LogInfo, string>
        logs: IExtenstionMessageListener<Find<LogInfo>, FindResponse<Partial<LogInfo>>>

        downloadLog: IExtenstionMessageListener<Query<LogInfo>, { filename: string }>

        permissionList: IExtenstionMessageListener<{ granted?: boolean }, Permission[]>
        requestPermission: IExtenstionMessageListener<{ namespace?: string }, boolean>

        /**请求前台标签页*/
        requestFront: IExtenstionMessageListener<{
            type: keyof frontApi.response,
            header?: Partial<BaseMessageHeader>,
            params: unknown
        }, unknown>

        /**请求后台，不推荐使用，用于未被定义的接口请求或已经下线的接口请求*/
        requestBack: IExtenstionMessageListener<RequestBackProxyRequest, any>

        /**代理执行浏览器插件方法*/
        chrome: IExtenstionMessageListener<{
            namespace: string,
            /**@deprecated 使用 method 代替*/
            type?: string,
            method: string,
            arguments: any[],
            /**@deprecated 使用 arguments 代替*/
            args?: any[]
        }, any>

        store: IExtenstionMessageListener<{ key: string,value: string }, void>
        watch: IExtenstionMessageListener<{ event: 'storage' | string, key: string }, {key: string, value: string}>

        /**打开标签页*/
        openTab: IExtenstionMessageListener<{ url: string, reUse: boolean, tab: { tabId?: string | number, windowId?: string | number, groupInfo?: Partial<TabGroup> } }, { tab: Tab }>

        [key: string]: IExtenstionMessageListener<any, any>
    }

    export type request = ComputeRequestToBackground<response>
}

export namespace user {
    export const id = 'user'

    export enum ExtensionPlatform {
        Chrome = 'chrome',
        Edge = 'edge',
        SAFARI = 'safari',
        Firefox = 'firefox',
        San60 = '360',
        OFFLINE = 'offline',
        TEST = 'test'
    }

    export type WhoAmI = {
        origin?: string,
        extensionId?: string,
        name?: string,
        version?: string,
        mainVersion?: string,// 主要版本
        short_name?: string,
        browserType?: BrowserType,
        browserVersion?: string,
        extensionPlatform?: ExtensionPlatform,
        extensionDetailUrl?: string, // 插件详情页
        extensionStoreUrl?: string, // 插件应用商店地址
        extensionShortcutUrl?: string // 快捷键管理页
        chromeConnected?: boolean
        language?: string,
        isCN?: boolean,
        isMac?: boolean,
        isFirefox?: boolean, // Firefox 浏览器判断，需要做兼容性处理
        isEdge?: boolean
        isTest?: boolean,
        did?: string, // 客户端的标识 did 不可变更
        sec_did?: string
        supportSDK?: string[],
    }

    export interface User {
        profile?: {
            pro?: number
            role: number,
            nickname?: string,
            emailMask?: string;
            developer?: number;
            avatar?: string;
            uid: number;
        },
        verify?: {
            exp?: number
            iat?: number
            leftDay?: number
            percent?: number
            newToken?: string
        },
        expiredTip?: string
    }

    export interface Device {
        did: string,
        name?: string,
        version: string,
        platform: string,
        browser: string,
        registerAt?: Date,
        updateAt: number,
        createAt?: number,
    }

    export interface response {
        getWhoAmI: IExtenstionMessageListener<void, WhoAmI>,
        getUser: IExtenstionMessageListener<{ refresh?: boolean }, User | undefined>,
        getDeviceList: IExtenstionMessageListener<{ did?: string }, Device[]>

        [key: string]: IExtenstionMessageListener<any, any>
    }

    export type request = ComputeRequestToBackground<response>
}

export namespace localdir {
    export const id = 'localdir'

    export interface response {
        readPagesFrontDir: IExtenstionMessageListener<any, number>
        requestPermission: IExtenstionMessageListener<void, string>

        [key: string]: IExtenstionMessageListener<any, any>
    }

    export type request = ComputeRequestToBackground<response>
}


export namespace network {
    export const id = 'network';

    export interface FetchRequest extends RequestInit {
        url: string,
        data?: {
            query?: string,
            mutation?: string,
            variables?: Record<string, any>
            [key: string]: any,
        },
        method: "GET" | "POST" | "PUT" | "DELETE"

        credentials?: RequestCredentials
        cache?: RequestCache
        headers?: Record<string, string>
    }

    export interface FetchResponse extends ResponseInit {
        readonly json?: any,
        readonly body?: any,
        readonly config?: Record<string, any>
        readonly headers?: Record<string, any>,
        readonly status: number;
        readonly statusText: string;

        readonly ok: boolean;
        readonly redirected: boolean;
        // readonly type: ResponseType;
        readonly url: string;
    }

    export interface response {
        pagenote: IExtenstionMessageListener<FetchRequest, FetchResponse>
        /**@deprecated 请使用 http*/
        fetch: IExtenstionMessageListener<FetchRequest, FetchResponse>

        // notion: IExtenstionMessageListener<{
        //     namespace: string,
        //     method: string,
        //     args: any[]
        // }, any>


        /**请求第三方开放平台，与 fetch 相比，会增加鉴权，授权 token 信息至 请求 header 中*/
        openApi: IExtenstionMessageListener<FetchRequest, FetchResponse>
        // todo 设置为 http actions
        http: IExtenstionMessageListener<FetchRequest, FetchResponse>

        // state: IExtenstionMessageListener<void, {
        //     online: boolean
        //     google: boolean
        // }>

        [key: string]: IExtenstionMessageListener<any, any>
    }

    export type request = ComputeRequestToBackground<response>
}

/**占位  stat 字段，用于标识数据的状态，合法、非法、删除等状态，使用字符串类型，可用于建立索引 待 28版本后启动此字段*/
export type TableSchemaBasicFields = {
    key?: string
    deleted?: boolean,
    updateAt?: number,
    createAt?: number,
    [key: string]: boolean | number | string | string[] | any, // todo 删除 any
}
export interface TableStat {
    usage: number // 占用空间
    size: number // 数据条数
    quota: number // 总空间
}

// @deprecated 废弃
export type TableAPI<Schema extends TableSchemaBasicFields> = {
    init: IExtenstionMessageListener<Schema, boolean> //初始化表格、等

    /**新增或更新（批量导入）已有数据*/
    put: IExtenstionMessageListener<Schema[], string[]>
    /**彻底删除数据，保证安全性，不会误删，不支持条件删除，只可传入指定唯一键进行删除*/
    remove: IExtenstionMessageListener<string[], number>
    /**支持按条件的更新；*/
    update: IExtenstionMessageListener<{query:Query<Schema>,data: Partial<Schema>}, number>
    /**按条件查询数据*/
    query: IExtenstionMessageListener<Find<Schema>, FindResponse<Partial<Schema>>>

    /***计数*/
    count: IExtenstionMessageListener<Query<Schema>, number>

    /**获取全量摘要*/
    abstract: IExtenstionMessageListener<void, Record<string, AbstractInfo>>

    /**聚合数据，*/
    group: IExtenstionMessageListener<{ groupBy: keyof Schema, query?: Query<Schema>, projection?: Projection<Schema> }, Record<string, Partial<Schema>[]>>

    /**
     * 表信息摘要
     * */
    stat: IExtenstionMessageListener<void,TableStat>
}


type RequestParamsWithDBInfo<params> = {
    db?: string,
    table: string
    params: params
}

export type CommonTableApi<Schema extends TableSchemaBasicFields> = {
    /**新增或更新（批量导入）已有数据*/
    put: IExtenstionMessageListener<RequestParamsWithDBInfo<Schema[]>, string | string[]>
    /**彻底删除数据，保证安全性，不会误删，不支持条件删除，只可传入指定唯一键进行删除*/
    remove: IExtenstionMessageListener<RequestParamsWithDBInfo<string[]>, number>
    /**支持按条件的更新；*/
    update: IExtenstionMessageListener<RequestParamsWithDBInfo<{keys: string[],data: Partial<Schema>, upsert?: boolean}>, number>
    /**按条件查询数据*/
    query: IExtenstionMessageListener<RequestParamsWithDBInfo<Find<Schema>>, FindResponse<Partial<Schema>>>

    get: IExtenstionMessageListener<RequestParamsWithDBInfo<string>, Schema| null>
    /**检索索引枚举值*/
    keys: IExtenstionMessageListener<RequestParamsWithDBInfo<{key: keyof Schema}>, (string | number)[]>

    /***计数*/
    count: IExtenstionMessageListener<RequestParamsWithDBInfo<Query<Schema>>, number>
    /**获取全量摘要*/
    abstract: IExtenstionMessageListener<RequestParamsWithDBInfo<void>, Record<string, AbstractInfo>>
    /**聚合数据，*/
    group: IExtenstionMessageListener<RequestParamsWithDBInfo<{ groupBy: keyof Schema, query?: Query<Schema>, projection?: Projection<Schema> }>, Record<string, Partial<Schema>[]>>
    /** 表信息摘要*/
    stat: IExtenstionMessageListener<RequestParamsWithDBInfo<void>,TableStat>
}

export namespace table {
    export const id = 'table';
    export type response = CommonTableApi<TableSchemaBasicFields>
    export type request = ComputeRequestToBackground<response>
}

export namespace config {
    export const id = 'config';
    type ConfigRootValue = string | number | boolean | any;
    export type ConfigValue = ConfigRootValue | Record<string, ConfigRootValue>
    export type ConfigItem = {
        key: string,    // cloud.host
        rootKey: string, // cloud
        value: ConfigValue,  // https://api.pagenote.cn
        updateAt?: number,
    }
    export type ConfigObject = Record<string, ConfigValue>
}

// export namespace page {
//     export const id = 'page';
//     export type response = TableAPI<WebPage>
//     export type request = ComputeRequestToBackground<response>
// }
//
// export namespace light {
//     export const id = 'light';
//     export type response = TableAPI<Step>
//     export type request = ComputeRequestToBackground<response>
// }

export namespace html {
    export type OfflineHTML = {
        dataVersion: number, // 数据格式版本标识 1: 已将重要property 写入 html meta 中
        resourceId?: string, // 插件本地获取该资源的唯一标识

        name?: string, // 文件名

        description?: string

        icon?: string // 图标

        originUrl: string // 原始资源对应的链接地址，可能会无法访问的资源
        onlineUri?: string // 可联网被访问的链接；可能是基于 originUrl 处理上传云盘、图床的二次生成链接。相对稳定的资源。

        contentType?: ContentType, // 文件类型
        // contentLength?: number, // 资源size
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
    export const id = 'html';
}

export namespace box {
    export const id = 'box';
    export type Box = {
        id: string, // 资源ID，非指定情况下md5值
        boxType?: string, // 资源类型
        from?: string, // 来源
        createAt?: number, // 来源
        updateAt: number,
        expiredAt?: number,
        type?: string,
        text?: string,
        did?: string
        version?: string
        icon?: string
        domain?: string
        deleted: boolean
    }
}

export namespace snapshot {
    export const id = 'snapshot';
}


// 前端页面作为服务端的请求集合
export namespace frontApi {
    import OfflineHTML = html.OfflineHTML;
    export const id = 'front-server'

    export type TabStat = {
        connected: boolean,
        active: boolean,
        url: string
        enabledCopy: boolean

        disabled?: boolean // 被禁用状态

        isOfflineHTML: boolean, // 是否为离线网页

        title: string
        description: string
        keywords: string[]
        abstract?: string
    }

    export type OfflineOption = {
        cssInLine: boolean, // 将样式文件全部 inline 处理
        disableScript: boolean, // 禁止script脚本
        imageInLine: boolean, // 将图片inline 处理
        offlineImg: boolean, // 将图片资源本地化存储处理
    }

    export type response = {
        runCaptureTab: IExtenstionMessageListener<{fullPage: boolean }, string>
        mark_image: IExtenstionMessageListener<chrome.contextMenus.OnClickData, string>
        record: IExtenstionMessageListener<chrome.contextMenus.OnClickData, number>
        injectOriginScripts: IExtenstionMessageListener<{ scripts: string[] }, string>
        toggleAllLight: IExtenstionMessageListener<void, boolean>
        togglePagenote: IExtenstionMessageListener<void, boolean>
        makeHTMLSnapshot: IExtenstionMessageListener<void, { html: string, key: string }>
        fetchStatus: IExtenstionMessageListener<void, TabStat>
        // 通知刷新数据
        refresh: IExtenstionMessageListener<{ changes: { key?: string, url?: string, type?: 'page' | 'light' | string }[] }, void>

        offlineHTML: IExtenstionMessageListener<OfflineOption, Partial<OfflineHTML>>

        // 在标签页启用 pagenote
        start: IExtenstionMessageListener<{ tabId: string }, { injected: boolean }>
        [key: string]: IExtenstionMessageListener<any, any>
    }

    export type request = ComputeRequestToFront<response>
}
