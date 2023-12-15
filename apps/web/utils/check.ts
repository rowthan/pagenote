import {BrowserType, getBrowserTypeAndVersion} from "@pagenote/shared/lib/utils/browser";


export function checkIsBrowserBasicUrl(url?: string) {
    if(!url){
        return false
    }
    return /^(edge:|extension:|chrome:|about:|chrome-extension:|moz-extension:|edge-extension:)/.test(url || '')
}

/**检测阅读器模式*/
export function checkIsReadMode(url?: string) {
    return /^read:/.test(url || window.location.protocol);
}

export function checkIsLocalFile(url?: string) {
    if(!url){
        return false
    }
    return /file:/.test(url)
}

export function checkIsPdf(url: string="") {
    return /\.pdf$/.test(url)
}

export function checkIsInPopup() {
    return window.innerWidth < 800 || window.innerHeight < 600
}


const browserUrlMap: Record<BrowserType, (string|RegExp)[]> = {
    "": [],
    ie: [],
    opera: [],
    safari: [],
    [BrowserType.Firefox]: ['https://addons.mozilla.org/zh-CN/developers/addons'],
    [BrowserType.Edge]: ['https://microsoftedge.microsoft.com/addons'],
    [BrowserType.CHROME]: ['https://chrome.google.com'],
    [BrowserType.SAN60]: ['https://ext.chrome.360.cn/']
}
export function checkIsBrowserAppStore(url?: string):boolean {
    if(!url){
        return false
    }
    const browser = getBrowserTypeAndVersion();
    const rules = browserUrlMap[browser.type];
    return rules.some(function (rule) {
        let ruleReg = typeof rule === 'string' ? new RegExp(rule) : rule;
        return ruleReg.test(url)
    })
}


