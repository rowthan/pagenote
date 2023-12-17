

export function onFocusChange(element: (HTMLElement|null)[],option:{
    callback: (focused: boolean)=>void,
    inTimeout?: number
    outTimeout?: number
}) {
    let focused = false, timer= 0;
    function trigger(value: boolean,timeout: number = 0) {
        focused = value;
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        timer && clearTimeout(timer);
        // @ts-ignore
        timer = setTimeout(function () {
            option.callback(focused);
        },timeout)
    }

    element.forEach(function (item) {
        item?.addEventListener('mouseenter',function () {
            trigger(true,option.inTimeout)
        })

        item?.addEventListener('mouseleave',function () {
            trigger(false,option.outTimeout)
        })
    })
}
