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
} from "../../base";
import {createURLForJSON, sumSizeMB} from "../../utils";

type SessionHeader = BaseMessageHeader & {
    targetBridgeKey?: number,
}

type SessionSender = {
    header: SessionHeader
}

interface Option extends CommunicationOption{
    storageChangeListener: (callback: (data: BaseMessageRequest)=>void)=>()=>void
    sendRequest: (key: string, value: string)=>void
}

/**
 * 通过可共同使用的存储空间，来作为数据交换的介质
 * */
export default class BridgeByStorage implements Communication<any>{
    clientId: string;
    listeners: Record<string, IBaseMessageListener<any, SessionSender, any>>;
    proxy: IBaseMessageProxy<any, SessionSender, any> = function () {
        return false
    };
    option: Option;
    state: STATUS;


    constructor(id: string, option: Option) {
        this.clientId = id;
        this.option = option;
        this.listeners = {};
        this.startListen();
        this.state = STATUS.READY
    }

    addListener(type: string, listener: IBaseMessageListener<any, any, any>){
        this.listeners[type] = listener;
        const that = this;
        return function () {
            delete that.listeners[type]
        }
    }

    addProxy(proxy: IBaseMessageProxy<any, SessionSender, any>): void {
        this.proxy = proxy
    }

    broadcast(type: string, data: any, header?: BaseMessageHeader) {
        this.requestMessage(type, data, {
            ...(header || {}),
            targetClientId: null, // 通过指定 targetClient null 指定广播
            originClientId: this.clientId,
            senderClientId: this.clientId,
            timeout: this.option.timeout,
            isResponse: false,
        });
    }

    requestMessage<RESPONSE>(type: string, data: any, header?: BaseMessageHeader, callback?: (data: BaseMessageResponse<any>) => void): Promise<BaseMessageResponse<any>> {
        let resolveFun: (arg0: BaseMessageResponse<RESPONSE>) => void;
        let rejectFun: (arg0: BaseMessageResponse<RESPONSE>) => void
        const returnPromise: Promise<BaseMessageResponse<any>> = new Promise((resolve, reject) => {
            resolveFun = resolve;
            /**如果忽略异常，则直接通过 resolve 响应*/
            rejectFun = header?.withCatch ? reject : resolve;
        })

        // 创建唯一事件ID，区分同时发出的多个事件
        let funId = this.clientId + type + Date.now() + Math.random()
        let timer = setTimeout(function () {
            rejectFun({
                success: false,
                error: 'timeout',
                //@ts-ignore
                data: undefined,
                status: RESPONSE_STATUS_CODE.TIMEOUT,
                statusText: 'timeout'
            })
        }, header?.timeout || this.option.timeout || 4000)

        const that = this;
        /**注册单次发送message的响应监听*/
        const onceFunIdListener: IBaseMessageListener<any, any,any> = function (responseData: BaseMessageResponse<any>) {
            delete that.listeners[funId]; // 响应处理后，清空监听
            clearTimeout(timer)
            if (responseData?.status && responseData?.status !== RESPONSE_STATUS_CODE.SUCCESS) {
                rejectFun(responseData)
            } else {
                resolveFun(responseData)
            }
        }
        this.addListener(funId, onceFunIdListener)

        const targetClientId = header?.targetClientId || this.option.targetClientId || ''
        const requestData: BaseMessageRequest = {
            data: data,
            header: {
                ...(header||{}),
                originClientId: header?.originClientId || this.clientId, // 源头客户端
                senderClientId: this.clientId, // 当前客户端
                targetClientId: targetClientId,
                targetOrigin: header?.targetOrigin,
                funId: header?.funId || funId,
                isResponse: header?.isResponse === true,
                hostname: window.location.hostname,
                senderURL: window.location.href,
                withCatch: header?.withCatch,
                timeout: header?.timeout || DEFAULT_TIMEOUT,
            },
            type: type,
        }

        this._sendMessage(requestData);
        return returnPromise;
    }

    responseMessage(type: string, data: any, header: BaseMessageHeader & {funId: string}): void {
        this._sendMessage({
            type: type,
            data: data,
            header: {
                ...header,
                isResponse: true,
            }
        })
    }

    startListen() {
        const that = this;
        const globalListen = async function (requestData:BaseMessageRequest) {
            if(that.state === STATUS.STOP){
                return;
            }
            const {header, type} = requestData || {};
            that._debug('receive message', requestData)
            if (!header || !type) {
                that._debug('invalid request data')
                return;
            }
            // 请求来自自身，忽略
            if (header.senderClientId === that.clientId) {
                that._debug('ignore self message ',that.clientId)
                return;
            }
            // 请求方指定目标服务器，不是当前服务器，则忽略
            if(header.targetClientId && header.targetClientId !== that.clientId){
                that._debug('target client not matched',header.targetClientId,that.clientId)
                //   todo 拦截此类请求 open api 代理转发时，客户端 id 进行来重写，导致身份错误
            }
            // 请求类型 且 配置不作为服务器，则不接受请求
            if (header.isResponse === false && that.option.asServer === false) {
                that._debug('as server false')
                return;
            }
            // // 自身只监听特定客户端的请求，则忽略其他客户端的消息 插件发送的时候会指定 targetClientId todo 将其删除，通过 namespace 来区分处理后，可以打开，否则会被拦截如 user.getWhoAmI
            // if(that.option.targetClientId && header.senderClientId !== that.option.targetClientId){
            //     that._debug(`sender client(${header.senderClientId}) is not config target client::`, that.option)
            //     return;
            // }
            // 响应类型，但非目标客户端，则忽略
            if(header.isResponse && header.targetClientId!==that.clientId){
                that._debug('response message ignore not target client',requestData)
                return;
            }

            if (requestData?.header?.requestDataUri && !requestData.data) {
                try {
                    const dataRes = await fetch(requestData.header.requestDataUri);
                    requestData.data = await dataRes.json();
                } catch (e) {
                    console.error('parse requestDataUri ERROR', e)
                }
            }

            const sendResponse = function (data: any) {
                // 如果接收到的是响应请求，则结束请求
                if(header.isResponse){
                    return;
                }
                that.responseMessage(type,data,{
                    ...header,
                    funId: header.funId || '',
                    originClientId: header.originClientId,
                    targetClientId: header.senderClientId,
                    senderClientId: that.clientId,
                })
            }
            const sender: SessionSender = {
                header: header
            }
            const functionId = header.funId || ''
            const resolveFun = that.listeners[functionId] || that.listeners[type]
            if (resolveFun && typeof resolveFun === 'function') {
                // 事件有明确目标源，校验当前是否为接收方
                resolveFun(requestData.data, sender, sendResponse);
                // 清空监听器
                delete that.listeners[functionId];
                that._cleanMessageStorage();
            } else if (that.proxy) {
                // 代理模式，可以接收处理所有请求，在内部自行判断是否为目标源
                that.proxy(requestData, sender, sendResponse);
                that._cleanMessageStorage();
            }
        }

        return this.option.storageChangeListener(globalListen)
    }

    // 通讯结束后，清空缓存介质
    _cleanMessageStorage(){

    }

    /**对外发送请求数据
     * 针对大数据序列化处理
     * */
    _sendMessage(requestData: BaseMessageRequest){
        const key = this.option.listenKey || '';
        let dataString = JSON.stringify(requestData)
        // 初步估计信息占用空间
        const totalMB = sumSizeMB(dataString);
        // 请求数据大于 4MB 时，将数据进行转换为URI地址，防止 sessionStorage 无法承载
        if (totalMB > 4) {
            requestData.header.requestDataUri = createURLForJSON(requestData.data);
            requestData.data = undefined; // 转移数据为 requestDataUri
            dataString = JSON.stringify(requestData)
        }
        this.option.sendRequest(key,dataString)
    }

    _debug(..._args:any){
        // console.warn(..._args)
    }

    stopListen(): void {
        this.state = STATUS.STOP
    }

}
