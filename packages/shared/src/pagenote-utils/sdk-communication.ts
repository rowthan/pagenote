import {BridgeBy, getSessionStorageBridge, RESPONSE_STATUS_CODE} from "@pagenote/bridge";


enum SDK_WORK_TYPE {
    WEB=0,
    EXTENSION = 1
}

interface SDK_RUNNING_INFO {
    version: string,
    type: SDK_WORK_TYPE,
    sdkId: string,
    [key:string]: any
}

const EVENT = {
    'GET_SDK_INFO': 'get_other_sdk_info'
}

// 多 SDK 锁：  运行冲突沟通，SDK运行前，应使用SDK进行通讯，确保无响应再运行。
class PagenoteSdkManage {
    private bridge: BridgeBy
    private readonly sdkInfo: SDK_RUNNING_INFO
    constructor(id:string,sdkInfo: SDK_RUNNING_INFO) {
        this.bridge = getSessionStorageBridge(id,{
            listenKey: 'pagenote_sdk_manage_listen_key',
            asServer: true,
            timeout: 200
        });
        this.sdkInfo = sdkInfo;
    }

    // 标记当前开始工作
    setRunning(){
        this.bridge.addListener(EVENT.GET_SDK_INFO, (request,sender,response)=> {
            response({
                success: true,
                data: this.sdkInfo,
                statusText: '',
                status: RESPONSE_STATUS_CODE.SUCCESS
            })
        })
    }

    getRunningSdk(){
       return this.bridge.requestMessage<SDK_RUNNING_INFO>(EVENT.GET_SDK_INFO,null)
    }
}

export default PagenoteSdkManage

