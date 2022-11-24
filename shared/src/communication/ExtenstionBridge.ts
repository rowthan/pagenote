import {
  BaseMessageHeader,
  BaseMessageRequest,
  BaseMessageResponse,
  Communication,
  CommunicationOption,
  DEFAULT_TIMEOUT,
  IBaseSendResponse,
  IExtenstionMessageListener,
  IExtenstionMessageProxy,
  RESPONSE_STATUS_CODE,
  STATUS
} from "./base";

type ExtensionOption = CommunicationOption & {
  isBackground: boolean
}

// 默认返回数据：失败、超时
const messengerMap: Record<string, boolean> = {}


function isPromise(value:any) {
  return typeof value === 'object' && value !== null && 'then' in value && 'catch' in value;
}


export default class ExtensionMessage2 implements Communication<any>{
  clientId: string; // 当前信使的ID
  proxy: IExtenstionMessageProxy; // 所有消息的监听代理
  listeners: Record<string, IExtenstionMessageListener<any, any>> = {} // 指定事件的监听
  state: STATUS
  option: ExtensionOption

  constructor(id:string,options?:ExtensionOption) {
    if(messengerMap[id]){
      console.warn(id,'已存在'+id,'应注意避免ID重复，可能事件发送监听失败')
    }
    messengerMap[id] = true;
    this.option = options || {
      asServer: true,
      timeout: 8000,
      isBackground: true,
    };
    this.clientId = id;
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
    const globalMessageListener = function (request:BaseMessageRequest,sender: chrome.runtime.MessageSender,sendResponse:IBaseSendResponse<any>):boolean {
      if(that.state!==STATUS.READY){
        return false;
      }
      const { data,type,header} = request;
      const { senderClientId,originClientId,targetClientId,isResponse, withCatch=false, timeout=DEFAULT_TIMEOUT } = header || {};

      // 1. 单线模式，只监听某个目标对象的请求。 非目标请求源，事件、代理均不响应
      if(that.option.targetClientId && senderClientId && senderClientId!==that.option.targetClientId){
        return false
      }
      // 封装 sender 信息，原生基础上加入 header 标识信息
      const thisSender = {
        ...sender,
        header:{
          originClientId : originClientId,
          senderClientId : senderClientId,
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
            statusText: "inner error",
            success: false
          })
        }
      } else {
        // 3. 代理模式，响应非 listener 的剩余请求，代理器内部判断目的地服务是否匹配
        try{
          that.proxy && that.proxy(request,thisSender,sendResponse)
        }catch (e) {
          sendResponse({
            data: undefined,
            error: e,
            status: RESPONSE_STATUS_CODE.INTER_ERROR,
            statusText: "inner error",
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

  requestMessage<T>(type: string,data: any,header?:BaseMessageHeader): Promise<BaseMessageResponse<T>> {
    const request: BaseMessageRequest= {
      type: type,
      data: data,
      header:{
        ...header,
        targetClientId: header?.targetClientId || this.option.targetClientId || '',
        originClientId: header?.originClientId || this.clientId,
        senderClientId: this.clientId,
        isResponse: false,
        keepConnection: header?.keepConnection,
        withCatch: header.withCatch,
      }
    }

    let resolveFun: (data:BaseMessageResponse<T>)=>void;
    let rejectFun: (reason: BaseMessageResponse<T>)=>void;
    const promise: Promise<BaseMessageResponse<T>> = new Promise(function (resolve,reject) {
      resolveFun = resolve;
      /**如果忽略异常，则直接通过 resolve 响应*/
      rejectFun = header.withCatch ? reject : resolve;
    })

    const timeout = header?.timeout || this.option.timeout;
    let timer = setTimeout(function () {
      rejectFun({
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
        chrome.tabs.sendMessage(tabId,request,requestCallback)
      }else{
        chrome.tabs.query({active: true, currentWindow: true},function (result) {
          const tabid = result[0]?.id;
          if(tabid){
            chrome.tabs.sendMessage(tabid, request,requestCallback);
          }else{
            rejectFun({
              status: RESPONSE_STATUS_CODE.UN_REACHED,
              statusText: '未找到当前激活tab页',
              success: false,
              data: undefined
            })
          }
        })
      }
    } else{
      if(chrome && chrome.runtime){
        chrome.runtime.sendMessage(request,requestCallback);
      }else{
        rejectFun({
          status: RESPONSE_STATUS_CODE.UN_REACHED,
          statusText: '插件不可用,刷新后重试',
          success: false,
          data: undefined
        })
        console.error('无法通信插件,')
      }
    }
    return promise
  }

  responseMessage(type: string, data: any, header?: BaseMessageHeader): void {
    console.error('extension 无需实现')
  }
}
