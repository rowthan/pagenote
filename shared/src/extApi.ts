import type {
    BackupData,
    SnapshotResource,
    ResourceInfo,
    Step,
    WebPage,
    ContentType,
    Note,
} from "./@types/data";
import type {Find, FindResponse, Projection, Query} from "./@types/database";
import type {
    BaseMessageHeader,
    BaseMessageResponse,
    IBaseMessageListener,
    IExtenstionMessageListener
} from "./communication/base";
import type {Action} from "./pagenote-actions/@types";
import type {ConvertMethod} from "./pagenote-convert";
import type {Brush} from "./pagenote-brush";
import type {BrowserType} from "./utils/browser";
import {AbstractInfo} from "./library/syncStrategy";

type ComputeRequestToBackground<Funs extends Record<string, IBaseMessageListener<any, any, any>>> = {
    [fun in keyof Funs]: {
        (arg: Parameters<Funs[fun]>[0], header?: Partial<BaseMessageHeader>): Promise<Parameters<Parameters<Funs[fun]>[2]>[0]>
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
    import OfflineHTML = html.OfflineHTML;
    export const id = 'lightpage';

    type PartWebpage = Partial<WebPage>
    type PartStep = Partial<Step>

    export type ExportFilter = { pageFilter?: Query<WebPage>, lightFilter?: Query<Step>, snapshotFilter?: Query<SnapshotResource>, htmlFilter?: Query<OfflineHTML> }

    // 服务端可接受的请求API TODO 合并 light page snapshot 接口，
    export type response = {
        // 1.页面
        addPages: IExtenstionMessageListener<WebPage[], string[]>
        removePages: IExtenstionMessageListener<{ keys: string[], removeRelated?: ('light' | 'snapshot')[] }, number>
        updatePages: IExtenstionMessageListener<PartWebpage[], number>
        queryPages: IExtenstionMessageListener<Find<WebPage>, FindResponse<PartWebpage>>
        groupPages: IExtenstionMessageListener<{ groupBy: keyof WebPage, query?: Query<WebPage>, projection?: Projection<WebPage> }, Record<string, PartWebpage[]>>,

        // 2.标记 TODO 待删除
        addLights: IExtenstionMessageListener<Step[], string[]>;
        removeLights: IExtenstionMessageListener<{ keys: string[] }, number>;
        updateLights: IExtenstionMessageListener<PartStep[], number>;
        queryLights: IExtenstionMessageListener<Find<Step>, FindResponse<PartStep>>;
        groupLights: IExtenstionMessageListener<{ groupBy: keyof Step, query?: Query<Step>, projection?: Projection<Step> }, Record<string, PartStep[]>>,

        // 3.截图快照
        // addSnapshots: IExtenstionMessageListener<SnapshotResource[], string[]>
        // removeSnapshots: IExtenstionMessageListener<{ keys: string[] }, number>
        // querySnapshots: IExtenstionMessageListener<Find<SnapshotResource>, FindResponse<Partial<SnapshotResource>>>

        /**单次请求对网页、标记、快照总体的存储（增量存储）*/
        saveLightPage: IExtenstionMessageListener<PartWebpage, WebPage | null>,
        /**查询网页携带的全量数据： 网页、标记、快照*/
        getLightPageDetail: IExtenstionMessageListener<{ key: string }, WebPage | null>,

        // TODO import export 独立至 common 中
        /**download 导出备份文件*/
        exportBackup: IExtenstionMessageListener<ExportFilter, { filename: string, }>

        /**导入备份文件**/
        importBackup: IExtenstionMessageListener<{ backupData: BackupData }, { lightCnt: number, pageCnt: number, snapshotCnt: number, htmlCnt: number }>

        // TODO 删除
        syncStat?: IExtenstionMessageListener<{ sync: boolean }, SyncStat>
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

    export type ExtConfigItem = Record<string, string>

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

        // todo 删除以下
        // 获取用户可用配置
        getUserSetting: IExtenstionMessageListener<void, SDK_SETTING>
        // 本地设置存储
        getSetting: IExtenstionMessageListener<void, SDK_SETTING>
        saveSetting: IExtenstionMessageListener<Partial<SDK_SETTING>, SDK_SETTING>
        resetSetting: IExtenstionMessageListener<void, SDK_SETTING>


        saveConfig: IExtenstionMessageListener<ExtConfigItem, ExtConfigItem>
        queryConfig: IExtenstionMessageListener<Query<{ key: string }>, ExtConfigItem>
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
        copyToClipboard: IExtenstionMessageListener<ClipboardItem, ClipboardItem>
        injectToFrontPage: IExtenstionMessageListener<{ url: string, isIframe: boolean }, string>
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

        getCurrentTab: IExtenstionMessageListener<void, Tab>
        queryTabs: IExtenstionMessageListener<QueryInfo, Tab[]>

        [key: string]: IExtenstionMessageListener<any, any>
    }

    export type request = ComputeRequestToBackground<response>
}

export namespace developer {
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
            params: any
        }, any>

        /**请求后台，不推荐使用，用于未被定义的接口请求或已经下线的接口请求*/
        requestBack: IExtenstionMessageListener<RequestBackProxyRequest, any>

        /**代理执行浏览器插件方法*/
        chrome: IExtenstionMessageListener<{
            namespace: string,
            type: string,
            args?: any[]
        }, any>
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
        language?: string,
        isCN?: boolean,
        isMac?: boolean,
        isFirefox?: boolean, // Firefox 浏览器判断，需要做兼容性处理
        isTest?: boolean,
        did?: string, // 客户端的标识 did 不可变更
        sec_did?: string
        supportSDK?: string[],
    }

    export interface User {
        profile?: {
            pro: number,
            seed: number,
            nickname?: string,
            emailMask?: string;
            developer?: number;
            avatar?: string;
            uid: number;
        },
        verify?: {
            exp?: number
            iat?: number
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

        // signin: IExtenstionMessageListener<{ email: string, uid: number, password: string, token?: string }, boolean>
        // signout: IExtenstionMessageListener<void, boolean>
        // exchange: IExtenstionMessageListener<void, boolean>

        setUserToken: IExtenstionMessageListener<string | null, string>

        // 当前设备信息
        setDevice: IExtenstionMessageListener<Partial<Device>, Device | undefined>
        getDevice: IExtenstionMessageListener<void, Device | undefined>
        getDeviceList: IExtenstionMessageListener<void, Device[]>

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

export namespace fileDB {
    export const id = 'fileDB'
    export const FILE_RESOURCE_HOSTS = ['https://pagenote.cn', 'https://logike.cn']

    export interface response {
        /**新建或更新*/
        saveFile: IExtenstionMessageListener<{ info: ResourceInfo, upsert: boolean }, ResourceInfo | undefined>
        /**查询资源*/
        getFile: IExtenstionMessageListener<Partial<ResourceInfo>, (ResourceInfo & { data: string }) | undefined>
        /**查询资源（不含文件数据）*/
        getFiles: IExtenstionMessageListener<Partial<ResourceInfo>, Omit<ResourceInfo, 'data'>[]>
        /**删除资源*/
        removeFiles: IExtenstionMessageListener<Partial<ResourceInfo>, { deleteCnt: number }>

        /**upload file 至服务端，并返回URL*/
        uploadFile: IExtenstionMessageListener<{ content: string, server: string }, string>;

        [key: string]: IExtenstionMessageListener<any, any>
    }

    export type request = ComputeRequestToBackground<response>
}

export namespace network {
    export const id = 'network';

    export interface FetchRequest extends RequestInit {
        url: string,
        data?: Record<string, any>,
        method: 'GET' | 'POST' | string

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
        fetch: IExtenstionMessageListener<FetchRequest, FetchResponse>

        notion: IExtenstionMessageListener<{
            namespace: string,
            method: string,
            args: any[]
        }, any>

        uploadFile: IExtenstionMessageListener<{ content: string, contentType: ContentType }, string>

        /**请求第三方开放平台，与 fetch 相比，会增加鉴权，授权 token 信息至 请求 header 中*/
        openApi: IExtenstionMessageListener<FetchRequest, FetchResponse>

        state: IExtenstionMessageListener<void, {
            online: boolean
            google: boolean
        }>

        [key: string]: IExtenstionMessageListener<any, any>
    }

    export type request = ComputeRequestToBackground<response>
}

/**占位  stat 字段，用于标识数据的状态，合法、非法、删除等状态，使用字符串类型，可用于建立索引 待 28版本后启动此字段*/
export type TableSchemaBasicFields = {deleted?: boolean, updateAt?: number, stat?:"valid"|"un_valid"|"deleted"}
export type TableAPI<Schema extends TableSchemaBasicFields> = {
    init: IExtenstionMessageListener<Schema, boolean> //初始化表格、等

    stat: IExtenstionMessageListener<void, any> // 状态检测
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
}

export namespace config {
    export const id = 'config';
    export type ConfigObject = { key: string, value: string, updateAt?: number, deleted?: boolean }
    export type response = TableAPI<ConfigObject>
    export type request = ComputeRequestToBackground<response>
}

export namespace page {
    export const id = 'page';
    export type response = TableAPI<WebPage>
    export type request = ComputeRequestToBackground<response>
}

export namespace light {
    export const id = 'light';
    export type response = TableAPI<Step>
    export type request = ComputeRequestToBackground<response>
}

export namespace html {
    export type OfflineHTML = {
        resourceId?: string, // 插件本地获取该资源的唯一标识

        name?: string, // 文件名

        description?: string

        icon?: string // 图标

        originUrl: string // 原始资源对应的链接地址，可能会无法访问的资源
        onlineUri?: string // 可联网被访问的链接；可能是基于 originUrl 处理上传云盘、图床的二次生成链接。相对稳定的资源。

        localUrl?: string // 插件本地直接访问资源的地址，不上传服务器，由插件本地生成；不同插件主机地址不同

        contentType: ContentType, // 文件类型
        contentLength?: number, // 资源size
        lastModified?: string,
        ETag?: string,
        data: string, // 资源内容，只支持字符串存储，不支持二进制数据

        relatedPageKey?: string, //关联的网页key
        relatedPageUrl?: string // 关联的网址

        deleted: boolean,

        // 数据资源的存储时间信息
        visitedAt?: number // 资源访问最后时间
        createAt?: number,
        updateAt: number
    }
    export const id = 'html';
    export type response = TableAPI<OfflineHTML>
    export type request = ComputeRequestToBackground<response>
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
    export type response = TableAPI<Box>
    export type request = ComputeRequestToBackground<response>
}

export namespace snapshot {
    export const id = 'snapshot';
    export type response = TableAPI<SnapshotResource>
    export type request = ComputeRequestToBackground<response>
}

export namespace note {
    export const id = 'note';
    export type response = TableAPI<Note>
    export type request = ComputeRequestToBackground<response>
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
    }

    export type OfflineOption = {
        cssInLine: boolean, // 将样式文件全部 inline 处理
        disableScript: boolean, // 禁止script脚本
        imageInLine: boolean, // 将图片inline 处理
        offlineImg: boolean, // 将图片资源本地化存储处理
    }

    export type response = {
        onCaptureView: IExtenstionMessageListener<{ imageStr: string, isAuto?: boolean }, string>
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
