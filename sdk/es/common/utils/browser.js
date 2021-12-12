var BrowserType;
(function (BrowserType) {
    BrowserType["Edge"] = "edge";
    BrowserType["IE"] = "ie";
    BrowserType["SAFARI"] = "safari";
    BrowserType["Firefox"] = "firefox";
    BrowserType["OPREAR"] = "opera";
    BrowserType["CHROME"] = "chrome";
    BrowserType["UNKNOW"] = "";
})(BrowserType || (BrowserType = {}));
function getBrowserTypeAndVersion() {
    var userAgent = window.navigator.userAgent;
    var type = BrowserType.UNKNOW;
    var version = '';
    var matchEdge = userAgent.match(/(Edg|Edge)\/((\d{1,}.)+)/);
    var matchChrome = userAgent.match(/(Chrome)\/((\d{1,}.)+)/);
    var matchOPR = userAgent.match(/(OPR)\/((\d{1,}.)+)/);
    var matchFirefox = userAgent.match(/(Firefox)\/((\d{1,}.*)+)/);
    var matchIE = userAgent.match(/(MSIE)\s(\d{1,}\.\d)/);
    var matchIE11 = userAgent.match(/(rv):(\d{1,}\.\d)/);
    var matchSafari = userAgent.match(/(Safari)\/(\d{1,}.*)/);
    if (matchEdge) {
        type = BrowserType.Edge;
        version = matchEdge[2];
    }
    else if (matchFirefox) {
        type = BrowserType.Firefox;
        version = matchFirefox[2];
    }
    else if (matchOPR) {
        type = BrowserType.OPREAR;
        version = matchOPR[2];
    }
    else if (matchIE) {
        type = BrowserType.IE;
        version = matchIE[2];
    }
    else if (matchIE11) {
        type = BrowserType.IE;
        version = matchIE11[2];
    }
    else if (matchChrome) {
        type = BrowserType.CHROME;
        version = matchChrome[2];
    }
    else if (matchSafari) {
        type = BrowserType.SAFARI;
        version = matchSafari[2];
    }
    var platform = /Mac/ig.test(userAgent);
    return {
        type: type,
        version: version,
        iOS: platform,
    };
}
export { getBrowserTypeAndVersion };
//# sourceMappingURL=browser.js.map