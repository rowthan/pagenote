var _historyWrap = function (type) {
    var orig = history[type];
    var e = new Event(type);
    return function () {
        var rv = orig.apply(this, arguments);
        // @ts-ignore
        e.arguments = arguments;
        window.dispatchEvent(e);
        return rv;
    };
};
history.pushState = _historyWrap('pushState');
history.replaceState = _historyWrap('replaceState');
var URLchangeTypes;
(function (URLchangeTypes) {
    URLchangeTypes["history"] = "history";
    URLchangeTypes["hash"] = "hash";
    URLchangeTypes["document"] = "document";
})(URLchangeTypes || (URLchangeTypes = {}));
var defaultOptions = {
    listenTypes: [URLchangeTypes.hash, URLchangeTypes.history, URLchangeTypes.document]
};
/**
 * 监听页面 URL 发生变更
 * 涉及场景：1、通过hash发生了变更，2、通过 history 发生变更；3、兜底通过click来比对是否变化
 * */
export default function addUrlChangeListener(fun, options) {
    if (options === void 0) { options = defaultOptions; }
    var timer = null;
    var listen = function () {
        clearTimeout(timer);
        var arg = arguments;
        timer = setTimeout(function () {
            // @ts-ignore
            fun.apply(void 0, arg);
        }, 10);
    };
    console.log('监听', options);
    if (options.listenTypes.includes(URLchangeTypes.hash)) {
        window.addEventListener('hashchange', listen);
    }
    if (options.listenTypes.includes(URLchangeTypes.history)) {
        window.addEventListener('popstate', listen);
        window.addEventListener('pushState', listen);
        window.addEventListener('replaceState', listen);
    }
    if (options.listenTypes.includes(URLchangeTypes.document)) {
        var lastTimeUrl_1 = window.location.href;
        document.addEventListener('click', function () {
            if (lastTimeUrl_1 !== window.location.href) {
                lastTimeUrl_1 = window.location.href;
                listen();
            }
        }, { capture: true });
    }
}
//# sourceMappingURL=history.js.map