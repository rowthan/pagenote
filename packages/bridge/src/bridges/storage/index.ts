import BridgeByStorage, {CommonBridgeOption} from "./BridgeByStorage";
import type {BaseMessageRequest, CommunicationOption} from "../../base";
import StorageChange = chrome.storage.StorageChange;

interface BridgeOption extends CommunicationOption {
    listenKey: string
}

// todo 这里修改 storage 事件的event name，区分 local&session storage
const EVENT_NAME = 'storage';

// 全局广播事件，但不携带任何数据，接收方需要从共享空间中自取数据，防止 local/session/其他监听串台。
function triggerGlobalStorageEvent() {
    const newEvent = new Event(EVENT_NAME);
    window.dispatchEvent(newEvent)
}

/**
 * session bridge 同一个窗口内的会话通信
 * iframe 之间共享 sessionStorage。
 * storage 值变更事件，自身不会收到 storage 事件，只会对外发送 storage 事件
 * */
export function getSessionStorageBridge(id:string,option: Partial<CommonBridgeOption> & {listenKey:string} ) {
    return new BridgeByStorage(id, {
        ...option,
        asServer: option.asServer || false,
        timeout: option.timeout || 4000,
        sendRequest: function (key, value) {
            sessionStorage.setItem(key,value);
            triggerGlobalStorageEvent()
        },
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
                    if(event.key && event.key !== option.listenKey){
                        return;
                    }
                    /**
                     * localStorage 通信不需要从 storage 中取数，直接从 event 事件中取数更加准确，避免自定义 custom storage 事件的混淆
                     * 避免和 sessionStorage 通信异常
                     * */
                    const dataString = event?.newValue || '';
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
