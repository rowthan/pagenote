/**
 * server & client
 * 消息传递请求头，类似 HTTP header
 * */

type BaseMessageHeader = {
    originClientId: string, // 源头客户端，用于判断这个请求最初的发起端；可用于服务端响应后，判断是否由自身发起的。
    senderClientId: string, // 当前请求源
    targetClientId: string, // 目标寻址源
    timeout?: number // 超时时间
    isResponse: boolean // 请求类型，请求、响应

    funId?: string // 所有请求公用同一个通信通道时（dom\session\iframe），用于识别一对请求、响应。

    keepConnection?: boolean, // extension 通信时，用于标识是否需要保持连接（响应处理函数为异步时）
    targetTabId?: number // extension 通信时，用于标识目标tab

    targetOrigin?: string // iframe 通信时，可指定 origin，来减少广播对象

    hostname?: string // session bridge 请求时携带当前URL信息
}

/**
 * client
 * */
type BaseMessageRequest = {
    data: any,
    type: string,
    header: BaseMessageHeader,
}

/**
 * server
 * */
type BaseMessageSender = {
    header: BaseMessageHeader,
}

/**
 * server
 * */
type BaseMessageResponse<T> = {
    success: boolean,
    data:T,
    error?:any
}

/**
 * server
 * */
interface IBaseSendResponse<T> {
    (responseData: BaseMessageResponse<T>):void
}

/**
 * server
 * request: 该监听器客户端发起的请求数据，不可预测，因接口不同
 * response: 返回数据格式，不可预测，因接口不同
 * sender: 基础header格式，继承至baseHeader,可以自定义扩展header信息
 * */
interface IBaseMessageListener<Request,Sender,Response,ListenReturn=void>{
    (request:Request,sender: Sender & BaseMessageSender,sendResponse:IBaseSendResponse<Response>):ListenReturn;
}

interface IBaseMessageProxy<Request,Sender,Response,ProxyReturn=void> {
    (request:Request & BaseMessageRequest, sender: Sender & BaseMessageSender, sendResponse:IBaseSendResponse<Response>):ProxyReturn
}

interface CommunicationOption {
    asServer: boolean, // 是否作为服务器端使用
    timeout: number,
    targetClientId?: string, // 连线的目标对象
    element?: HTMLElement|null, // domBridge 监听的 DOM 节点
    listenKey?: string, // sessionStorageBridge 监听的key值
}

enum STATUS {
    UN_READY='0',
    READY='1',
    STOP='-1'
}

interface Communication<SENDER extends BaseMessageSender> {
    option: CommunicationOption
    proxy: IBaseMessageProxy<BaseMessageRequest, SENDER, any>,
    listeners: Record<string, IBaseMessageListener<any, SENDER, any>>
    state: STATUS
    clientId: string
    // constructor (clientId:string,option:CommunicationOption):void

    startListen():void
    stopListen():void
    addListener(type:string,fun:IBaseMessageListener<any, BaseMessageSender, any>):()=>void
    addProxy(proxy: IBaseMessageProxy<any, BaseMessageSender, any>): void

    requestMessage(type:string,data: any, header?: BaseMessageHeader,callback?:(data:BaseMessageResponse<any>)=>void):Promise<BaseMessageResponse<any>>

    responseMessage(type:string,data: any, header?: BaseMessageHeader):void
}

type ListenerResponse = Promise<any> | void | boolean // 返回promise不关闭连接，无返回则立即关闭连接

interface IExtenstionMessageListener<R, T> extends IBaseMessageListener<R, chrome.runtime.MessageSender, T, ListenerResponse> {}

interface IExtenstionMessageProxy extends IBaseMessageProxy<BaseMessageRequest, chrome.runtime.MessageSender, ListenerResponse, ListenerResponse> {}

export {
    STATUS
}
export type {
    IBaseMessageListener,
    IBaseMessageProxy,
    IBaseSendResponse,

    BaseMessageHeader,
    BaseMessageResponse,
    BaseMessageRequest,

    Communication,
    CommunicationOption,
    IExtenstionMessageProxy,
    IExtenstionMessageListener
}

