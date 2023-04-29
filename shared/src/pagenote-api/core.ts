import {
    action, box,
    boxroom,
    browserAction,
    ComputeRequestApiMapDefine, config, developer,
    fileDB, html, light,
    lightpage,
    localdir, localResource, network, page,
    setting, snapshot, TableAPI, user
} from "../extApi";
import {BaseMessageHeader, RESPONSE_STATUS_CODE} from "../communication/base";

interface Wrapper {
    (method: string, targetId: string, clientId?: string): (request: any, header?: Partial<BaseMessageHeader>) => any
}

export function createApiForClient<T>(define: Record<string, boolean>, clientId: string, wrapperFun: Wrapper) {
    const object: Record<string, (request: any, header: BaseMessageHeader) => Promise<any>> = {}
    for (let method in define) {
        if (define[method]) {
            // TODO 所有方法共享一个请求方法
            object[method] = wrapperFun(method, clientId)
        } else {
            object[method] = function () {
                return Promise.resolve({
                    success: true,
                    error: 'not allowed',
                    data: true,
                    status: RESPONSE_STATUS_CODE.NOT_FOUND,
                    statusText: '404'
                })
            }
        }
    }
    // @ts-ignore
    return object as T;
}

export const generateApi = function (wrapperFun: Wrapper) {
    const lightpageMethod: ComputeRequestApiMapDefine<lightpage.request> = {
        addLights: true,
        addPages: true,
        addSnapshots: true,
        exportBackup: true,
        getLightPageDetail: true,
        groupLights: true,
        groupPages: true,
        importBackup: true,
        queryLights: true,
        queryPages: true,
        querySnapshots: true,
        removeLights: true,
        removePages: true,
        removeSnapshots: true,
        saveLightPage: true,
        syncStat: true,
        updateLights: true,
        updatePages: true
    }

    const boxMethod: ComputeRequestApiMapDefine<boxroom.request> = {
        addItems: true,
        queryItems: true,
        removeItems: true,
        syncStat: true,
        updateItems: true
    }

    const settingMethod: ComputeRequestApiMapDefine<setting.request> = {
        queryConfig: true,
        saveConfig: true,
        getSearchEngines: true,
        getSetting: true,
        getUserSetting: true,
        resetSetting: true,
        saveSetting: true
    }

    const browserActionApiMethod: ComputeRequestApiMapDefine<browserAction.request> = {
        getBrowserActionInfo: true,
        setBrowserActionClick: true,
        setBrowserActionDisplay: true
    }

    const actionApiMethod: ComputeRequestApiMapDefine<action.request> = {
        addScheduleTask: true,
        captureView: true,
        copyToClipboard: true,
        getCurrentTab: true,
        getMemoryRuntime: true,
        getPersistentValue: true,
        injectCodeToPage: true,
        injectToFrontPage: true,
        openTab: true,
        queryTabs: true,
        report: true,
        setMemoryRuntime: true,
        setPersistentValue: true,
        track: true,
        usage: true
    }

    const localdirMethod: ComputeRequestApiMapDefine<localdir.request> = {
        readPagesFrontDir: true,
        requestPermission: true

    }

    const fileDBMethod: ComputeRequestApiMapDefine<fileDB.request> = {
        getFile: true, getFiles: true, removeFiles: true, saveFile: true, uploadFile: true

    }

    const userMethod: ComputeRequestApiMapDefine<user.request> = {
        exchange: true,
        getDevice: true,
        getDeviceList: true,
        getUser: true,
        getWhoAmI: true,
        setDevice: true,
        setUserToken: true,
        signin: true,
        signout: true

    }

    const networkMethod: ComputeRequestApiMapDefine<network.request> = {
        state: true,
        notion: true,
        fetch: true,
        openApi: true,
        pagenote: true,
        uploadFile: true
    }

    const developerMethod: ComputeRequestApiMapDefine<developer.request> = {
        chrome: true,
        downloadLog: true,
        log: true,
        logs: true,
        permissionList: true,
        requestBack: true,
        requestFront: true,
        requestPermission: true
    }


    const implementTableMethods: ComputeRequestApiMapDefine<TableAPI<any>> = {
        abstract: true,
        count: true,
        group: true,
        init: true,
        put: true,
        query: true,
        remove: true,
        stat: true,
        update: true
    }

    const configMethod: ComputeRequestApiMapDefine<config.request> = implementTableMethods
    const htmlMethod: ComputeRequestApiMapDefine<html.request> = implementTableMethods
    const boxMethods: ComputeRequestApiMapDefine<box.request> = implementTableMethods
    const lightMethods: ComputeRequestApiMapDefine<light.request> = implementTableMethods
    const pageMethods: ComputeRequestApiMapDefine<page.request> = implementTableMethods
    const snapshotMethods: ComputeRequestApiMapDefine<snapshot.request> = implementTableMethods

    const localResourceMethod: ComputeRequestApiMapDefine<localResource.request> = {
        add: true, group: true, putItems: true, query: true, remove: true, update: true
    }

    return {
        lightpage: createApiForClient<lightpage.request>(lightpageMethod, lightpage.id, wrapperFun),
        // 待删除
        boxroom: createApiForClient<boxroom.request>(boxMethod, boxroom.id, wrapperFun),
        setting: createApiForClient<setting.request>(settingMethod, setting.id, wrapperFun),
        browserAction: createApiForClient<browserAction.request>(browserActionApiMethod, browserAction.id, wrapperFun),
        commonAction: createApiForClient<action.request>(actionApiMethod, action.id, wrapperFun),
        fileSystem: createApiForClient<localdir.request>(localdirMethod, localdir.id, wrapperFun),
        fileDB: createApiForClient<fileDB.request>(fileDBMethod, fileDB.id, wrapperFun),
        user: createApiForClient<user.request>(userMethod, user.id, wrapperFun),
        network: createApiForClient<network.request>(networkMethod, network.id, wrapperFun),
        developer: createApiForClient<developer.request>(developerMethod, developer.id, wrapperFun),
        localResource: createApiForClient<localResource.request>(localResourceMethod, localResource.id, wrapperFun),

        // 格式化的统一数据操作 API
        html: createApiForClient<html.request>(htmlMethod, html.id, wrapperFun),
        config: createApiForClient<config.request>(configMethod, config.id, wrapperFun),
        box: createApiForClient<box.request>(boxMethods, box.id, wrapperFun),
        page: createApiForClient<page.request>(pageMethods, page.id, wrapperFun),
        light: createApiForClient<light.request>(lightMethods, light.id, wrapperFun),
        snapshot: createApiForClient<snapshot.request>(snapshotMethods, snapshot.id, wrapperFun)
    }
};
