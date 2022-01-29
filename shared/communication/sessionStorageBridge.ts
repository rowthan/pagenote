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


type SessionHeader = BaseMessageHeader & {
    targetBridgeKey?: number,
}

type SessionSender = {
    header: SessionHeader
}

interface IMessageListener<R,T> extends IBaseMessageListener<R, SessionSender,T> {}
interface IMessageProxy extends IBaseMessageProxy<any, SessionSender,any>{}


interface BridgeOption extends CommunicationOption{
    listenKey: string
}

const EVENT_NAME = 'storage';

function triggerMessage(key:string,requestData:object) {
    const dataString = JSON.stringify(requestData)
    try{
        window.sessionStorage.setItem(key,dataString);
    }catch (e) {
        console.warn('信息超载，可能通讯失败')
    }
    const event = new Event(EVENT_NAME);
    // @ts-ignore
    event.key = key;
    // @ts-ignore
    event.newValue = dataString
    window.dispatchEvent(event)
}

function clearMessage(key:string) {
    window.sessionStorage.setItem(key,'');
}

class SessionStorageBridge implements Communication<any>{
    clientId: string;
    listeners: Record<string, IMessageListener<any,any>>;
    option: BridgeOption;
    proxy: IMessageProxy = function () {
        return false
    };
    state = STATUS.UN_READY;

    constructor(id:string,option: BridgeOption) {
        this.clientId = id;
        this.option = option;
        this.listeners = {};
        this.startListen();
        this.state = STATUS.READY
    }

    responseMessage(type: string, data: any, header?: BaseMessageHeader): void {
        throw new Error("Method not implemented.");
    }

    startListen(){
        const that = this;
        const {listenKey} = this.option
        const globalListen = function(event:StorageEvent){
            let requestData: BaseMessageRequest;
            try{
                let dataString:string=''
                if(event.key===listenKey && event.newValue){
                    dataString = event.newValue
                } else{
                    dataString = sessionStorage.getItem(listenKey) || '';
                }
                if(!dataString){
                    return;
                }
                requestData = JSON.parse(dataString)
            }catch (e) {
                return;
            }
            const {header,type,data} = requestData || {};
            if(!header || !type){
                return;
            }
            // 目标对象校验
            if((header.targetClientId && header.targetClientId !== that.clientId) || header.senderClientId === that.clientId){
                return;
            }
            // 请求类型 且 配置不作为服务器，则不接受请求
            if(header.isResponse===false && that.option.asServer!==true){
                return;
            }

            const sendResponse = function (data:any) {
                const requestData: BaseMessageRequest = {
                    data: data,
                    header: {
                        ...header,
                        isResponse: true,
                        originClientId: header.originClientId,
                        targetClientId: header.senderClientId,
                        senderClientId: that.clientId,
                    },
                    type: type,
                }
                triggerMessage(that.option.listenKey,requestData);
            }
            const sender: SessionSender = {
                header: header
            }
            const functionId = header.funId || ''
            const resolveFun = that.listeners[functionId] || that.listeners[type]
            if(resolveFun){
                resolveFun(data,sender,sendResponse)
                clearMessage(listenKey)
            } else if(that.proxy){
                that.proxy(requestData,sender,sendResponse);
                clearMessage(listenKey)
            }
        }
        window.addEventListener(EVENT_NAME, globalListen)
    }

    addListener(type: string, listener: IMessageListener<any,any>): this {
        this.listeners[type] = listener;
        return this;
    }

    addProxy(proxy: IMessageProxy): void {
        this.proxy = proxy
    }

    requestMessage(type: string, data: any, header?: SessionHeader): Promise<BaseMessageResponse<any>> {
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
        const onceFunIdListener: IMessageListener<any,any> = function (responseData: BaseMessageResponse<any>){
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
                isResponse: header?.isResponse === true,
                hostname: window.location.hostname,
            },
            type: type,
        }

        const key = this.option.listenKey;
        triggerMessage(key,requestData);
        return returnPromise;
    }

    stopListen(): void {
        this.state = STATUS.STOP
    }
}

export default SessionStorageBridge
