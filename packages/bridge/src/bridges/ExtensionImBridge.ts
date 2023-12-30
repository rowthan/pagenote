// 前后台实时通讯库
import Port = chrome.runtime.Port;

type ServerInfo = {
    tabId: string | number // 当前服务所在的位置
    serverUrl: string, // 当前服务的服务名称
    frameId?: string | number
}

type PortOption = {
    listener?: ImListenFn,
    onConnect: (name:string,port:Port)=>void,
    onDisConnect: (name:string,port:Port)=>void
} & ServerInfo

interface Message {
    type: string,
    data: any,
    portName?: string,
    from?: string
}

interface ImListenFn {
    (message: Message):void
}

function createPortKey(target:ServerInfo) {
    return `${target.tabId}_${target.serverUrl||''}_${target.frameId||''}`;
}

class ImMessage {
    readonly option: PortOption;
    connectedPorts: Record<string, Port> = {}

    constructor(option:PortOption) {
        this.option = option;
        // 已链接的端口
        this.connectedPorts = {}
        const that = this;

        // 开启服务端监听，等待连接请求；无连接key,则说明不支持被动连接
        chrome.runtime.onConnect.addListener(function (port) {
            const connectKey = createPortKey({
                tabId: that.option.tabId,
                serverUrl: that.option.serverUrl
            })
            if(port.name.indexOf(connectKey) > -1){
                that.connectedPorts[port.name] = port;
                that.option?.onConnect(port.name,port);
                port.onDisconnect.addListener(function () {
                    delete that.connectedPorts[port.name]
                    that.option?.onDisConnect(port.name,port);
                });
                if(option.listener){
                    port.onMessage.addListener(option.listener)
                }
            }
        })
    }

    // 主动连接服务端
    connect(targetInfo: ServerInfo,currentPortListener:ImListenFn):void{
        const portName = createPortKey(targetInfo);
        const port = chrome.runtime.connect({
            name: portName,
            includeTlsChannelId: false,
        });
        if(port){
            this.connectedPorts[portName] = port;
            port.onMessage.addListener(currentPortListener)
        }
    }

    // 发送消息
    sendMessage(message:Message,target?:ServerInfo){
        message = {
            ...message,
            from: this.option.tabId+'',
        }
        const path = target ? createPortKey(target) : ''

        for(let i in this.connectedPorts){
            if(i.indexOf(path)>-1 || path === null){
                const targetPort = this.connectedPorts[i];
                targetPort.postMessage({
                    ...message,
                    portName: targetPort.name,
                })
            }
        }
    }
}

export type {
    ImListenFn
}

export default ImMessage
