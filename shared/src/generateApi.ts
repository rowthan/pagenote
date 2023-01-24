import {
    lightpage,
    boxroom,
    setting,
    browserAction,
    action,
    localdir,
    fileDB,
    user,
    network,
    developer, localResource,
} from "./extApi";
import SessionStorageBridge from "./communication/sessionStorageBridge";
import ExtensionMessage2 from "./communication/ExtenstionBridge";
import {BaseMessageHeader, RESPONSE_STATUS_CODE} from "./communication/base";


const notSupportYet = function () {
    return Promise.resolve({
        success: false,
        error: 'not allowed',
        data: undefined,
        status: RESPONSE_STATUS_CODE.NOT_FOUND,
        statusText: '404'
    })
}

let bridge:any;
const TIMEOUT = 10000;
export const defaultWrapper = function (method:string,targetId:string,clientId: string='default_api_client') {
    return function (request:any,header: Partial<BaseMessageHeader> = {
        targetClientId: targetId
    }) {
        // bridge 运行时初始化，
        if(!bridge){
            // 优先使用 extension runtime message; Edge 普通网页也会有 chrome.runtime 对象、故还需要进一步判断 onMessage
            if(globalThis && globalThis.chrome && chrome.runtime && chrome.runtime.onMessage){
                bridge = new ExtensionMessage2(clientId,{
                    asServer: true,
                    isBackground: false,
                    timeout: TIMEOUT,
                    targetClientId: targetId,
                })
            }else{
                // TODO 优化 sessionBridge 单次请求数据量有上限问题
                bridge = new SessionStorageBridge(clientId,{
                    asServer: true,
                    listenKey: "pagenote-message",
                    timeout: TIMEOUT,
                    targetClientId: targetId,
                })
            }
        }

        return bridge.requestMessage(method,request,{
            requestNamespace: targetId,// 默认请求 targetId 为命名空间，若一个服务下有多个权限控制，如 get\set 可自定义 header 修改
            ...header,
            targetClientId: targetId,
        })
    }
};

export const generateApi = function (wrapperFun=defaultWrapper) {

    const lightpageApi: lightpage.request = {
        importBackup: wrapperFun('importBackup',lightpage.id),
        exportBackup: wrapperFun('exportBackup',lightpage.id),
        addSnapshots: wrapperFun('addSnapshots',lightpage.id),
        groupLights: wrapperFun('groupLights',lightpage.id),
        querySnapshots: wrapperFun('querySnapshots',lightpage.id),
        removeSnapshots: wrapperFun('removeSnapshots',lightpage.id),
        addLights: wrapperFun('addLights',lightpage.id),
        addPages: wrapperFun('addPages',lightpage.id),
        queryPages: wrapperFun('queryPages',lightpage.id),
        removeLights: wrapperFun('removeLights',lightpage.id),
        removePages: wrapperFun('removePages',lightpage.id),
        updateLights: wrapperFun('updateLights',lightpage.id),
        updatePages: wrapperFun('updatePages',lightpage.id),
        queryLights: wrapperFun('queryLights',lightpage.id),
        syncStat: wrapperFun('syncStat',lightpage.id),
        exportPages: wrapperFun('exportPages',lightpage.id),
        importPages: wrapperFun('importPages',lightpage.id),
        getLightPageDetail: wrapperFun('getLightPageDetail',lightpage.id),
        getLightPages: wrapperFun('getLightPages',lightpage.id),
        groupPages: wrapperFun('groupPages',lightpage.id),
        saveLightPage: wrapperFun('saveLightPage',lightpage.id)
    }

    const boxroomApi: boxroom.request = {
        addItems: wrapperFun('addItems',boxroom.id),
        queryItems: wrapperFun('queryItems',boxroom.id),
        removeItems: wrapperFun('removeItems',boxroom.id),
        updateItems: wrapperFun('updateItems',boxroom.id),
        syncStat: wrapperFun('syncStat',boxroom.id),
    }

    const settingApi: setting.request = {
        getSearchEngines: wrapperFun('getSearchEngines',setting.id),
        getSetting: wrapperFun('getSetting',setting.id),
        getUserSetting: wrapperFun('getUserSetting',setting.id),
        resetSetting: wrapperFun('resetSetting',setting.id),
        saveSetting: wrapperFun('saveSetting',setting.id),
        syncSetting: wrapperFun('syncSetting',setting.id)
    }

    const browserActionApi: browserAction.request ={
        setBrowserActionClick: notSupportYet,
        setBrowserActionDisplay: wrapperFun('setBrowserActionDisplay',browserAction.id),
        getBrowserActionInfo: wrapperFun('getBrowserActionInfo',browserAction.id),
    }

    const actionApi: action.request = {
        queryTabs: wrapperFun('queryTabs',action.id),
        getCurrentTab: wrapperFun('getCurrentTab',action.id),
        getPersistentValue: wrapperFun('getPersistentValue',action.id),
        setPersistentValue: wrapperFun('setPersistentValue',action.id),
        openTab: wrapperFun('openTab',action.id),
        addScheduleTask: wrapperFun('addScheduleTask',action.id),
        log: wrapperFun('log',action.id),
        logs: wrapperFun('logs',action.id),
        // backup: wrapperFun('backup',action.id),
        // backupList: wrapperFun('backupList',action.id),
        report: wrapperFun('report',action.id),
        getMemoryRuntime: wrapperFun('getMemoryRuntime',action.id),
        setMemoryRuntime: wrapperFun('setMemoryRuntime',action.id),
        usage: wrapperFun('usage',action.id),
        injectToFrontPage: wrapperFun('injectToFrontPage',action.id),
        copyToClipboard: wrapperFun('copyToClipboard',action.id),
        captureView: wrapperFun('captureView',action.id),
        injectCodeToPage: wrapperFun('injectCodeToPage',action.id),
        track: wrapperFun('track',action.id)
    }

    const fileSystemApi: localdir.request = {
        readPagesFrontDir: wrapperFun('readPagesFrontDir',localdir.id),
        requestPermission: wrapperFun('requestPermission',localdir.id),
    }

    const fileDBApi: fileDB.request = {
        uploadFile: wrapperFun('uploadFile',fileDB.id),
        getFile:  wrapperFun('getFile',fileDB.id),
        removeFiles: wrapperFun('removeFiles',fileDB.id),
        getFiles: wrapperFun('getFiles',fileDB.id),
        saveFile: wrapperFun('saveFile',fileDB.id)
    }

    const userApi: user.request = {
        exchange: wrapperFun('exchange',user.id),
        signin: wrapperFun('signin',user.id),
        signout: wrapperFun('signout',user.id),
        getDevice: wrapperFun('getDevice',user.id),
        getDeviceList: wrapperFun('getDeviceList',user.id),
        setDevice: wrapperFun('setDevice',user.id),
        getUser: wrapperFun('getUser',user.id),
        getUserToken: wrapperFun('getUserToken',user.id),
        getWhoAmI: wrapperFun('getWhoAmI',user.id),
        setUserToken: wrapperFun('setUserToken',user.id)
    }

    const networkApi: network.request = {
        openApi:wrapperFun('openApi',network.id),
        uploadFile: wrapperFun('uploadFile',network.id),
        fetch: wrapperFun('fetch',network.id),
        pagenote: wrapperFun('pagenote',network.id)
    }

    const developerApi: developer.request = {
        downloadLog: wrapperFun('downloadLog',developer.id),
        requestBack: wrapperFun('requestBack',developer.id),
        chrome: wrapperFun('chrome',developer.id),
        requestFront: wrapperFun('requestFront',developer.id),
        log: wrapperFun('log',developer.id),
        logs: wrapperFun('logs',developer.id),
        permissionList: wrapperFun('permissionList',developer.id),
        requestPermission: wrapperFun('requestPermission',developer.id)
    }

    const localResourceApi: localResource.request = {
        add: wrapperFun('add',localResource.id),
        putItems: wrapperFun('putItems',localResource.id),
        query: wrapperFun('query',localResource.id),
        remove: wrapperFun('remove',localResource.id),
        update: wrapperFun('update',localResource.id),
    }

    return {
        lightpage: lightpageApi,
        boxroom: boxroomApi,
        setting: settingApi,
        browserAction: browserActionApi,
        commonAction: actionApi,
        fileSystem: fileSystemApi,
        fileDB: fileDBApi,
        user: userApi,
        network: networkApi,
        developer: developerApi,
        localResource: localResourceApi,
    }
};

const api = generateApi();

export default api
