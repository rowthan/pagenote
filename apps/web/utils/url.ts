export function replaceHttpToExt(origin?: string) {
    const isHttp = /^https/.test(window.location.protocol);
    if (isHttp) {
        if (!origin) {
            return;
        }
        const currentOrigin = window.location.origin;
        const site = window.location.href.replace(currentOrigin, origin)
        if (site) {
            const url = new URL(site);
            let path = url.pathname;
            if (!/^\/web/.test(path)) {
                path = '/web' + path;
            }
            if (!/html/.test(path)) {
                path += '.html'
            }
            url.pathname = path;
            window.location.href = url.href;
        }
    }
}
