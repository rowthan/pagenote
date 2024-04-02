import {
    BaseMessageHeader,
    BaseMessageRequest,
    BaseMessageResponse,
    Communication,
    CommunicationOption,
    DEFAULT_TIMEOUT,
    IBaseMessageListener,
    IBaseMessageProxy,
    RESPONSE_STATUS_CODE,
    STATUS
} from "../base";

// TODO 完成示例
export default class IframeBridge  implements Communication<any>{
    option: CommunicationOption
    clientId: string

    proxy?: IBaseMessageProxy<BaseMessageRequest, any, any, void>;
    listeners: Record<string, IBaseMessageListener<any, any, any, void>> = {};
    state: STATUS = STATUS.UN_READY;

    constructor(id:string,option:CommunicationOption) {
        this.option = option;
        this.clientId = id;

    }
    startListen(): void {
        const option = this.option;
        const listeners = this.listeners;
        const state = this.state;
        function onReceiveMessage(event: MessageEvent) {
            if(state ===  STATUS.STOP){
                return;
            }
            if (!(option.allowFrameOrigins || []).includes(event.origin)){
                console.debug('无需处理',event)
                return;
            }
            const {type,data} = event.data;
            // if(type && listeners[type]){
            //     listeners[type]()
            // }
            // option.onReceiveMessage(event.data,data,function (result) {
            //     //@ts-ignore
            //     event.source.postMessage({
            //         type: type,
            //         ...result
            //         // @ts-ignore
            //     },event.origin)
            // })
        }
        window.addEventListener("message", onReceiveMessage, false);
    }
    stopListen(): void {
        this.state = STATUS.STOP;
    }
    addListener(type: string, fun: IBaseMessageListener<any, { header: BaseMessageHeader; }, any, void>): () => void {
        throw new Error("Method not implemented.");
    }
    addProxy(proxy: IBaseMessageProxy<any, { header: BaseMessageHeader; }, any, void>): void {
        this.proxy = proxy;
    }
    requestMessage(type: string, data: any, header?: BaseMessageHeader) {
        let resolveFun: (arg0: BaseMessageResponse<any>) => void;
        let rejectFun: (arg0: BaseMessageResponse<any>) => void
        const returnPromise: Promise<BaseMessageResponse<any>> = new Promise((resolve, reject) => {
            resolveFun = resolve;
            /**如果忽略异常，则直接通过 resolve 响应*/
            rejectFun = header?.withCatch ? reject : resolve;
        })

        // 创建唯一事件ID，区分同时发出的多个事件
        let funId = type + Date.now() + Math.random()
        let timer = setTimeout(function () {
            rejectFun({
                success: false,
                error: 'timeout',
                //@ts-ignore
                data: undefined,
                status: RESPONSE_STATUS_CODE.TIMEOUT,
                statusText: 'timeout'
            })
        }, header?.timeout || this.option.timeout)

        const that = this;
        /**注册单次发送message的响应监听*/
        const onceFunIdListener = function (responseData: BaseMessageResponse<any>) {
            delete that.listeners[funId]; // 响应处理后，清空监听
            clearTimeout(timer)
            if (responseData?.status && responseData?.status !== RESPONSE_STATUS_CODE.SUCCESS) {
                rejectFun(responseData)
            } else {
                resolveFun(responseData)
            }
        }
        this.addListener(funId, onceFunIdListener)

        const requestData: BaseMessageRequest = {
            data: data,
            header: {
                originClientId: header?.originClientId || this.clientId, // 源头客户端
                senderClientId: this.clientId, // 当前客户端
                senderURL: window?.self?.location.href,
                targetClientId: header?.targetClientId || '',
                funId: header?.funId || funId,
                targetOrigin: header?.targetOrigin,
                isResponse: header?.isResponse === true,
                timeout: header?.timeout || DEFAULT_TIMEOUT
            },
            type: type
        }

        //@ts-ignore
        window.postMessage(requestData,header?.targetOrigin)
        return returnPromise
    }
    responseMessage(type: string, data: any, header?: BaseMessageHeader | undefined): void {
        throw new Error("Method not implemented.");
    }

    broadcast(type: string, data: any, header?: BaseMessageHeader) {
        console.info(type,data,header)
        throw Error('broadcast not support')
    }
}

