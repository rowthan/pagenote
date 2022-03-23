// todo 支持 promise 化
var Bridge = function (element,clientId='page',targetId='extension') {
    if(!element){
        element = document.getElementById('messenger') || document.createElement('div');
        element.id = 'messenger'
        element.style.display='none';
        document.documentElement.appendChild(element)
    }

    const listeners = {};

    this.sendMessage = function (type,data,callback,funId='',startClient) {
        if(typeof callback === 'function'){
            listeners[funId?type+'_'+funId:type] = callback;
        }
        element.innerText = JSON.stringify({
            data:data,
            type:type,
            funId: funId,
            startClient: startClient || clientId,
        });
        const customEvent = document.createEvent('Event');
        customEvent.initEvent('send_to_'+targetId, true, true);
        element.dispatchEvent(customEvent);
    };


    this.addListener = function (type,fun) {
        listeners[type] = fun;
        return this;
    };

    element.addEventListener('send_to_'+clientId,(e)=>{
        const eventData = element.innerText;
        let requestData = {type:'',data:{},funId:'',startClient:''};
        try{
            requestData = JSON.parse(eventData)
        }catch (e) {

        }

        const isOnceFun = requestData.startClient===clientId && requestData.funId
        let functionId = requestData.type;
        if(isOnceFun){
            functionId = requestData.type+'_'+requestData.funId
        }
        const sendResponse =  (data)=> {
            this.sendMessage(requestData.type,data,null,requestData.funId,requestData.startClient);
        };
        if(listeners[functionId]){
            listeners[functionId](requestData,clientId,sendResponse);
        }
        if(isOnceFun){
            delete listeners[functionId]
        }
        element.innerText = '';
    })
}

export default Bridge;
