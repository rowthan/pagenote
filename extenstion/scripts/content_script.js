var easyshare = new EasyShare("yes-container")easyshare.addListener (function(status){
    if(status==10){
        localStorage.setItem(window.location.host+location.pathname,easyshare.data)
        console.log(easyshare.data)
    }
})