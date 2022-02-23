import SessionStorageBridge from "@pagenote/shared/lib/communication/sessionStorageBridge";
import ExtensionBridge from '@pagenote/shared/lib/communication/ExtenstionBridge'
import generateApi from '@pagenote/shared/lib/generateApi'

let bridge:SessionStorageBridge | ExtensionBridge;
const wrapperFun = function (method:string,targetId:string) {
    return function (request:any) {
        // bridge 运行时初始化，
        if(!bridge){
            const clientId = 'page_bridge'
            if(chrome && chrome.runtime){
                bridge = new ExtensionBridge(clientId,{
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

const bridgeApi = generateApi(wrapperFun)

export default bridgeApi
