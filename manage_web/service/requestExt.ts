import Message2 from '@pagenote/shared/lib/communication/ExtenstionBridge.js'
import SessionStorageBridge from "@pagenote/shared/lib/communication/sessionStorageBridge";
import generateApi from '@pagenote/shared/lib/generateApi'


let bridge:any;
const wrapperFun = function (method:string,targetId:string) {
    return function (request:any) {
        // bridge 运行时初始化，
        if(!bridge){
            const clientId = 'page_bridge'
            if(chrome && chrome.runtime){
                bridge = new Message2(clientId,{
                    asServer: true,
                    isBackground: false,
                    timeout: 5000
                })
            }else{
                bridge = new SessionStorageBridge(clientId,{
                    asServer: true,
                    listenKey: "pagenote-message",
                    timeout: 8000,
                })
            }
        }

        return bridge.requestMessage(method,request)
    }
}

/** 请求插件，适用于 0.21.* 版本后*/
const bridgeApi = generateApi(wrapperFun)

export default bridgeApi
