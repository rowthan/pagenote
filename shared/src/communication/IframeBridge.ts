import {BaseMessageHeader, BaseMessageRequest, IBaseSendResponse} from "./base";

interface Option {
    onReceiveMessage: (request:any,sender:any,sendResponse:SendResponse)=>void
    allowOrigins: string[],
}

type SendResponse = IBaseSendResponse<any>;


export class IframeBridge {
    option: Option
    client: string
    constructor(id:string,option:Option) {
        this.option = option;
        this.client = id;
        function onReceiveMessage(event: MessageEvent) {
            if (!option.allowOrigins.includes(event.origin)){
                console.log('无需处理',event)
                return;
            }
            const {type,data} = event.data;
            option.onReceiveMessage(event.data,data,function (result) {
                event.source.postMessage({
                    type: type,
                    ...result
                    // @ts-ignore
                },event.origin)
            })
        }
        window.addEventListener("message", onReceiveMessage, false);
    }


    postMessage(type: string, message:any, header?:BaseMessageHeader){
        const requestData: BaseMessageRequest = {
            data:message,
            header: {
                originClientId: header?.originClientId || this.client, // 源头客户端
                senderClientId: this.client, // 当前客户端
                targetClientId: header?.targetClientId,
                targetOrigin: header?.targetOrigin,
                isResponse: false,
            },
            type: type
        }

        window.postMessage(requestData,header?.targetOrigin)
    }
}

