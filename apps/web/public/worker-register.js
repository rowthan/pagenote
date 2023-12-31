navigator.serviceWorker
  .register('/sw.js')
  .then(function (registration) {
    // 方法尝试更新service worker
    registration.update().then(function () {
        registration.active.postMessage({
            type: 'add_cache',
            values: ['/release', '/pro-plan', '/widget/pro-plan'],
        })
    })
  })
  .catch(function (err) {
    console.log(err)
  })
