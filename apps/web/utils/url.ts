import extApi from "@pagenote/shared/lib/pagenote-api";

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


export function openUrlInGroup(url: string,groupInfo:{
    title: string
}={
    title: 'PAGENOTE'
}) {
    const timer = setTimeout(function () {
        window.location.href = url;
    },2000)
    extApi.commonAction.openTab({
        url: url,
        tab:{
            groupInfo: groupInfo,
        },
        reUse: true,
    },{
        timeout: 1000
    }).then(function(res){
        if(res.success){
            clearTimeout(timer)
        }
    })
}
