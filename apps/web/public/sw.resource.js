var version = 1;
self.addEventListener('install', function (e) {
    console.log('resource Service Worker install',version)
    self.skipWaiting()
})

self.addEventListener('activate', function(event) {
    event.waitUntil(
        // 在 activate 事件中执行一些必要的操作
        // 并调用 self.clients.claim() 方法接管控制页面的客户端
        self.clients.claim()
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

var htmlMap = {}
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

function promiseResponse(url) {
    return new Promise(function (resolve, reject) {
        if(htmlMap[url]){
            const html = htmlMap[url];
            resolve(new Response(html,{
                headers: {'Content-Type': 'text/html'}
            }))
            delete htmlMap[url];
            return;
        }

        var timer = setTimeout(function(){
            resolve(new Response(tipHtml,{
                headers: {'Content-Type': 'text/html'}
            }))
        },200)

        lisener.add(url,function () {
            const html = htmlMap[url];
            clearTimeout(timer)
            resolve(new Response(html,{
                headers: {'Content-Type': 'text/html'}
            }))
        })

        util.sendMessageToDocument({
            type: 'response',
            url: url,
        })
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
        <h1>尝试获取资源...!</h1>
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
    const requestResource = ['document'].includes(e.request.destination)
    if(requestResource){
        e.respondWith(promiseResponse(e.request.url))
    }else{
        return fetch(e.request)
    }
})


self.addEventListener('message', function (e) {
    switch (e.data.type) {
        case "response":
            htmlMap[e.data.url] = e.data.response;
            lisener.trigger(e.data.url);
            break
    }
})
