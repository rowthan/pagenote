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
                    "/signin",
                    "/pro-plan"
                ]
            })

            navigator.serviceWorker.controller.postMessage({
                type: 'add_block',
                values: [
                    "worker-register.js",
                    "/expired",
                ]
            })
        })

    })
    .catch(function (err) {
        console.log(err)
    })
