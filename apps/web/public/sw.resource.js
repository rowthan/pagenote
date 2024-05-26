var version = 11;
var EVENT_NAME = 'local/file/response'
self.addEventListener('install', function (e) {
    console.log('resource Service Worker install',version)
    self.skipWaiting()
})

self.addEventListener('activate', function(event) {
    event.waitUntil(
        // 在 activate 事件中执行一些必要的操作
        // 并调用 self.clients.claim() 方法接管控制页面的客户端
        self.clients.claim().then(function() {
            console.log('client claim');
        })
    );
});

var util = {
    sendMessageToDocument: function (data) {
        self.clients.matchAll().then(function (clients) {
            clients.forEach(function (client) {
                client.postMessage(data)
            })
        })
    },
}

var fileMap = {}
var lisenSet = {}
var lisener = {
    add: function (key,callback) {
        lisenSet[key] = callback;
    },
    trigger: function (key) {
        lisenSet[key] && lisenSet[key]();
        delete lisenSet[key];
    }
}


function promiseResponse(request) {
    var url = request.url;
    return new Promise(function (resolve, reject) {
        var cacheResponse =  fileMap[url];
        if(cacheResponse){
            return response(cacheResponse)
        }

        function response(responseData) {
            // if(responseData && responseData.redirect){
            //     resolve(Response.redirect(responseData.redirect,302))
            //     delete fileMap[url];
            // } else
            if(responseData && responseData.body){
                // if(typeof responseData.body === 'string' &&
                //     responseData.body.startsWith('http')){
                //     console.log('redirect???',responseData.body)
                //     return fetch(responseData.body).then(function (res) {
                //         resolve(res)
                //     })
                // }
                delete fileMap[url];
                const cacheResponse = new Response(responseData.body,responseData.init);
                self.caches.open('file').then(function (cache) {
                    cache.put(request,cacheResponse.clone())
                    resolve(cacheResponse)
                })
            }
        }

        function requestExt(){
            util.sendMessageToDocument({
                type: EVENT_NAME,
                url: url,
            })
        }

        var timer = setTimeout(function(){
            requestExt();
            // fetch(request).then(function (res) {
            //     resolve(res)
            // })
            // 返回重试机制的html
            resolve(new Response(tipHtml,{
                headers: {'Content-Type': 'text/html'},
                status: 404,
            }))
        },2000)

        lisener.add(url,function () {
            const cache = fileMap[url];
            clearTimeout(timer)
            if(cache){
                response(cache)
            }else {
                resolve(new Response(tipHtml,{
                    headers: {'Content-Type': 'text/html'},
                    status: 404,
                }))
            }
        })

        requestExt();
    })
}

var tipHtml = `
<!DOCTYPE html>
<html lang="zh">
    <head>
        <meta charset="UTF-8"/>
        <title>loading...</title>
    </head>
    <body>
        <h1>请求超时，请重试刷新页面...!</h1>
        <a href="">reload</a>
        <script>
            var key = 'load_'+window.location.href;
            var loadTimes = Number(sessionStorage.getItem(key) || 0)
            function reload(){
                if(loadTimes > 3){
                    return
                }
                window.location.reload()
            }
            
            setTimeout(function(){
                reload()
                sessionStorage.setItem(key,String(loadTimes+1))
            },loadTimes * 100 + 10)
        </script>
    </body>
  </html>
`

self.addEventListener('fetch', function (e) {
    const requestResource = ['document','image'].includes(e.request.destination)
        && e.request.url.indexOf('/file/') > -1 && e.request.url.indexOf('.') > -1
    if(requestResource){
        e.respondWith(caches.match(e.request).then(function (response) {
            if(response){
                return response;
            }else{
                return promiseResponse(e.request);
            }
        }))
    }else{
        return fetch(e.request)
    }
})


self.addEventListener('message', function (e) {
    switch (e.data.type) {
        case EVENT_NAME:
            fileMap[e.data.url] = e.data;
            lisener.trigger(e.data.url);
            break
    }
})
