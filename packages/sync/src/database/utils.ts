import { CONFLICT_FLAT, DOWNLOAD_FLAG, CLIENT_DELETE_FLAG, CLIENT_UPLOAD_FLAG, SERVER_DELETE_FLAG } from "./const";
import { AbstractInfo, ChangeFlag, ChangeMap, SYNC_ACTION, Snapshot, SyncTaskActionsMap, SyncTaskInfo, TaskState } from "./typing";

interface ScheduleFun<T extends (...args: any) => Promise<any>> {
    (...args: Parameters<T>): ReturnType<T>;
}
/**
 * 对方法添加频控调度处理；防止连续触发导致被限制。执行间隔 n ms
 * */

export function scheduleWrap<T extends (...args: any) => Promise<any>>(fun: T, gap: number = 100, parallel: number = 2): ScheduleFun<T> {
    let times = -1;
    return function (...args: any) {
        times++;

        // 基于已有执行的任务 times - 可并行的任务 parallel 得到需要延时执行的时长
        const timeout = Math.max(times - parallel, 0) * gap;

        //@ts-ignore
        const promise: ReturnType<T> = new Promise(function (resolve, reject) {
            setTimeout(function () {
                fun(...args).then(function (res) {
                    resolve(res);
                }).catch(function (reason) {
                    reject(reason);
                });
                times--;
            }, timeout);
        });

        return promise;
    };
}// 比较两个摘要是否相同

export function isSame(current: AbstractInfo, old: AbstractInfo) {
    const temCurrent: AbstractInfo = current || { id: '', updateAt: 0, l_id: '', c_id: '' };
    const temOld: AbstractInfo = old || { id: '', updateAt: 0, l_id: '', c_id: '' };
    // 按etag比较
    if (temCurrent?.etag && temCurrent.etag === temOld.etag) {
        return true;
    }
    // 按最后修改时间比较
    if (temCurrent.lastmod && temCurrent.lastmod === temOld.lastmod) {
        return true;
    }

    if (!isNaN(temCurrent.updateAt) &&
        temCurrent.updateAt === temOld.updateAt) {
        return true;
    }

    // 远程信息和本地数据比较时，webdav 返回的lastmod为GTM字符串，本地存储的可能不是，需要格式化为时间再比较
    if (temCurrent.lastmod && temOld.lastmod) {
        const currentLastMod = new Date(temCurrent.lastmod).getTime();
        const oldLastMod = new Date(temOld.lastmod).getTime();
        if (currentLastMod === oldLastMod) {
            return true;
        }
    }

    return false;
}
// 比较两个快照的差异

export function diffSnapshot(
    current: Snapshot = {},
    old: Snapshot = {}
): ChangeMap {
    current = current || {};
    old = old || {};

    const result: Record<string, ChangeFlag> = {};

    // 遍历当前的快照
    for (const i in current) {
        const temCurrent = current[i];
        const temOld = old[i];

        // 之前不存在该数据，则标记为：新增 created
        if (temOld === undefined) {
            result[i] = ChangeFlag.created;
        }

        // 如果相同，则标记为： 无变化 nochange
        else if (isSame(temCurrent, temOld)) {
            result[i] = ChangeFlag.nochange;
        } else {
            result[i] = ChangeFlag.changed;
        }
    }

    // 遍历旧快照，新快照没有的对象，则说明变化为 已删除
    for (const j in old) {
        if (current[j] === undefined) {
            result[j] = ChangeFlag.deleted;
        }
    }

    return result;
}
// 基于 diff 和快照，计算两端的同步任务

export function computeSyncTask(
    local: SyncTaskInfo,
    cloud: SyncTaskInfo
): SyncTaskActionsMap {
    const taskGroup: SyncTaskActionsMap = getInitTaskMap();
    /** 1.1 循环处理本地的变更内容。只关注云端和本地共同有变更的内容*/
    for (const i in local.changeMap) {
        // 如果远端不存在对应的变化，则忽略该变化。这部分内容在 1.2 中处理
        const cloudFlag = cloud.changeMap[i];
        if (cloudFlag === undefined) {
            continue;
        }
        const localFlag = local.changeMap[i];
        const localInfo = local.latestSnapshot[i];
        const cloudInfo = cloud.latestSnapshot[i];

        /**根据local\cloud 摘要信息，快速比对是否改动内容一致*/
        const same = isSame(localInfo, cloudInfo);
        /**数据变化标记 01*/ 
        const flag = `${localFlag}${cloudFlag}`; // 

        /**根据local\cloud各自的变化类型，归类到不同的同步操作行为中*/ 
        let actionType;
        if (CONFLICT_FLAT.includes(flag)) {
            if (!same) {
                actionType = SYNC_ACTION.conflict;
            }
        } else if (DOWNLOAD_FLAG.includes(flag)) {
            if (!same) {
                actionType = SYNC_ACTION.clientUpdate;
            }
        } else if (CLIENT_DELETE_FLAG.includes(flag)) {
            actionType = SYNC_ACTION.clientDelete;
        } else if (CLIENT_UPLOAD_FLAG.includes(flag)) {
            if (!same) {
                actionType = SYNC_ACTION.serverUpdate;
            }
        } else if (SERVER_DELETE_FLAG.includes(flag)) {
            actionType = SYNC_ACTION.serverDelete;
        }

        /**成功归类的同步任务类型，收集**/ 
        if (actionType !== undefined) {
            taskGroup[actionType].set(i, {
                id: i,
                state: TaskState.pending,
                cloudAbstract: cloud.latestSnapshot[i],
                localAbstract: local.latestSnapshot[i],
                actionType: actionType,
            });
        }else{
            console.warn('未成功归类同步类型',flag)
        }

        delete local.changeMap[i];
        delete cloud.changeMap[i];
    }

    /** 1.2 处理未被 1.1 成功处理的变更 */
    for (const i in local.changeMap) {
        const flag = local.changeMap[i];
        if ([ChangeFlag.nochange, ChangeFlag.changed, ChangeFlag.created].includes(
            flag
        )) {
            taskGroup[SYNC_ACTION.serverAdd].set(i, {
                id: i,
                state: TaskState.pending,
                cloudAbstract: cloud.latestSnapshot[i],
                localAbstract: local.latestSnapshot[i],
                actionType: SYNC_ACTION.serverAdd,
            });
        }
    }

    /** 2 处理剩下的，云端的变更*/
    for (const i in cloud.changeMap) {
        const flag = cloud.changeMap[i];
        if ([ChangeFlag.nochange, ChangeFlag.changed, ChangeFlag.created].includes(
            flag
        )) {
            taskGroup[SYNC_ACTION.clientAdd].set(i, {
                id: i,
                state: TaskState.pending,
                cloudAbstract: cloud.latestSnapshot[i],
                localAbstract: local.latestSnapshot[i],
                actionType: SYNC_ACTION.clientAdd,
            });
        }
    }
    return taskGroup;
}
export function getInitTaskMap(): SyncTaskActionsMap {
    return {
        [SYNC_ACTION.clientDelete]: new Map(),
        [SYNC_ACTION.clientAdd]: new Map(),
        [SYNC_ACTION.clientUpdate]: new Map(),
        [SYNC_ACTION.conflict]: new Map(),
        [SYNC_ACTION.serverAdd]: new Map(),
        [SYNC_ACTION.serverUpdate]: new Map(),
        [SYNC_ACTION.serverDelete]: new Map()
    };
}

