
export function appendScript(srcList: string[],root:Document | HTMLElement = document.body) {
    srcList.forEach(function (src) {
        const script = document.createElement('script')
        script.src =  src
        root.appendChild(script)
    })
}

export function appendCss(styleList: string[],root:Document | HTMLElement = document.body) {
    styleList.forEach(function (src) {
        const link = document.createElement('link')
        link.href =  src
        link.rel="stylesheet"
        link.type='text/css'
        const head = root.querySelector('head');
        (head || root).appendChild(link)
    })
}
