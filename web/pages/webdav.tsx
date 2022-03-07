import {useEffect, useState} from "react";
import {requestExtension} from "../utils/extensionApi";
import {isLow} from '@pagenote/shared/lib/utils/compare'
import {TaskDetail, Tasks} from "@pagenote/shared/lib/@types/webdavTask";
import SyncList from "../components/SyncList";
import useWhoAmI from "../hooks/useWhoAmI";
import useWebdavAccount from "../hooks/useWebdavAccount";
import VersionCheck from "../components/VersionCheck";
function WebdavManage() {
    const whoAmI = useWhoAmI()
    const webdavSetting = useWebdavAccount();
    const [tasks,setTasks] = useState<Record<string, TaskDetail>>(function () {
        return{}
    })
    const [conected,setConnected] = useState(false)

    function refreshTasks() {
        requestExtension<{data: Record<string, TaskDetail>,success: boolean}>('getCurrentSyncTask').then(function (result) {
            console.log('刷新任务列表')
            setTasks(result.data||{})
        })
    }

    useEffect(function () {
        requestExtension<{data: { state:number },success: boolean,error: string}>('getWebdavStatus').then(function (result) {
            console.log(result)
            setConnected(result?.data?.state===1);
            if(result?.error){
                alert(result.error)
            }
        })
        let timer = setInterval(function () {
            refreshTasks();
        },5*1000)
        return function () {
            clearInterval(timer)
        }
    },[])

    if(isLow(whoAmI.version,'0.20.11')){
        return(
            <div>
                只支持 0.20.11 版本以上使用
            </div>
        )
    }

    if(!webdavSetting?.accountName){
        return(
            <div>
                未检测到webdav账号配置。
                <a href="https://www.jianguoyun.com/d/home#/safety?bind=1">点击授权绑定</a>
            </div>
        )
    }

    return(
        <div>
            {conected?"已联通":"未联通"}
            <SyncList taskName={'同步中'} tasks={tasks} />
            {/*<SyncList taskName={'删除本地'} tasks={tasks.clientDelete} />*/}
            {/*<SyncList taskName={'上传中'} tasks={tasks.clientUpload} />*/}
            {/*<SyncList taskName={'删除云盘'} tasks={tasks.serverDelete} />*/}
            {/*<SyncList taskName={'冲突解决中'} tasks={tasks.conflict} />*/}
        </div>
    )
}

export default VersionCheck(WebdavManage,'0.20.10')