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
                    "/widget/close-on-installed",
                    "/sitemap",
                    "/signin",
                    "/pro-plan"
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
