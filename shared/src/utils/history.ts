type HistoryStateChangeType = 'pushState' | 'replaceState'

const _historyWrap = function(type:HistoryStateChangeType) {
    const orig = window.history[type];
    const e = new Event(type);
    //@ts-ignore
    window.history._wrapped = true;
    return function() {
        // @ts-ignore
        const rv = orig.apply(this, arguments);
        // @ts-ignore
        e.arguments = arguments;
        window.dispatchEvent(e);
        return rv;
    };
};

// @ts-ignore 防止多次修改
if(window.history._wrapped!==true){
    history.pushState = _historyWrap('pushState');
    history.replaceState = _historyWrap('replaceState');
}


enum URLchangeTypes {
    history='history',
    hash='hash',
    document='document'
}
type ListenType = URLchangeTypes
type Options = {
    listenTypes: ListenType[],
    clickTimeout: number
}

const defaultOptions = {
    listenTypes:[URLchangeTypes.hash,URLchangeTypes.history,URLchangeTypes.document],
    clickTimeout: 100,
}
/**
 * 监听页面 URL 发生变更
 * 涉及场景：1、通过hash发生了变更，2、通过 history 发生变更；3、兜底通过click来比对是否变化
 * */
export default function addUrlChangeListener(fun:Function,options:Options=defaultOptions):void {
    let timer: NodeJS.Timeout;
    const listen = function (e:Event|HashChangeEvent|MouseEvent|PopStateEvent) {
        clearTimeout(timer);
        timer = setTimeout(function () {
            fun(e)
        },10)
    }

    if(options.listenTypes.includes(URLchangeTypes.hash)){
        window.addEventListener('hashchange',listen);
    }

    if(options.listenTypes.includes(URLchangeTypes.history)){
        window.addEventListener('popstate', listen);
        window.addEventListener('pushState',listen);
        window.addEventListener('replaceState',listen);
    }

    if(options.listenTypes.includes(URLchangeTypes.document)){
        let lastTimeUrl = window.location.href;
        document.addEventListener('click',function (e:MouseEvent) {
            setTimeout(function () {
                if(lastTimeUrl !== window.location.href) {
                    lastTimeUrl = window.location.href;
                    listen(e)
                }
            },options.clickTimeout)
        },{capture:true}); // 100ms 后判断URL变更，click 当下 URL可能还未变化
    }
}
