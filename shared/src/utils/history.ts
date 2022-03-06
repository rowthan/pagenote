
type HistoryStateChangeType = 'pushState' | 'replaceState'

const _historyWrap = function(type:HistoryStateChangeType) {
    const orig = history[type];
    const e = new Event(type);
    return function() {
        const rv = orig.apply(this, arguments);
        // @ts-ignore
        e.arguments = arguments;
        window.dispatchEvent(e);
        return rv;
    };
};
history.pushState = _historyWrap('pushState');
history.replaceState = _historyWrap('replaceState');


enum URLchangeTypes {
    history='history',
    hash='hash',
    document='document'
}
type ListenType = URLchangeTypes
type Options = {
    listenTypes: ListenType[]
}

const defaultOptions = {
    listenTypes:[URLchangeTypes.hash,URLchangeTypes.history,URLchangeTypes.document]
}
/**
 * 监听页面 URL 发生变更
 * 涉及场景：1、通过hash发生了变更，2、通过 history 发生变更；3、兜底通过click来比对是否变化
 * */
export default function addUrlChangeListener(fun:Function,options:Options=defaultOptions):void {
    let timer: NodeJS.Timeout;
    const listen = function () {
        clearTimeout(timer);
        const arg = arguments;
        timer = setTimeout(function () {
            // @ts-ignore
            fun(...arg)
        },10)
    }
    console.log('监听',options)

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
        document.addEventListener('click',function () {
            if(lastTimeUrl !== window.location.href) {
                lastTimeUrl = window.location.href;
                listen()
            }
        },{capture:true});
    }
}