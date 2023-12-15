navigator.serviceWorker
  .register('/sw.js')
  .then(function (registration) {
    // 方法尝试更新service worker
    registration.update()
    //     向 worker 发送消息
    registration.active.postMessage({
      type: 'add_cache',
      values: ['/release', '/pro-plan', '/author', '/widget/pro-plan', '/rate'],
    })
  })
  .catch(function (err) {
    console.log(err)
  })
