import extApi from "@pagenote/shared/lib/pagenote-api";
import {html} from "@pagenote/shared";
import OfflineHTML = html.OfflineHTML;
import {basePath} from "../const/env";

export function openHtml(id?:string,html?:string) {
    // if(html){
    //     // const blob = new Blob([html], {type: 'text/html'});
    //
    //     extApi.developer.requestBack({
    //         namespace: "developer",
    //         params: {
    //             type: 'text/html',
    //             data: html,
    //         },
    //         type: "getBlobUrl"
    //     }).then(function(res){
    //         console.log(res,'---')
    //         const url = res?.data;
    //         return window.open(url)
    //     })
    //     return;
    // }

    window.open(`${basePath}/file/${id}.html`)
    return;

    // if(isExt){
    //     return window.open('https://pagenote.cn/ext/offline.html?id='+id, '_blank')
    // }
    if(!id){
        return;
    }
    extApi.table
        .query({
            table: 'html',
            db: 'resource',
            params: {
                query: {
                    resourceId: id
                }
            }
        })
        .then(function (res) {
            const html = res?.data?.list[0] as OfflineHTML;
            if(!html){
                return;
            }

            // 获取你的 HTML 源代码字符串
            const yourHtmlCode = html.data;

            /**
             * 1. 将 HTML 源码转为 Blob 对象。优点，完美复制原生http的渲染，继承所有属性；
             * 缺点，链接的生命周期有限，不具备持久化、传播属性。
             * chrome 不支持对 blob 网页的代码植入 https://github.com/tulios/json-viewer/issues/18
             * */
            // const blob = new Blob([yourHtmlCode], { type: 'text/html' });
            //
            // // 创建包含 Blob 对象的 URL
            // const blobUrl = URL.createObjectURL(blob);
            //
            // // 在新窗口中打开 URL
            // const openWindow = window.open(blobUrl, '_blank');
            //
            // const flagOffline = document.createElement('meta');
            // flagOffline.setAttribute('property', 'pagenote:offline');
            // flagOffline.setAttribute('content', html.resourceId||'');
            //
            // (openWindow?.document?.head || openWindow?.document?.body)?.appendChild(flagOffline)
            // return;

            // 2. 源码写入的方式。优点可以操作打开的页面；缺点 窗口的location 地址会给用户造成误解，无法隐藏和修改；无法刷新；
            const feature = ''//'location=no,dependent=no,status=no'
            const openWindow = window.open('https://pagenote.cn/offline?id='+html.resourceId, '_blank',feature);
            openWindow?.document.write(yourHtmlCode)
            const flagOffline = document.createElement('meta');
            flagOffline.setAttribute('property', 'pagenote:offline');
            flagOffline.setAttribute('content', html.resourceId||'');

            (openWindow?.document?.head || openWindow?.document?.body)?.appendChild(flagOffline)
            return;
            //
            // //3. 借助 iframe 的能力；优点利于主页面潜入内容，管理； 缺点，非原生的渲染，会增加冗余节点，不利于 DOM 分析和插件植入。
            // const originUrl = html.relatedPageUrl || html.originUrl || ''
            // const iframe = document.createElement('iframe')
            // // iframe.srcdoc =
            // //     resource.data ||
            // //     '<!DOCTYPE html><html><head></head><body></body></html>'
            // iframe.src = originUrl
            // iframe.setAttribute('data-pagenote', 'html')
            // iframe.style.width = '100%'
            // iframe.style.height = '100%'
            // const current = document.querySelector('iframe[data-pagenote]')
            // if (current) {
            //     document.documentElement.removeChild(current as HTMLElement)
            // }
            // document.documentElement.appendChild(iframe)
            //
            //
            // iframe?.contentDocument?.write(html.data || '')
        })
}
