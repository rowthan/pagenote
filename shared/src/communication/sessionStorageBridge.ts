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
    STATUS,
} from "./base";
import {createURLForJSON, sumSizeMB} from "./utils";


type SessionHeader = BaseMessageHeader & {
    targetBridgeKey?: number,
}

type SessionSender = {
    header: SessionHeader
}

interface IMessageListener<R, T> extends IBaseMessageListener<R, SessionSender, T> {
}

interface IMessageProxy extends IBaseMessageProxy<any, SessionSender, any> {
}


interface BridgeOption extends CommunicationOption {
    listenKey: string
    listenBridges?: number // 监听通道数 TODO 避免占用同一个key值，可以多路并发
}

const EVENT_NAME = 'storage';

function triggerMessage(key: string, requestData: BaseMessageRequest) {
    let dataString = JSON.stringify(requestData)
    // 初步估计信息占用空间
    const totalMB = sumSizeMB(dataString);
    // 请求数据大于 4MB 时，将数据进行转换为URI地址，防止 sessionStorage 无法承载
    if(totalMB>4){
        requestData.header.requestDataUri = createURLForJSON(requestData.data);
        requestData.data = undefined; // 转移数据为 requestDataUri
        dataString = JSON.stringify(requestData)
    }else{
        try {
            window.sessionStorage.setItem(key, dataString);
        } catch (e) {
            console.error('信息超载，可能通讯失败', e)
        }
    }

    const event = new Event(EVENT_NAME);
    // @ts-ignore
    event.key = key;
    // @ts-ignore
    event.newValue = dataString
    window.dispatchEvent(event)
}

function clearMessage(key: string) {
    window.sessionStorage.setItem(key, '');
}

class SessionStorageBridge implements Communication<any> {
    clientId: string;
    listeners: Record<string, IMessageListener<any, any>>;
    option: BridgeOption;
    proxy: IMessageProxy = function () {
        return false
    };
    state = STATUS.UN_READY;

    constructor(id: string, option: BridgeOption) {
        this.clientId = id;
        this.option = option;
        this.listeners = {};
        this.startListen();
        this.state = STATUS.READY
    }

    responseMessage(type: string, data: any, header?: BaseMessageHeader): void {
        throw new Error("Method not implemented.");
    }

    startListen() {
        const that = this;
        const {listenKey} = this.option
        const globalListen = async function (event: StorageEvent) {
            let requestData: BaseMessageRequest;
            try {
                let dataString: string = ''
                // TODO 支持 key 正则、避免使用单一通道值， listenBridges
                if (event.key === listenKey && event.newValue) {
                    dataString = event.newValue
                } else {
                    dataString = sessionStorage.getItem(listenKey) || '';
                }
                if (!dataString) {
                    return;
                }
                requestData = JSON.parse(dataString)
            } catch (e) {
                return;
            }

            const {header, type} = requestData || {};
            if (!header || !type) {
                return;
            }
            // 请求来自自身，忽略
            if (header.senderClientId === that.clientId) {
                return;
            }
            // 请求类型 且 配置不作为服务器，则不接受请求
            if (header.isResponse === false && that.option.asServer !== true) {
                return;
            }

            if(requestData?.header?.requestDataUri && !requestData.data){
                try{
                    const dataRes = await fetch(requestData.header.requestDataUri);
                    requestData.data = await dataRes.json();
                }catch (e) {
                    console.error('parse requestDataUri ERROR',e)
                }
            }

            const sendResponse = function (data: any) {
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
                triggerMessage(that.option.listenKey, requestData);
            }
            const sender: SessionSender = {
                header: header
            }
            const functionId = header.funId || ''
            const resolveFun = that.listeners[functionId] || that.listeners[type]
            if (resolveFun && typeof resolveFun === 'function') {
                // 事件有明确目标源，校验当前是否为接收方
                const canResolveThisEvent = !header.targetClientId || header.targetClientId === that.clientId
                if (canResolveThisEvent) {
                    resolveFun(requestData.data, sender, sendResponse)
                    clearMessage(listenKey)
                }
            } else if (that.proxy) {
                // 代理模式，可以接收处理所有请求，在内部自行判断是否为目标源
                that.proxy(requestData, sender, sendResponse);
                clearMessage(listenKey)
            }
        }
        window.addEventListener(EVENT_NAME, globalListen)
    }

    addListener(type: string, listener: IMessageListener<any, any>) {
        this.listeners[type] = listener;
        const that = this;
        return function () {
            delete that.listeners[type]
        }
    }

    addProxy(proxy: IMessageProxy): void {
        this.proxy = proxy
    }

    requestMessage<RESPONSE>(type: string, data: any, header?: SessionHeader): Promise<BaseMessageResponse<RESPONSE>> {
        let resolveFun: (arg0: BaseMessageResponse<RESPONSE>) => void;
        let rejectFun: (arg0: BaseMessageResponse<RESPONSE>)=>void
        const returnPromise: Promise<BaseMessageResponse<any>> = new Promise((resolve,reject) => {
            resolveFun = resolve;
            /**如果忽略异常，则直接通过 resolve 响应*/
            rejectFun = header.withCatch ? reject : resolve;
        })

        // 创建唯一事件ID，区分同时发出的多个事件
        let funId = type + Date.now() + Math.random()
        let timer = setTimeout(function () {
            rejectFun({
                success: false,
                error: 'timeout',
                data: undefined,
                status: RESPONSE_STATUS_CODE.TIMEOUT,
                statusText: 'timeout'
            })
        }, header?.timeout || this.option.timeout)

        const that = this;
        /**注册单次发送message的响应监听*/
        const onceFunIdListener: IMessageListener<any, any> = function (responseData: BaseMessageResponse<any>) {
            delete that.listeners[funId]; // 响应处理后，清空监听
            clearTimeout(timer)
            if(responseData?.status && responseData?.status !== RESPONSE_STATUS_CODE.SUCCESS){
                rejectFun(responseData)
            }else{
                resolveFun(responseData)
            }
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
                withCatch: header.withCatch,
                timeout: header.timeout || DEFAULT_TIMEOUT,
            },
            type: type,
        }

        const key = this.option.listenKey;
        triggerMessage(key, requestData);
        return returnPromise;
    }

    stopListen(): void {
        this.state = STATUS.STOP
    }
}

export default SessionStorageBridge
