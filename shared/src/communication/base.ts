/**
 * server & client
 * 消息传递请求头，类似 HTTP header
 * */
// TODO clientID 统一更名为 bridgeId
type BaseMessageHeader = {
    originClientId: string, // 源头客户端，用于判断这个请求最初的发起端；可用于服务端响应后，判断是否由自身发起的。
    senderClientId: string, // 当前请求源
    targetClientId: string, // 目标寻址源
    timeout: number // 超时时间
    isResponse: boolean // 区分请求类型，请求/响应
    withCatch?: boolean // false，默认全部都在 then 中返回，由业务方自行处理异常；true , 异常将通过 reject 抛出，并由使用方在catch 中捕获

    /**
     * 信息载体，用于
     * 1. bridge 荷载有限的情况下(session/localStorage bridge 单次请求数据量最多为 5MB 时)；
     * 2. 数据无法被序列化(2进制文件)；
     * 将数据临时存储在其他载体中。
     * */
    carrier?:{
        carrierType: 'indexedDB',
        carrierKey: string
    }


    /**
     * 请求的命名空间，用于分组权限控制
     * */
    requestNamespace?: string;

    /**
     * 所有请求公用同一个通信通道时（dom\session\iframe），用于识别一对请求、响应 TODO 更名为 sessionId
     * */
    funId?: string

    /**
     * extension 通信时，用于标识是否需要保持连接（响应处理函数为异步时）
     * */
    keepConnection?: boolean,
    targetTabId?: number // extension 通信时，用于标识目标tab

    targetOrigin?: string // iframe 通信时，可指定 origin，来减少广播对象

    hostname?: string // session bridge 请求时携带当前URL信息

    [key: string]: string | boolean | number | any
}


export const DEFAULT_TIMEOUT = 8000;

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
export enum RESPONSE_STATUS_CODE {
    SUCCESS = 200,
    AUTH_REQUIRED = 401,
    PERMISSION_REQUIRED = 403,
    NOT_ALLOWED = 503,
    TIMEOUT = 100,
    UN_REACHED =  101, // 不可触达，通信通道被关闭，或无插件上下文
    NOT_FOUND = 404,
    INTER_ERROR = 500,
}

export type RESPONSE_CODE = RESPONSE_STATUS_CODE | number;
type BaseMessageResponse<T> = {
    success: boolean,
    data:T,
    error?:any

    /**
     * 模拟 http 状态文档；异常数据
     * */
    statusText: string;
    /**
     * 响应状态码，模拟 http 状态码；接收方接收到此信息时，用于 throw 抛出， Promise.reject 依据
     * */
    status: RESPONSE_CODE
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

export enum STATUS {
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

