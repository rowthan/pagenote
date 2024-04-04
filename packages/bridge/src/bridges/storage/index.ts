import BridgeByStorage from "./BridgeByStorage";
import type {BaseMessageRequest, CommunicationOption} from "../../base";
import StorageChange = chrome.storage.StorageChange;

interface BridgeOption extends CommunicationOption {
    listenKey: string
}


// todo 修改监听事件名称
const EVENT_NAME = 'storage';
function setSessionStorageRequest(key:string,value:string) {
    try {
        window.sessionStorage.setItem(key, value);
    } catch (e) {
        console.error('data oversize', e)
    }

    const event = new Event(EVENT_NAME);
    window.dispatchEvent(event)
}

/**
 * session bridge 单个页面的会话通信
 * */
export function getSessionStorageBridge(id:string,option:BridgeOption) {
    return new BridgeByStorage(id, {
        ...option,
        sendRequest: setSessionStorageRequest,
        storageChangeListener(callback: (data: BaseMessageRequest) => void) {
            function changeListener(event:any) {
                try {
                    // 通道判断，过滤业务的读写storage事件
                    if(event.key && event.key !== option.listenKey){
                        return;
                    }
                    let dataString: string = ''
                    dataString = event?.newValue || sessionStorage.getItem(option.listenKey) || '';
                    if (!dataString) {
                        return;
                    }
                    const requestData = JSON.parse(dataString);
                    callback(requestData);
                } catch (e) {
                    return;
                }
            }
            window.addEventListener(EVENT_NAME, changeListener)
            return function () {
                window.removeEventListener(EVENT_NAME, changeListener)
            }
        }
    });
}


/**
 * local bridge 跨页面的会话通信
 * 适用于跨页面的通信，storage 事件默认不会接收当前页面自身的消息。
 * 只有多个页面相互之间通信，才会生效
 * 案例：监测是否有相同页面被打开
 * */
export function getLocalStorageBridge(id:string,option:BridgeOption) {
    return new BridgeByStorage(id, {
        ...option,
        sendRequest: function (key, value) {
            localStorage.setItem(key,value);
        },
        storageChangeListener(callback: (data: BaseMessageRequest) => void) {
            function changeListener(event: StorageEvent) {
                try {
                    // 通道判断
                    if(event.key !== option.listenKey){
                        return;
                    }
                    let dataString: string = ''
                    dataString = event?.newValue || localStorage.getItem(option.listenKey) || '';
                    if (!dataString) {
                        return;
                    }
                    const requestData = JSON.parse(dataString);
                    callback(requestData);
                } catch (e) {
                    return;
                }
            }
            window.addEventListener('storage',changeListener)
            return function () {
                window.removeEventListener('storage',changeListener);
            }
        }
    });
}

/**
 * extension bridge
 * 通过 chrome.storage.local 通讯
 * */
export function getStorageLocalBridge(id: string, option: BridgeOption) {
    return new BridgeByStorage(id, {
        ...option,
        sendRequest: function (key, value) {
            chrome.storage.local.set({
                [key]: value,
            });
        },
        storageChangeListener(callback: (data: BaseMessageRequest) => void) {
            function listenChange(changes: {[p: string]: StorageChange}) {
                if(changes[option.listenKey]){
                    const newValue = changes[option.listenKey].newValue;
                    callback(typeof newValue === "string" ? JSON.parse(newValue) : newValue);
                }
            }
            chrome.storage.local.onChanged.addListener(listenChange);
            return function () {
                chrome.storage.local.onChanged.removeListener(listenChange)
            }
        }
    });
}


/**
 * 跨域名的通信方式。
 * */
export function getIframeBridge(id:string,option: BridgeOption) {
    return new BridgeByStorage(id, {
        ...option,
        sendRequest: function (key, value) {
            const data = JSON.parse(value);
            const targetOrigin = data?.header?.targetOrigin || '*';
            //  当前仅支持当前页的通信，todo，支持选择frame、指定window（opener）页面发送消息
            window.postMessage(data,targetOrigin)
        },
        storageChangeListener(callback: (data: BaseMessageRequest) => void) {
            function listenChange(messageEvent:MessageEvent) {
                callback(messageEvent.data)
            }
            window.addEventListener("message", listenChange, false);
            return function () {
                window.removeEventListener("message", listenChange, false);
            }
        }
    });
}


export {
    BridgeByStorage
};
