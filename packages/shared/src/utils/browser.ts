export enum BrowserType {
    Edge = 'edge',
    IE = 'ie',
    SAFARI = 'safari',
    Firefox = 'firefox',
    OPREAR = 'opera',
    CHROME = 'chrome',

    SAN60 = '360',
    UNKNOW = '',
}

export function getBrowserTypeAndVersion(): { type: BrowserType, version: string, iOS: boolean } {
    const userAgent = navigator.userAgent
    let type = BrowserType.UNKNOW
    let version = ''
    const matchEdge = userAgent.match(/(Edg|Edge)\/((\d{1,}.)+)/)
    const matchChrome = userAgent.match(/(Chrome)\/((\d{1,}.)+)/)
    const matchOPR = userAgent.match(/(OPR)\/((\d{1,}.)+)/)
    const matchFirefox = userAgent.match(/(Firefox)\/((\d{1,}.*)+)/)
    const matchIE = userAgent.match(/(MSIE)\s(\d{1,}\.\d)/)
    const matchIE11 = userAgent.match(/(rv):(\d{1,}\.\d)/)
    const matchSafari = userAgent.match(/(Safari)\/(\d{1,}.*)/)
    if (matchEdge) {
        type = BrowserType.Edge
        version = matchEdge[2]
    } else if (matchFirefox) {
        type = BrowserType.Firefox
        version = matchFirefox[2]
    } else if (matchOPR) {
        type = BrowserType.OPREAR
        version = matchOPR[2]
    } else if (matchIE) {
        type = BrowserType.IE
        version = matchIE[2]
    } else if (matchIE11) {
        type = BrowserType.IE
        version = matchIE11[2]
    } else if (matchChrome) {
        type = BrowserType.CHROME
        version = matchChrome[2]
    } else if (matchSafari) {
        type = BrowserType.SAFARI
        version = matchSafari[2]
    }
    const platform = /Mac/gi.test(userAgent)
    return {
        type,
        version,
        iOS: platform,
    }
}

