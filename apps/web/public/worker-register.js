function registerMain() {
    if(window.location.hostname==='localhost'){
        return
    }
    navigator.serviceWorker
        .register('/sw.js')
        .then(function (registration) {
            // 方法尝试更新service worker
            registration.update().then(function () {
                console.log('Service worker updated.');
                navigator.serviceWorker.controller.postMessage({
                    type: 'add_cache',
                    key: 'document',
                    values: [
                        "/widget/close-on-installed"
                    ]
                })

                navigator.serviceWorker.controller.postMessage({
                    type: 'add_block',
                    values: [
                        "localhost",
                        "worker-register.js",
                        "/expired",
                    ]
                })

                // 广播 service worker 消息。
                navigator.serviceWorker.addEventListener('message', function (event) {
                    sessionStorage.setItem('worker-message', JSON.stringify(event.data))
                    var newEvent = new Event('storage');
                    window.dispatchEvent(newEvent)
                });
            })
        })
        .catch(function (err) {
            console.log(err)
        })
}

function registerResource() {
    navigator.serviceWorker
        .register('/sw.resource.js',{
            scope: '/file'
        })
        .then(function (registration) {
            registration.update();
        })
}

registerMain();
registerResource()
