navigator.serviceWorker
  .register('/sw.js')
  .then(function (registration) {
    // 方法尝试更新service worker
    registration.update()
  })
  .catch(function (err) {
    console.log(err)
  })
