
// 应用市场平台
export enum APP_STORES {
    'san60'   = '360',
    'safari'  = 'safari',
    'firefox' = 'firefox',
    'edge'    = 'edge',
    'chrome'  = 'chrome',
    'offline' = 'offline',
}

export enum APP_BUILD_TYPE {
    PROD = 'production',
    TEST = 'development',
}

// 应用信息
export type AppStoreInfo = {
    id?: string,
    name: string,
    installUrl?: string
}

export const appstoreInfos: Record<APP_STORES, AppStoreInfo> ={
    offline: {
        name: "离线包",
        installUrl: "https://ext.chrome.360.cn/webstore/detail/gielpddfollkffnbiegekliodnahhpfa"
    },
    "360": {
        id: "gielpddfollkffnbiegekliodnahhpfa",
        name: "360浏览器",
        installUrl: "https://ext.chrome.360.cn/webstore/detail/gielpddfollkffnbiegekliodnahhpfa"
    },
    chrome:{
        id: "hpekbddiphlmlfjebppjhemobaopekmp",
        name: "Chrome浏览器",
        installUrl: "https://chrome.google.com/webstore/detail/pagenotehighlight-and-tak/hpekbddiphlmlfjebppjhemobaopekmp"
    },
    edge: {
        id: "ablhdlecfphodoohfacojdngdfkgneaa",
        name: "Edge浏览器",
        installUrl: "https://microsoftedge.microsoft.com/addons/detail/ablhdlecfphodoohfacojdngdfkgneaa"
    },
    firefox: {
        id: "",
        name: "Firefox浏览器",
        installUrl: "https://addons.mozilla.org/zh-CN/firefox/addon/pagenote/"
    },
    safari: {
        name: "safari 浏览器",
    }

}

export const appIdToInfoMap: Record<string, AppStoreInfo> = (()=>{
    const info: Record<string, AppStoreInfo> = {};
    for(const i in appstoreInfos){
        const app: AppStoreInfo = appstoreInfos[i as APP_STORES];
        const id = app?.id;
        if(id){
            info[id] = app;
        }
    }
    return info;
})()
