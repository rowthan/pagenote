const _historyWrap = function(type) {
    const orig = history[type];
    const e = new Event(type);
    return function() {
        const rv = orig.apply(this, arguments);
        e.arguments = arguments;
        window.dispatchEvent(e);
        return rv;
    };
};
history.pushState = _historyWrap('pushState');
history.replaceState = _historyWrap('replaceState');



export default function addUrlChangeListener(fun) {
    let timer = null;
    const listen = function () {
        clearTimeout(timer);
        const arg = arguments;
        timer = setTimeout(function () {
            fun(...arg)
        },10)
    }
    window.addEventListener('popstate', listen);
    window.addEventListener('pushState',listen);
    window.addEventListener('replaceState',listen);
    window.addEventListener('hashchange',listen);
    let initUrl = window.location.href;
    document.addEventListener('click',function () {
        console.log(window.location.href)
        if(initUrl !== window.location.href) {
            initUrl = window.location.href;
            listen()
        }
    },{capture:true});
}