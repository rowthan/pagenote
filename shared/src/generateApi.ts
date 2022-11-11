import {
    lightpage,
    boxroom,
    setting,
    browserAction,
    action,
    localdir,
    fileDB,
    user
} from "./extApi";
import SessionStorageBridge from "./communication/sessionStorageBridge";
import ExtensionMessage2 from "./communication/ExtenstionBridge";
import {BaseMessageHeader} from "./communication/base";


const notSupportYet = function () {
    return Promise.resolve({
        success: false,
        error: 'not allowed',
        data: undefined
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
        addLights: wrapperFun('addLights',lightpage.id),
        addPages: wrapperFun('addPages',lightpage.id),
        queryPages: wrapperFun('queryPages',lightpage.id),
        removeLights: wrapperFun('removeLights',lightpage.id),
        removePages: wrapperFun('removePages',lightpage.id),
        updateLights: wrapperFun('updateLights',lightpage.id),
        updatePages: wrapperFun('updatePages',lightpage.id),
        addLight: wrapperFun('addLight',lightpage.id),
        queryLights: wrapperFun('queryLights',lightpage.id),
        removeLight: wrapperFun('removeLight',lightpage.id),
        updateLight: wrapperFun('updateLight',lightpage.id),
        syncStat: wrapperFun('syncStat',lightpage.id),
        exportPages: wrapperFun('exportPages',lightpage.id),
        importPages: wrapperFun('importPages',lightpage.id),
        removeLightPages: wrapperFun('removeLightPages',lightpage.id),
        getLightPageDetail: wrapperFun('getLightPageDetail',lightpage.id),
        getLightPages: wrapperFun('getLightPages',lightpage.id),
        groupPages: wrapperFun('groupPages',lightpage.id),
        removeLightPage: wrapperFun('removeLightPage',lightpage.id),
        saveLightPage: wrapperFun('saveLightPage',lightpage.id)
    }

    const boxroomApi: boxroom.request = {
        syncStat: wrapperFun('syncStat',boxroom.id),
        update: wrapperFun('update',boxroom.id),
        get:wrapperFun('get',boxroom.id),
        remove:wrapperFun('remove',boxroom.id),
        save:wrapperFun('save',boxroom.id)
    }

    const settingApi: setting.request = {
        getSetting: wrapperFun('getSetting',setting.id),
        getUserSetting: wrapperFun('getUserSetting',setting.id),
        resetSetting: wrapperFun('resetSetting',setting.id),
        saveSetting: wrapperFun('saveSetting',setting.id),
        syncSetting: wrapperFun('syncSetting',setting.id),
    }

    const browserActionApi: browserAction.request ={
        setBrowserActionClick: notSupportYet,
        setBrowserActionDisplay: wrapperFun('setBrowserActionDisplay',browserAction.id),
        getBrowserActionInfo: wrapperFun('getBrowserActionInfo',browserAction.id),
    }

    const actionApi: action.request = {
        addScheduleTask: wrapperFun('addScheduleTask',action.id),
        log: wrapperFun('log',action.id),
        logs: wrapperFun('logs',action.id),
        backup: wrapperFun('backup',action.id),
        backupList: wrapperFun('backupList',action.id),
        report: wrapperFun('report',action.id),
        getMemoryRuntime: wrapperFun('getMemoryRuntime',action.id),
        setMemoryRuntime: wrapperFun('setMemoryRuntime',action.id),
        usage: wrapperFun('usage',action.id),
        injectToFrontPage: wrapperFun('injectToFrontPage',action.id),
        copyToClipboard: wrapperFun('copyToClipboard',action.id),
        captureView: wrapperFun('captureView',action.id),
        axios: wrapperFun('axios',action.id),
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
        getDevice: wrapperFun('getDevice',user.id),
        getDeviceList: wrapperFun('getDeviceList',user.id),
        setDevice: wrapperFun('setDevice',user.id),
        exchangeToken: wrapperFun('exchangeToken',user.id),
        getUser: wrapperFun('getUser',user.id),
        getUserToken: wrapperFun('getUserToken',user.id),
        getWhoAmI: wrapperFun('getWhoAmI',user.id),
        setUserToken: wrapperFun('setUserToken',user.id)
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
    }
};

const api = generateApi();

export default api
