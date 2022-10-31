import {BackupData, BackupDataType, FileData, ResourceInfo, Step, WebPage} from "./@types/data";
import {Find, FindResponse, Pagination, Query} from "./@types/database";
import {
    BaseMessageHeader,
    BaseMessageResponse,
    IBaseMessageListener,
    IExtenstionMessageListener
} from "./communication/base";
import {AxiosRequestConfig, AxiosResponse} from "axios";
import {Action, ACTION_TYPES} from "./pagenote-actions/@types";
import {ConvertMethod, getDefaultConvertMethod} from "./pagenote-convert";
import {Brush, getDefaultBrush, LightStatus, LightType} from "./pagenote-brush";
import {createInitAction} from "./pagenote-actions";

type ComputeRequestToBackground<Funs extends Record<string, IBaseMessageListener<any, any, any>>> = {
    [fun in keyof Funs]: {
        (arg: Parameters<Funs[fun]>[0],header?: Partial<BaseMessageHeader>): Promise<Parameters<Parameters<Funs[fun]>[2]>[0]>
    }
}

type ComputeRequestToFront<Funs extends Record<string, IBaseMessageListener<any, any, any>>> = {
    [fun in keyof Funs]: {
        (arg: Parameters<Funs[fun]>[0], tabId?: number): Promise<Parameters<Parameters<Funs[fun]>[2]>[0]>
    }
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

export namespace boxroom {
    export const id = 'boxroom'
    export type BoxItem = {
        id?: string, // 资源ID，非指定情况下md5值
        boxType?: string, // 资源类型
        from?: string, // 来源
        createAt?: number, // 来源
        expiredAt?: number,
        type?: string,
        text?: string,
        did?: string
        version?: string
        icon?: string
        domain?: string
    }

    // 索引
    export type BoxKeys = {
        id: string,
        createAt: number,
        from: string,
        boxType: string
    }

    export type response = {
        get: IExtenstionMessageListener<Find<BoxKeys>, BoxItem[]>,
        save: IExtenstionMessageListener<Partial<BoxItem>, BoxItem>,
        update: IExtenstionMessageListener<Partial<BoxItem>, BoxItem>
        remove: IExtenstionMessageListener<Partial<boxroom.BoxItem>, void>,
        syncStat: IExtenstionMessageListener<{ sync: boolean }, SyncStat>
        [key: string]: IExtenstionMessageListener<any, any>
    }

    export type request = ComputeRequestToBackground<response>
}

export namespace lightpage {
    export const id = 'lightpage';

    // 索引字段
    export type WebPageKeys = {
        key: string,
        deleted: boolean,
        domain: string,
        icon: string,
        path: string,
        text: string,
        tip: string,
        context: string,
        title: string,
        description: string;
        categories: string[],
        category: string,
        createAt: number,
        updateAt: number,
        expiredAt: number,
        basename: string,
        lastmod: string,
        etag: string,
        lightCnt: number, // 高亮个数
        colors: string[],
        score: number,
        thumb: string,
        isEmpty: boolean,
        directory: string // 存放目录
    }


    // 服务端可接受的请求API
    export type response = {
        /**旧 API start 待删除 0.24 之后不支持**/
        saveLightPage: IExtenstionMessageListener<Partial<WebPage>, WebPage | null>,
        removeLightPage: IExtenstionMessageListener<{ key: string }, number>,
        removeLightPages: IExtenstionMessageListener<string[], number>
        /**查询列表pages*/
        getLightPages: IExtenstionMessageListener<Find<WebPageKeys>, { pages: WebPage[] | WebPageKeys[], pagination: Pagination }>,
        getLightPageDetail: IExtenstionMessageListener<Query<WebPageKeys>, WebPage | null>,
        // 导出pages
        exportPages: IExtenstionMessageListener<void, string>
        // 导入pages，只能插件内使用，数量太大，可能通讯失败
        importPages: IExtenstionMessageListener<BackupData | string, number>,
        /** 旧 API end*/

        // 页面操作
        addPages: IExtenstionMessageListener<WebPage[], number>
        removePages: IExtenstionMessageListener<{ keys: string[] }, number>
        updatePages: IExtenstionMessageListener<Partial<WebPage>[], number>
        queryPages: IExtenstionMessageListener<Find<WebPage>, FindResponse<Partial<WebPage>>>
        groupPages: IExtenstionMessageListener<{ groupBy: keyof WebPageKeys, query?: Query<WebPageKeys> }, Record<string, Partial<WebPage>[]>>,

        // 标记操作
        addLights: IExtenstionMessageListener<Step[], number>;
        removeLights: IExtenstionMessageListener<{ keys: string[] }, number>;
        updateLights: IExtenstionMessageListener<Partial<Step>[], number>;
        queryLights: IExtenstionMessageListener<Find<Step>, FindResponse<Partial<Step>>>;

        syncStat: IExtenstionMessageListener<{ sync: boolean }, SyncStat>
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
        _libra?: boolean, // 是否开启实验功能
        _sync?: boolean, // 是否在各端之间同步设置
        _supportVersions?: string[], // 当前支持SDK的版本列表
        _sdkVersion: string, // 当前使用的 SDK 版本
    }

    export type SDK_SETTING = Inner_Setting & {
        lastModified: number,
        brushes: Brush[],
        copyAllowList: string[],
        commonSetting: {
            maxRecord: number,
            showBarTimeout: number,
            keyupTimeout: number,
            removeAfterDays: number,
        },
        actions: Action[],
        disableList: string[],
        controlC: boolean,
        autoBackup: number, // 自动备份周期
        enableMarkImg: boolean,
        convertMethods: ConvertMethod[],
        dataVersion: SDK_VERSION,
        useRecommend: boolean
    }

    export interface response {
        // 获取用户可用配置
        getUserSetting: IExtenstionMessageListener<void, SDK_SETTING>
        // // 同步云端设置
        // syncSetting: IExtenstionMessageListener<void, SDK_SETTING>
        // 本地设置存储
        getSetting: IExtenstionMessageListener<void, SDK_SETTING>
        saveSetting: IExtenstionMessageListener<Partial<SDK_SETTING>, SDK_SETTING>
        resetSetting: IExtenstionMessageListener<void, SDK_SETTING>

        [key: string]: IExtenstionMessageListener<any, any>
    }

    export type request = ComputeRequestToBackground<response>

    export function getDefaultSdkSetting(originSetting: Partial<SDK_SETTING> = {}): SDK_SETTING {
        const defaultBrushes = [
            getDefaultBrush({
                bg: '#FFFF83',
            }),
            getDefaultBrush({
                bg: '#A6FFE9',
                label: '删除线',
                lightType: LightType.deleteLine,
                defaultStatus: LightStatus.un_light
            }),
            getDefaultBrush({
                bg: '#FFC7BA',
                defaultStatus: LightStatus.full_light
            }),
            getDefaultBrush({
                bg: '#B8EEFF',
                defaultStatus: LightStatus.half_light
            }),
            getDefaultBrush({
                bg: '#FFD0EF',
                defaultStatus: LightStatus.half_light
            }),
            getDefaultBrush({
                bg: '#D9C3FF',
                defaultStatus: LightStatus.half_light
            }),
            getDefaultBrush({
                bg: '#a64db4',
                defaultStatus: LightStatus.half_light
            }),
            getDefaultBrush({
                bg: '#195772',
                defaultStatus: LightStatus.half_light
            }),
            getDefaultBrush({
                bg: '#4467a8',
                defaultStatus: LightStatus.half_light
            }),
        ]
        const setting: SDK_SETTING = {
            // _libra: false,
            // _sync: false,
            actions: [createInitAction(ACTION_TYPES.search), createInitAction(ACTION_TYPES.copyToClipboard), createInitAction(ACTION_TYPES.send_to_email)],
            autoBackup: 3600 * 24 * 7,
            brushes: defaultBrushes,
            commonSetting: {
                keyupTimeout: 0,
                maxRecord: 999,
                removeAfterDays: 30,
                showBarTimeout: 0
            },
            controlC: true,
            copyAllowList: [],
            disableList: [],
            enableMarkImg: false,
            convertMethods: [getDefaultConvertMethod()],
            lastModified: 0,
            dataVersion: SDK_VERSION.ts_format,
            useRecommend: true,
            _sdkVersion: "5.5.3",
        }
        return {
            ...setting,
            ...originSetting
        }
    }
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

    export interface LogInfo<T=any> {
        id?: string;
        createAt: number,
        level: string,
        namespace: string,
        stack: string,
        meta?: T,
        version: string
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

        backup: IExtenstionMessageListener<{dataTypes: BackupDataType[]}, BackupData>
        backupList: IExtenstionMessageListener<{ dataType: BackupDataType, projectionField?: string }, BackupData[]>

        log: IExtenstionMessageListener<LogInfo, string>
        logs: IExtenstionMessageListener<Find<LogInfo>, FindResponse<Partial<LogInfo>>>

        addScheduleTask: IExtenstionMessageListener<ScheduleTask, number>
        [key: string]: IExtenstionMessageListener<any, any>
    }

    export type request = ComputeRequestToBackground<response>
}

export namespace user {
    export const id = 'user'
    export type WhoAmI = {
        origin: string,
        extensionId: string,
        name: string,
        version: string,
        mainVersion: string,// 主要版本
        short_name: string,
        browser: string,
        browserVersion: string,
        browserPlatform: string,
        platform: string,
        language: string,
        isCN: boolean,
        isMac: boolean,
        isTest: boolean,
        did: string, // 客户端的标识 did 不可变更
        supportSDK: string[],
    }

    export interface User {
        profile?: {
            pro: number,
            seed: number,
            nickname?: string,
            maskEmail?: string;
        },
        verify?:{
            exp?: number
            iat?: number
        }
    }

    export interface Device {
        did: string,
        name?: string,
        version: string,
        platform: string,
        browser: string,
        registerAt?: Date,
    }

    export interface response {
        getWhoAmI: IExtenstionMessageListener<void, WhoAmI>,
        getUser: IExtenstionMessageListener<void, User | undefined>,

        // 使用 exchangeToken
        setUserToken: IExtenstionMessageListener<string, string>
        // 使用 exchangeToken
        getUserToken: IExtenstionMessageListener<void, string>

        // 当前设备信息
        setDevice: IExtenstionMessageListener<Partial<Device>, Device>
        getDevice: IExtenstionMessageListener<void, Device>
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

        [key: string]: IExtenstionMessageListener<any, any>
    }

    export type request = ComputeRequestToBackground<response>
}

export namespace network {
    export const id = 'network';
    export interface response {
        pagenote: IExtenstionMessageListener<AxiosRequestConfig, AxiosResponse>
        axios: IExtenstionMessageListener<AxiosRequestConfig, AxiosResponse>
        fetch: IExtenstionMessageListener<{input: ResourceInfo | URL, init?: RequestInit}, Response & {json?: any, text?: string}>
        [key: string]: IExtenstionMessageListener<any, any>
    }

    export type request = ComputeRequestToBackground<response>
}


// 前端页面作为服务端的请求集合
export namespace frontApi {
    export const id = 'front-server'
    export type response = {
        onCaptureView: IExtenstionMessageListener<{ imageStr: string, isAuto?: boolean }, string>
        mark_image: IExtenstionMessageListener<chrome.contextMenus.OnClickData, string>
        record: IExtenstionMessageListener<chrome.contextMenus.OnClickData, number>
        injectOriginScripts: IExtenstionMessageListener<{ scripts: string[] }, string>
        toggleAllLight: IExtenstionMessageListener<void, boolean>
        togglePagenote: IExtenstionMessageListener<void, boolean>
        makeHTMLSnapshot: IExtenstionMessageListener<void, { html: string, key: string }>
        fetchStatus: IExtenstionMessageListener<void, { connected: boolean, active: boolean }>
        // 通知刷新数据
        refresh: IExtenstionMessageListener<void, void>
        [key: string]: IExtenstionMessageListener<any, any>
    }

    export type request = ComputeRequestToFront<response>
}
