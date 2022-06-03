import {
  IExtenstionMessageProxy,
  IExtenstionMessageListener,
  BaseMessageHeader,
  BaseMessageRequest,
  BaseMessageResponse,
  Communication,
  CommunicationOption,
  IBaseSendResponse,
  STATUS
} from "./base";

type ExtensionOption = CommunicationOption & {
  isBackground: boolean
}

// 默认返回数据：失败、超时
const defaultErrorData: BaseMessageResponse<any> = {success:false,error:'调用失败',data:null}
const timeoutError: BaseMessageResponse<any> = {success:false,error:'timeout',data:null}
const messengerMap: Record<string, boolean> = {}


function isPromise(value:any) {
  return typeof value === 'object' && value !== null && 'then' in value && 'catch' in value;
}


class Message2 implements Communication<any>{
  clientId: string; // 当前信使的ID
  proxy: IExtenstionMessageProxy; // 所有消息的监听代理
  listeners: Record<string, IExtenstionMessageListener<any, any>> = {} // 指定事件的监听
  state: STATUS
  option: ExtensionOption

  constructor(id:string,options?:ExtensionOption) {
    if(messengerMap[id]){
      console.error(id,'已存在，不可创建')
      throw Error('该ID已存在')
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
      const { data,type,header={senderClientId:'',originClientId:'',targetClientId:'',keepConnection:false,isResponse:false} } = request;
      const { senderClientId,originClientId,targetClientId,isResponse } = header;

      const requestTargetClientId = targetClientId || that.option.targetClientId;

      // 目标识别：如果请求方 确定了发送对象是当前 client
      if(requestTargetClientId && requestTargetClientId!==that.clientId){
        return false
      }
      const listenFun = that.listeners[type];
      // 封装 sender 信息，原生基础上加入 header 标识信息
      const thisSender = {
        ...sender,
        header:{
          originClientId : originClientId,
          senderClientId : senderClientId,
          targetClientId : senderClientId,
          isResponse: isResponse,
        }
      }

      let res;
      if(listenFun && typeof listenFun==='function'){
        res = listenFun(data,thisSender,sendResponse);
      }
      if(typeof that.proxy === 'function'){
        res = that.proxy(request,thisSender,sendResponse);
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
    return this;
  }

  // 添加全局代理，优先级小于 addListener
  addProxy(proxy: IExtenstionMessageProxy){
    this.proxy = proxy;
  }

  requestMessage(type: string,data: any,header?:BaseMessageHeader): Promise<BaseMessageResponse<any>> {
    const request: BaseMessageRequest= {
      type: type,
      data: data,
      header:{
        targetClientId: header?.targetClientId || this.option.targetClientId || '',
        originClientId: header?.originClientId || this.clientId,
        senderClientId: this.clientId,
        isResponse: false,
        keepConnection: header?.keepConnection
      }
    }

    let resolveFun: (data:BaseMessageResponse<any>)=>void;
    const promise: Promise<BaseMessageResponse<any>> = new Promise(function (resolve,reject) {
      resolveFun = resolve;
    })

    const timeout = header?.timeout || this.option.timeout;
    let timer = setTimeout(function () {
      resolveFun({
        success: false,
        error: {
          reason: 'timeout after '+ timeout,
          request: request
        },
        data: null
      })
      console.warn('timeout',request)
    },timeout)

    const requestCallback = function (data: BaseMessageResponse<any>) {
      clearTimeout(timer)
      resolveFun(data);
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
            throw Error('未找到当前激活tab页')
          }
        })
      }
    } else{
      if(chrome && chrome.runtime){
        chrome.runtime.sendMessage(request,requestCallback);
      }else{
        requestCallback({
          success: false,
          error: '插件不可用',
          data: null,
        })
      }
    }
    return promise
  }

  responseMessage(type: string, data: any, header?: BaseMessageHeader): void {
    console.error('extension 无需实现')
  }
}

export default Message2;
