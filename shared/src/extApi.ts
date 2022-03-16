import {BackupData, WebPage} from "./@types/data";
import {Find, Pagination, Query} from "./@types/database";
import {BaseMessageResponse, IBaseMessageListener, IExtenstionMessageListener} from "./communication/base";
import {AxiosRequestConfig, AxiosResponse} from "axios";
import search from "./pagenote-actions/search";
import {Action, ActionScene, ActionTypes} from "./pagenote-actions/@types";
import {ExportMethod, METHOD_NUM, SchemaType} from "./pagenote-exports";
import {Brush, LightStatus, LightType} from "./pagenote-brush";
type ComputeRequestToBackground<Funs extends Record<string, IBaseMessageListener<any, any, any>>> = {
    [fun in keyof Funs] : {
        (arg:Parameters<Funs[fun]>[0]):Promise<Parameters<Parameters<Funs[fun]>[2]>[0]>
    }
}

type ComputeRequestToFront<Funs extends Record<string, IBaseMessageListener<any, any, any>>> = {
    [fun in keyof Funs] : {
        (arg:Parameters<Funs[fun]>[0],tabId?:number):Promise<Parameters<Parameters<Funs[fun]>[2]>[0]>
    }
}

type ResponseType<T> = T extends BaseMessageResponse<infer R> ? R : T
type ComputeServerResponse<Funs extends Record<string, IRequest<any,any>>> = {
    [fun in keyof Funs]:IExtenstionMessageListener<Parameters<Funs[fun]>[0], ResponseType<ReturnType<Funs[fun]>>>
}

interface IRequest<PARAMS, RESPONSE> {
    (params:PARAMS):BaseMessageResponse<RESPONSE>
}

export namespace boxroom {
    export const id = 'boxroom'
    export type BoxItem = {
        id?: string, // 资源ID，非指定情况下md5值
        boxType?: string, // 资源类型
        data?: {
            text: string,
            type?: any,
        }, // 数据
        from?: string, // 来源
        createAt?: number, // 来源
        expiredAt?: number,
    }

    // 索引
    export type Keys ={
        id: string,
        createAt: number,
        from: string,
        boxType: string
    }

    export type response = {
        get: IExtenstionMessageListener<Find,BoxItem[]>,
        save: IExtenstionMessageListener<Partial<BoxItem>,BoxItem>,
        update: IExtenstionMessageListener<Partial<BoxItem>, BoxItem>
        remove: IExtenstionMessageListener<Partial<boxroom.BoxItem>, void>,
        [key: string]: IExtenstionMessageListener<any, any>
    }

    export type request = ComputeRequestToBackground<response>
}

export namespace lightpage{
    export const id = 'lightpage';

    // 索引字段
    export type Keys = {
        key: string,
        deleted: boolean,
        domain: string,
        icon: string,
        path: string,
        text: string,
        tip: string,
        context: string,
        title: string,
        categories: string[],
        category: string,
        createAt: string,
        updateAt: string,
        updateAtTime: number,
        expiredAt: number,
    }


    // 服务端可接受的请求API
    export type response = {
        saveLightPage: IExtenstionMessageListener<Partial<WebPage>, WebPage>,
        removeLightPage: IExtenstionMessageListener<{key:string}, number>,
        removeLightPages: IExtenstionMessageListener<string[], number>
        /**查询列表pages*/
        getLightPages: IExtenstionMessageListener<Find, {pages:WebPage[],pagination:Pagination}>,
        getLightPageDetail: IExtenstionMessageListener<Query, WebPage>,
        groupPages: IExtenstionMessageListener<any, any>,
        // 导出pages
        exportPages: IExtenstionMessageListener<void, BackupData>
        // 导入pages，只能插件内使用，数量太大，可能通讯失败
        importPages: IExtenstionMessageListener<BackupData, number>,
        [key: string]: IExtenstionMessageListener<any, any>
    }

    export type request = ComputeRequestToBackground<response>
}

export namespace setting{
    export const id = 'setting';

    export enum SDK_VERSION {
        ts_format='1'
    }

    // 插件内部的配置项，不在各端同步
    type Inner_Setting ={
        _libra?: boolean, // 是否开启实验功能
        _sync?: boolean, // 是否在各端之间同步设置
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
        sdkVersion: string,
        exportMethods: ExportMethod[],
        version: SDK_VERSION.ts_format,
    }

    export interface response{
        // 获取用户可用配置
        getUserSetting: IExtenstionMessageListener<void, SDK_SETTING>
        // 同步云端设置
        syncSetting: IExtenstionMessageListener<void, SDK_SETTING>
        // 本地设置存储
        getSetting: IExtenstionMessageListener<void, SDK_SETTING>
        //
        saveSetting: IExtenstionMessageListener<Partial<SDK_SETTING>, SDK_SETTING>
        resetSetting: IExtenstionMessageListener<void,SDK_SETTING>
        [key: string]: IExtenstionMessageListener<any, any>
    }

    export type request = ComputeRequestToBackground<response>

    export function getDefaultSdkSetting(originSetting:Partial<SDK_SETTING>={}):SDK_SETTING {
        const setting : SDK_SETTING = {
            // _libra: false,
            // _sync: false,
            actions: [{
                version: "0.1.0",
                icon: search.icon,
                name: search.name,
                clickUrl: "https://www.baidu.com/s?ie=utf-8&wd=${keyword}",
                shortcut: '',
                clickScript: "",
                customSetting: [{
                    key: '',
                    value: ''
                }],
                actionType: ActionTypes.search,
                scene: ActionScene.text,
            }],
            autoBackup: 3600 * 24 * 7,
            brushes: [{
                bg: "#bdb473",
                label: "",
                level: 1,
                shortcut: "",
                color: "",
                lightType: LightType.highlight,
                defaultStatus: LightStatus.full_light
            }],
            commonSetting: {
                keyupTimeout: 0,
                maxRecord: 999,
                removeAfterDays: 30,
                showBarTimeout: 0
            },
            controlC: true,
            copyAllowList: ["https://www.csdn.net/*"],
            disableList: [
                "https://mubu.com/*",
                "https://notion.so/*",
                "https://www.wolai.com/*",
                "https://shimo.im/*",
                "https://docs.qq.com/*",
                "https://flomoapp.com/*"
            ],
            enableMarkImg: false,
            exportMethods: [{
                name: "导出Markdown至剪切板",
                schema: `## [{{title}}]({{{url}}})
{{#steps}}> * {{text}}

{{#tip}}{{{tip}}}

{{/tip}}{{/steps}}
open in [pagenote.cn](https://pagenote.cn/webpage#/{{encodeUrl}})
    `,
                method: METHOD_NUM.copy,
                schemaType: SchemaType.markdown,
                api: "",
            }],
            lastModified: 0,
            sdkVersion: "0.20.14",
            version: SDK_VERSION.ts_format,
        }
        return {
            ...setting,
            ...originSetting
        }
    }
}

export namespace browserAction{
    export const id='browserAction'
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

    type ActionClickParams = { onclick: (tab:chrome.tabs.Tab)=>void,tabId?: number }
    type DisplayParams = {info:Partial<BadgeProps>,tabId?: number}

    export type response = {
        setBrowserActionDisplay: IExtenstionMessageListener<DisplayParams,BadgeProps>
        setBrowserActionClick: IExtenstionMessageListener<ActionClickParams, BadgeProps|undefined>
        getBrowserActionInfo: IExtenstionMessageListener<{ tabId?: number }, BadgeProps>
        [key: string]: IExtenstionMessageListener<any, any>
    }
    export type request = ComputeRequestToBackground<response>
}

export namespace action{
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

    export type response = {
        injectCodeToPage: IExtenstionMessageListener<injectParams, boolean>
        track: IExtenstionMessageListener<[category:string,eventAction:string,eventLabel:string,eventValue:number,page?:string], void>
        report: IExtenstionMessageListener<{ errorInfo: any }, void>
        axios: IExtenstionMessageListener<AxiosRequestConfig, AxiosResponse | null>
        captureView: IExtenstionMessageListener<null, string>
        copyToClipboard: IExtenstionMessageListener<ClipboardItem, ClipboardItem>
        injectToFrontPage: IExtenstionMessageListener<{url:string,isIframe:boolean}, string>
        usage: IExtenstionMessageListener<void, { storageSize: number }>
        getMemoryRuntime: IExtenstionMessageListener<string, any>
        setMemoryRuntime: IExtenstionMessageListener<Record<string, any>, any>
    }

    export type request = ComputeRequestToBackground<response>
}

export namespace user{
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
        uuid: string, // UUID 可以开放接口由用户自行修改
        did: string, // 客户端的标识 did 不可变更
        supportSDK: string[],
    }

    interface User {
        profile: {
            pro: number,
            seed: number
        },
    }

    export interface response {
        getWhoAmI: IExtenstionMessageListener<void, WhoAmI>,
        getUser: IExtenstionMessageListener<void, User>,
        setUserToken: IExtenstionMessageListener<string, string>
        getUserToken: IExtenstionMessageListener<void, string>
        [key:string]: IExtenstionMessageListener<any, any>
    }

    export type request = ComputeRequestToBackground<response>
}


export namespace localdir{
    export const id = 'localdir'
    export interface response {
        readPagesFrontDir: IExtenstionMessageListener<any, number>
        requestPermission: IExtenstionMessageListener<void, string>

        [key:string]: IExtenstionMessageListener<any, any>
    }

    export type request = ComputeRequestToBackground<response>
}


// 前端页面作为服务端的请求集合
export namespace frontApi{
    export const id = 'front-server'
    export type response = {
        onCaptureView: IExtenstionMessageListener<{ imageStr: string,isAuto?:boolean }, string>
        mark_image: IExtenstionMessageListener<chrome.contextMenus.OnClickData, string>
        record: IExtenstionMessageListener<chrome.contextMenus.OnClickData, number>
        injectOriginScripts: IExtenstionMessageListener<{ scripts:string[] }, string>
        toggleAllLight: IExtenstionMessageListener<void, boolean>
        togglePagenote: IExtenstionMessageListener<void, boolean>
        makeHTMLSnapshot: IExtenstionMessageListener<void, { html: string, key: string }>
        fetchStatus: IExtenstionMessageListener<void, { connected: boolean,active: boolean }>
        [key: string]: IExtenstionMessageListener<any, any>
    }

    export type request = ComputeRequestToFront<response>
}
