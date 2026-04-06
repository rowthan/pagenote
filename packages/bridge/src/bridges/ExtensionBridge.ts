import type {
  BaseMessageHeader,
  BaseMessageRequest,
  BaseMessageResponse,
  BaseMessageSender,
  Communication,
  CommunicationOption,
  IBaseSendResponse,
  IExtenstionMessageListener,
  IExtenstionMessageProxy,
} from "../base";
import {
  CommunicationClient,
  DEFAULT_TIMEOUT,
  RESPONSE_STATUS_CODE,
  STATUS,
} from '../base'
import {shouldResolveRequest, sumSizeMB} from "../utils";
import MessageSender = chrome.runtime.MessageSender;

type ExtensionOption = CommunicationOption & {
  isBackground: boolean
}

// 默认返回数据：失败、超时
const messengerMap: Record<string, boolean> = {}


function isPromise(value:any) {
  return typeof value === 'object' && value !== null && 'then' in value && 'catch' in value;
}

function sendMessageByExtension<T>(tabId:number,request: BaseMessageRequest,requestCallback?:(data: BaseMessageResponse<T>)=> void) {
  // 单次请求数据量不能超过 50mb ，否则可能失败，
  const data = request.data;
  let dataSizeMB = 0;
  try{
    dataSizeMB = data ? sumSizeMB(JSON.stringify(data)) : 0
  }catch (e) {
    console.error('sum size',e)
  }
  /**
   * 一次请求按50MB分片处理计算。
   * 不能通过URL传输，是因为 Firefox 不支持跨域的访问文件资源，background 无法解析文件URL
   * TODO 区分 Firefox，其他浏览器用URL方式传递数据
   * **/
  const segments = Math.ceil(dataSizeMB / 50)
  // 分片大于1时，分批次发送数据
  if(segments>1){
    const dataString = JSON.stringify(data);
    const totalStringLength = dataString.length;
    const onceStringLength = Math.ceil(totalStringLength / segments)
    for(let i=0; i<segments; i++){
      const segmentRequest: BaseMessageRequest = {
        header: {
          ...request.header,
          carrier:{
            carrierType: "segments",
            segments:{
              totalSegments: segments, // 总计分片数量
              currentSegment: i, // 当前分片位置
              contentType: 'json', // 目前仅支持json数据类型
              segmentString: dataString.substring(i*onceStringLength,i*onceStringLength+onceStringLength), // 单次请求携带的数据
            }
          }
        },
        type: request.type,
        data: undefined,// 原始数据清空
      }
      // 最后一个片段增加监听，其他的片段不监听响应
      sendMessageByExtension(tabId,segmentRequest,i===segments-1 ? requestCallback : undefined)
    }
    return;
  }


  if(tabId){ // background -》 front
    try{
      // @ts-ignore
      chrome.tabs.sendMessage(tabId,request,requestCallback)
    }catch (e) {
      requestCallback && requestCallback({
        status: RESPONSE_STATUS_CODE.UN_REACHED,
        statusText: "101",
        success: false
      })
    }
  }else{ // front -> background
    try{
      // @ts-ignore
      chrome.runtime.sendMessage(request,requestCallback)
    }catch (e) {
      requestCallback && requestCallback({
        status: RESPONSE_STATUS_CODE.UN_REACHED,
        statusText: "101",
        success: false
      })
      // onDisconnect
    }
  }
}


export default class ExtensionMessage implements Communication<any>{
  clientId: string; // 当前信使的ID todo remove property
  client: CommunicationClient;
  proxy: IExtenstionMessageProxy; // 所有消息的监听代理
  listeners: Record<string, IExtenstionMessageListener<any, any>> = {} // 指定事件的监听
  state: STATUS
  option: ExtensionOption

  constructor(id:string,options?:ExtensionOption) {
    if(messengerMap[id]){
      console.warn(id,' already exist')
    }
    messengerMap[id] = true;
    this.option = options || {
      asServer: true,
      timeout: 8000,
      isBackground: true,
    };
    this.clientId = id;
    this.client = new CommunicationClient(id,this.option)
    this.state = STATUS.UN_READY
    this.proxy = function () {
      return false
    };

    if(this.option.asServer){
      this.startListen();
    }
  }

  /**
   * 开启服务监听
   * */
  startListen(){
    // 监听全局 message 消息
    const that = this;
    const tempSegmentsMap: Record<string, string[]> = {}
    // TODO 对 sendResponse 进行包装处理，当数据量大于限制时，background-front 无法发送完整数据
    const globalMessageListener = function (request:BaseMessageRequest,sender: chrome.runtime.MessageSender,callResponse:IBaseSendResponse<any>):boolean {
      if(that.state!==STATUS.READY){
        return false;
      }
      // 非 API 模式的调用不监听处理

      const { data,type,header} = request;
      const {carrier,targetClientId} = header || {};

      const resolveResponse = true;
      // todo 是否处理请求 & 是否响应请求判断。待开放，目前 targetClientId 为 作为namespace 使用，待迁移后可开放监测
      // const resolveCheck = shouldResolveRequest(request,that.client)
      //
      // /***通信不匹配，不需要处理请求*/
      // if(!resolveCheck.resolveRequest){
      //   return false;
      // }

      function sendResponse(data:BaseMessageResponse<any>){
        /**需要响应时，响应 response*/
        if(resolveResponse){
          callResponse(data)
        } else {
          return;
        }
      }


      /**
       * 分片请求，等待数据接收完毕，重新组装后调用
       * */
      if(data===undefined && (carrier?.segments?.totalSegments || 0) > 0){
        tempSegmentsMap[type] = tempSegmentsMap[type] || new Array(carrier?.segments?.totalSegments).fill(null)
        tempSegmentsMap[type][carrier?.segments?.currentSegment|| 0] = carrier?.segments?.segmentString || '';

        const isFullSegments = tempSegmentsMap[type].every(function (item) {
          return item!==null;
        })

        if(isFullSegments){
          /**
           * 分片接受完毕后，重新组装数据;
           * 重新赋值 request，清空分片数据
           * */
          const dataString = tempSegmentsMap[type].join('');
          try{
            const originData = JSON.parse(dataString);
            request.header.carrier = undefined;
            request.data = originData;
            delete tempSegmentsMap[type]
          }catch (e) {
            sendResponse({
              data: undefined,
              error: e,
              status: RESPONSE_STATUS_CODE.INTER_ERROR,
              statusText: "segments error",
              success: false
            })
          }
        }else{
          // 清空分片缓存
          setTimeout(function () {
            delete tempSegmentsMap[type]
          },header.timeout ||20*1000)
          return false;
        }
      }


      const { senderClientId,originClientId,targetTabId,isResponse, withCatch=false, timeout=DEFAULT_TIMEOUT } = header || {};

      // 1. 单线模式，只监听某个目标对象的请求。 非目标请求源，事件、代理均不响应
      if(that.option.targetClientId && senderClientId && senderClientId!==that.option.targetClientId){
        return false
      }
      // 封装 sender 信息，原生基础上加入 header 标识信息
      const thisSender: BaseMessageSender = {
        ...sender,
        header:{
          ...header,
          targetTabId: targetTabId,
          originClientId : originClientId,
          senderClientId : senderClientId,
          senderURL: chrome.runtime.getURL('/'),
          targetClientId : senderClientId,
          isResponse: isResponse,
          withCatch: withCatch,
          timeout: timeout
        }
      }

      let res;

      const listenFun = that.listeners[type];
      // 2. 请求源有明确目标服务节点时，判断是否当前 clientId ，监听器响应
      if(targetClientId && targetClientId===that.clientId && listenFun){
        try{
          res = listenFun(data,thisSender,sendResponse);
        }catch (e) {
          sendResponse({
            data: undefined,
            error: e,
            status: RESPONSE_STATUS_CODE.INTER_ERROR,
            statusText: "inner error by listen",
            success: false
          })
        }
      } else {
        // 3. 代理模式，响应非 listener 的剩余请求，代理器内部判断目的地服务是否匹配
        try{
          that.proxy && that.proxy(request,thisSender,sendResponse)
        }catch (e) {
          console.error(e)
          sendResponse({
            data: undefined,
            error: e,
            status: RESPONSE_STATUS_CODE.INTER_ERROR,
            statusText: "inner error proxy",
            success: false
          })
        }
      }

      // 如果返回的是一个 promise，则返回promise（不方便判断promise，简化为判断 function）；否则判断是否断开
      res = isPromise(res) ? true : res!==false;
      // 客户端希望保持连接 或 服务端希望保持连接
      const result = header.keepConnection || res;
      return result;
    }

    chrome.runtime.onMessage.addListener(globalMessageListener);
    this.state = STATUS.READY
    return function () {
      chrome.runtime.onMessage.removeListener(globalMessageListener);
    }
  }

  // 停止监听
  stopListen(){
    this.state = STATUS.STOP
  }

  // 开始监听广播📢
  addListener(type:string,listener:IExtenstionMessageListener<any, any>){
    this.listeners[type] = listener;
    const that = this;
    return function () {
      delete that.listeners[type]
    }
  }

  // 添加全局代理，优先级小于 addListener
  addProxy(proxy: IExtenstionMessageProxy){
    this.proxy = proxy;
  }

  requestMessage<T>(type: string,data: any,header?:Partial<BaseMessageHeader>): Promise<BaseMessageResponse<T>> {
    const request: BaseMessageRequest= {
      type: type,
      data: data,
      header:{
        ...(header || {}),
        timeout: header?.timeout || DEFAULT_TIMEOUT,
        targetClientId: header?.targetClientId || this.option.targetClientId || '',
        originClientId: header?.originClientId || this.clientId,
        senderClientId: this.clientId,
        isResponse: false,
        keepConnection: header?.keepConnection,
        withCatch: header?.withCatch,
      }
    }

    let resolveFun: (data:BaseMessageResponse<T>)=>void;
    let rejectFun: (reason: BaseMessageResponse<T>)=>void;
    const promise: Promise<BaseMessageResponse<T>> = new Promise(function (resolve,reject) {
      resolveFun = resolve;
      /**如果忽略异常，则直接通过 resolve 响应*/
      rejectFun = header?.withCatch ? reject : resolve;
    })

    const timeout = header?.timeout || this.option.timeout;
    let timer = setTimeout(function () {
      rejectFun({
        //@ts-ignore
        data: undefined,
        success: false,
        status: RESPONSE_STATUS_CODE.TIMEOUT,
        statusText: 'timeout'
      })
    },timeout)

    const requestCallback = function (data: BaseMessageResponse<T>) {
      clearTimeout(timer);
      /**状态码不等于 200 时，异常抛出*/
      if(data?.status && data?.status !== RESPONSE_STATUS_CODE.SUCCESS){
        rejectFun(data)
      }else{
        resolveFun(data);
      }
    }

    if(this.option.isBackground){
      const tabId = header?.targetTabId;
      if(tabId){
        sendMessageByExtension(tabId,request,requestCallback)
      }else{
        chrome.tabs.query({active: true, currentWindow: true},function (result) {
          const tabid = result[0]?.id;
          if(tabid){
            sendMessageByExtension(tabid, request,requestCallback);
          }else{
            rejectFun({
              status: RESPONSE_STATUS_CODE.UN_REACHED,
              statusText: 'did not find active tab',
              success: false,
            })
          }
        })
      }
    } else{
      if(chrome && chrome.runtime){
        //@ts-ignore
        sendMessageByExtension(undefined,request,requestCallback);
      }else{
        //@ts-ignore
        rejectFun({
          status: RESPONSE_STATUS_CODE.UN_REACHED,
          statusText: 'Extension is unavailable. refresh please',
          success: false,
          //@ts-ignore
          data: undefined
        })
        console.error("connect extension fail")
      }
    }
    return promise
  }

  responseMessage(type: string, data: any, header?: BaseMessageHeader): void {
    throw new Error(type+" not implemented.");
  }

  /**@deprecated*/
  broadcast(type: string, data: any, header?: BaseMessageHeader){
    if(!this.option.isBackground){
      throw Error('only background can broadcast')
    }

    // 通过 storage 广播存储消息，由接收方自行选择是否接听
    chrome.storage.local.set({
      [type]: {
        data: data,
        header: header,
        type: type,
      }
    });
  }
}
