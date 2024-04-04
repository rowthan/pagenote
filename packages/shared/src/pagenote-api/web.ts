import {generateApi} from "./core";
import {BaseMessageHeader,DEFAULT_TIMEOUT} from "@pagenote/bridge";
import {getSessionStorageBridge} from "@pagenote/bridge";

export const PAGENOTE_SESSION_LISTEN_KEY = 'pagenote-message'


let bridge: any;
export const defaultWrapper = function (method: string, targetId: string, clientId: string = 'web-api') {
    return function (request: any, header: Partial<BaseMessageHeader> = {
        targetClientId: targetId
    }) {
        if (!bridge) {
            bridge = getSessionStorageBridge(clientId, {
                asServer: true,
                listenKey: PAGENOTE_SESSION_LISTEN_KEY,
                timeout: DEFAULT_TIMEOUT,
                targetClientId: targetId,
            })
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
