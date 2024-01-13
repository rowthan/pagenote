/**
 * server & client
 * 消息传递请求头，类似 HTTP header
 * */

export type DataSegment = {
    totalSegments: number // 总计分片数量
    currentSegment: number // 当前分片位置
    contentType: 'json', // 目前仅支持json数据类型
    segmentString: string, // 分片数据，通过字符串传播，接收完毕后，接收方组装
}

// TODO clientID 统一更名为 bridgeId
export interface BaseMessageHeader {
    originClientId: string, // 源头客户端，用于判断这个请求最初的发起端；可用于服务端响应后，判断是否由自身发起的。
    senderClientId: string, // 当前请求源
    targetClientId: string, // 目标寻址源
    timeout: number // 超时时间
    isResponse: boolean // 区分请求类型，请求/响应
    withCatch?: boolean // false，默认全部都在 then 中返回，由业务方自行处理异常；true , 异常将通过 reject 抛出，并由使用方在catch 中捕获 TODO 统一后删除



    /**
     * 缓存协议。和 http 不同，插件模式下客户端不感知缓存的存在，由服务器（background）端基于缓存协议，决定是否运行代码，以实现高效响应。
     * maxAge: 单位毫秒
     * */
    cacheControl?:{
        maxAgeMillisecond: number
    },

    /**
     * 定时任务控制
     * */
    scheduleControl?:{
        // 设定延迟执行任务； [0,60000,120000] 表示，0秒后执行（立即执行），60秒后执行，120秒后执行
        runAfterMillisecond?: number[] // 延迟执行请求，单位 毫秒；延迟运行
        // runAtTime?: number // 指定运行时间
    }

    // Etag?: string
    /**
     * 信息载体，用于将数据临时存储在其他载体中
     * 1. 数据无法被序列化(2进制\blob文件)；需要同域空间下
     * 2. 数据量较大时，无法传递
     * */
    carrier?:{
        carrierType: "segments", //'indexedDB' | "network" | "blobURL" | 待支持
        network?: string // 通过http网络获取，需联网
        indexedDB?: string // 通过 indexedDB 获取，有同域限制
        blobURL?: string // 有同域限制（Firefox）
        segments?: DataSegment // 分片组装，无限制
    }

    /**1. bridge 荷载有限的情况下(session/localStorage bridge 单次请求数据量最多为 5MB 时)；通过使用uri的方式载体
     * todo ,统一归纳至 carrier 中去，删除此字段
     * */
    requestDataUri?: string


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

    senderURL: string // 请求方网页地址

    // [key: string]: string | boolean | number | any
}

type BaseMessageResponseHeader = {
    [key: string]: string | number
}


export const DEFAULT_TIMEOUT = 10000;

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
    CACHE = 304,
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
    data:T | null,
    error?:any

    /**
     * 模拟 http 状态文档；异常数据
     * */
    statusText: string;
    /**
     * 响应状态码，模拟 http 状态码；接收方接收到此信息时，用于 throw 抛出， Promise.reject 依据
     * */
    status: RESPONSE_CODE

    header?: BaseMessageResponseHeader
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

    BaseMessageResponse,
    BaseMessageRequest,

    Communication,
    CommunicationOption,
    IExtenstionMessageProxy,
    IExtenstionMessageListener
}

