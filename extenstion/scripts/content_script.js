var easyshare = new EasyShare("easyshare-extenstion-container",{
    changeUrl:false
})

var data = localStorage.getItem(window.location.host+window.location.pathname);
if(data){
    console.log("get this data")
    easyshare.init(data)
}

easyshare.addListener (function(status){
    if(status==10){
        localStorage.setItem(window.location.host+location.pathname,easyshare.data)
        console.log(easyshare.data)
    }
})