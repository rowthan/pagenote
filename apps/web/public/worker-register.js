function registerMain() {
    navigator.serviceWorker
        .register('/sw.js')
        .then(function (registration) {
            // 等待 active worker 后再发送配置，避免首次注册时 controller 为空。
            return registration.update().then(function () {
                return navigator.serviceWorker.ready
            }).then(function (readyRegistration) {
                var worker = readyRegistration.active
                if (!worker) {
                    return
                }
                console.log('Service worker updated.');
                worker.postMessage({
                    type: 'add_cache',
                    key: 'document',
                    values: [
                        "/widget/close-on-installed"
                    ]
                })

                worker.postMessage({
                    type: 'add_block',
                    values: [
                        "localhost",
                        "worker-register.js",
                        "/uninstall",
                        "/expired",
                        "/signin",
                        "/release",
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
