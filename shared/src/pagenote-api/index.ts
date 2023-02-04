import {generateApi} from "./core";
import {BaseMessageHeader} from "../communication/base";
import ExtensionMessage2 from "../communication/ExtenstionBridge";
import SessionStorageBridge from "../communication/sessionStorageBridge";

export const PAGENOTE_SESSION_LISTEN_KEY = 'pagenote-message'


let bridge: any;
const TIMEOUT = 10000;
export const defaultWrapper = function (method: string, targetId: string, clientId: string = 'common-api') {
    return function (request: any, header: Partial<BaseMessageHeader> = {
        targetClientId: targetId
    }) {
        // bridge 运行时初始化，
        if (!bridge) {
            // 优先使用 extension runtime message; Edge 普通网页也会有 chrome.runtime 对象、故还需要进一步判断 onMessage
            if (globalThis && globalThis.chrome && chrome.runtime && chrome.runtime.onMessage) {
                bridge = new ExtensionMessage2(clientId, {
                    asServer: true,
                    isBackground: true,
                    timeout: TIMEOUT,
                    targetClientId: targetId,
                })
            } else {
                bridge = new SessionStorageBridge(clientId, {
                    asServer: true,
                    listenKey: PAGENOTE_SESSION_LISTEN_KEY,
                    timeout: TIMEOUT,
                    targetClientId: targetId,
                })
            }
        }

        return bridge.requestMessage(method, request, {
            requestNamespace: targetId,// 默认请求 targetId 为命名空间，若一个服务下有多个权限控制，如 get\set 可自定义 header 修改
            ...header,
            targetClientId: targetId,
        })
    }
};

const api = generateApi(defaultWrapper);

export default api
