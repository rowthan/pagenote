import {
    BaseMessageHeader,
    BaseMessageRequest,
    BaseMessageResponse,
    Communication,
    CommunicationOption,
    IBaseMessageListener,
    IBaseMessageProxy,
    STATUS,
} from "./base";

interface ListenerResponse {
    (data: any):void
}

type BaseDomSender = {
    [key: string]:any
}
type ResponseFunReturn = void;
interface IMessageListener extends IBaseMessageListener<any, BaseDomSender,ResponseFunReturn> {}
interface IMessageProxy extends IBaseMessageProxy<any, BaseDomSender,ResponseFunReturn>{}

const EVENT_PREFIX = 'SEND_TO_'

function triggerDom(element:HTMLElement,requestData:BaseMessageRequest) {
    element.innerText = JSON.stringify(requestData);
    const customEvent = document.createEvent('Event');
    customEvent.initEvent(EVENT_PREFIX, true, true);
    element.dispatchEvent(customEvent);
}

export default class DomBridge implements Communication<any>{
    listeners: Record<string, IMessageListener> ={}
    proxy: IMessageProxy = function () {
        return false
    };
    element: HTMLElement
    clientId: string // 当前客户端标识
    state: STATUS = STATUS.UN_READY;
    option: CommunicationOption
    constructor(clientId:string,option:CommunicationOption) {
        this.clientId = clientId;
        this.option = option;
        this.element = option.element || <HTMLElement>document.getElementById('messenger');
        if (!this.element) {
            const element =  document.createElement('div');
            element.id = 'messenger'
            element.style.display = 'none';
            document.documentElement.appendChild(element)
            this.element = element;
        }
        /** 监听DOM 变化*/
        this.element.addEventListener(EVENT_PREFIX, (e) => {
            const eventData = this.element.innerText;
            let requestData: BaseMessageRequest;
            try {
                requestData = JSON.parse(eventData)
            } catch (e) {
                return;
            }
            const {header,type,data} = requestData;
            /**目标校对*/
            if(header.targetClientId!==this.clientId || data.header.senderClientId === this.clientId){
                return;
            }

            /**服务端，响应请求方法*/
            const sendResponse: ListenerResponse = (data) => {
                const requestData: BaseMessageRequest = {
                    type: type,
                    data: data,
                    header:{
                        originClientId: header.originClientId,
                        targetClientId: header.senderClientId,
                        senderClientId: this.clientId,
                        funId: header.funId,
                        isResponse: true
                    }
                }
                triggerDom(this.element,requestData)
            };
            const sender = {
                header: {
                    ...header,
                    senderClientId: this.clientId,
                }
            }

            const functionId = header.funId;
            const resolveFun = functionId ? this.listeners[functionId] : this.listeners[type];
            if (resolveFun) {
                resolveFun(data, sender, sendResponse);
            } else if (this.proxy) {
                this.proxy(requestData, sender, sendResponse)
            }
            setTimeout( ()=> {
                this.element.innerText = ''
            }, 0)
        })
    }

    requestMessage(type:string,data:any,header?:BaseMessageHeader):Promise<BaseMessageResponse<any>> {
        let resolveFun: (arg0: BaseMessageResponse<any>)=> void;
        const returnPromise: Promise<BaseMessageResponse<any>> = new Promise((resolve)=>{
            resolveFun = resolve;
        })

        // 创建唯一事件ID，区分同时发出的多个事件
        let funId = type + Date.now() + Math.random()
        let timer = setTimeout(function () {
            resolveFun({
                success: false,
                error: 'timeout',
                data: null,
            })
        },header?.timeout || this.option.timeout)

        const that = this;
        /**注册单次发送message的响应监听*/
        const onceFunIdListener: IMessageListener = function (responseData: BaseMessageResponse<any>){
            delete that.listeners[funId]; // 响应处理后，清空监听
            clearTimeout(timer)
            resolveFun(responseData)
        }
        this.addListener(funId, onceFunIdListener)

        const targetClientId = header?.targetClientId || this.option.targetClientId || ''
        const requestData: BaseMessageRequest = {
            data: data,
            header: {
                originClientId: this.clientId, // 源头客户端
                senderClientId: this.clientId, // 当前客户端
                targetClientId: targetClientId,
                funId: header?.funId || funId,
                isResponse: false,
            },
            type: type,
        }

        triggerDom(that.element,requestData);

        return returnPromise;
    };

    addListener(funId: string, fun: IMessageListener) {
        this.listeners[funId] = fun;
        const that = this;
        return function () {
            delete that.listeners[funId]
        }
    };

    addProxy(fun:IMessageProxy) {
        this.proxy = fun;
    }

    startListen(): void {
    }

    stopListen(): void {
    }

    responseMessage(type: string, data: any, header?: BaseMessageHeader): void {
        triggerDom(this.element,{
            type:type,
            data: data,
            header: header || {
                senderClientId: this.clientId,
                originClientId: this.clientId,
                targetClientId: '',
                isResponse: false,
            }
        })
    }
}
