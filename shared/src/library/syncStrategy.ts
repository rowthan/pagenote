/**执行同步的任务类型*/
export enum SYNC_ACTION {
    /**1. 远程本地存在冲突*/
    conflict = 'conflict',
    /**2. 下载服务端至本地*/
    clientDownload = 'clientDownload',
    /**3. 删除本地*/
    clientDelete = "clientDelete",
    /**4. 上传本地至服务端*/
    clientUpload = "clientUpload",
    /**5. 服务端删除*/
    serverDelete = "serverDelete",
    /**6. 上传至服务端（覆盖更新）*/
    overrideUpload = "overrideUpload",
    /**7. 下载服务端至本地（覆盖更新）*/
    overrideDownload = "overrideDownload",
}

/**同步任务状态*/
enum TaskState {
    pending = "pending",
    resolving = "resolving",
    networkError = "networkError",
    localDataError = "localDataError",
    success = "success",
    valid = "valid",
    decodeError = "decodeError"
}

type TaskDetail = {
    id: string;
    state: TaskState;
    localAbstract: AbstractInfo,
    cloudAbstract: AbstractInfo,
    actionType: SYNC_ACTION;
};

/** 一条数据的摘要信息 */
export type AbstractInfo = {
    id: string // 唯一标识

    /**1. 文件相关指标，文件指标相同的情况下，可以避免进一步比较文件内容是否相同**/
    etag?: string // etag hash标识，
    lastmod?: string // 文件的最后修改时间 GTM 格式

    /**2. 数据相关指标*/
    updateAt: number // 数据的最后更新时间
}
export type Snapshot = Record<string, AbstractInfo>

export enum ChangeFlag {
    nochange = '0',
    changed = '1',
    deleted = '2',
    created = '3',
}

// 冲突
export const CONFLICT_FLAT = [
    `${ChangeFlag.nochange}${ChangeFlag.nochange}`, // 本地无变化、远程无变化
    `${ChangeFlag.changed}${ChangeFlag.changed}`, // 本地有变化、远程有变化
    `${ChangeFlag.changed}${ChangeFlag.created}`, // 本地有变化、远程有新建
    `${ChangeFlag.created}${ChangeFlag.changed}`, // 本地有新建、远程有变化
    `${ChangeFlag.created}${ChangeFlag.created}`, // 本地有新建、远程有新建
]

// 下载
export const DOWNLOAD_FLAG = [
    `${ChangeFlag.nochange}${ChangeFlag.changed}`, // 本地无变化、远程有变化
    `${ChangeFlag.nochange}${ChangeFlag.created}`, // 本地无变化、远程有新建
]

// 本地删除
export const CLIENT_DELETE_FLAG = [
    `${ChangeFlag.nochange}${ChangeFlag.deleted}`, // 本地无变化、远程已删除
    `${ChangeFlag.changed}${ChangeFlag.deleted}`, // 本地有变化、远程已删除
    `${ChangeFlag.created}${ChangeFlag.deleted}`, // 本地有新增、远程已删除
]

// 上传服务端
export const CLIENT_UPLOAD_FLAG = [
    `${ChangeFlag.changed}${ChangeFlag.nochange}`, // 本地有变化、远程无变化
    `${ChangeFlag.created}${ChangeFlag.nochange}`, // 本地已创建、远程无变化
]

// 服务端删除
export const SERVER_DELETE_FLAG = [
    `${ChangeFlag.deleted}${ChangeFlag.nochange}`, // 本地已删除、远程无变化
    `${ChangeFlag.deleted}${ChangeFlag.changed}`, // 本地已删除、远程已修改
    `${ChangeFlag.deleted}${ChangeFlag.created}`, // 本地已删除、远程已创建
]

// 无需操作
export const NO_ACTION = [`${ChangeFlag.deleted}${ChangeFlag.deleted}`]

// 比较两个摘要是否相同
export function isSame(current: AbstractInfo, old: AbstractInfo) {
    const temCurrent: AbstractInfo = current || {id: '', updateAt: 0}
    const temOld: AbstractInfo = old || {id: '', updateAt: 0}
    // 按etag比较
    if (temCurrent?.etag && temCurrent.etag === temOld.etag) {
        return true
    }
    // 按最后修改时间比较
    if (temCurrent.lastmod && temCurrent.lastmod === temOld.lastmod) {
        return true
    }

    if (
        temCurrent.updateAt &&
        temCurrent.updateAt > 0 &&
        temCurrent.updateAt === temOld.updateAt
    ) {
        return true
    }

    // 远程信息和本地数据比较时，webdav 返回的lastmod为GTM字符串，本地存储的可能不是，需要格式化为时间再比较
    if (temCurrent.lastmod && temOld.lastmod) {
        const currentLastMod = new Date(temCurrent.lastmod).getTime()
        const oldLastMod = new Date(temOld.lastmod).getTime()
        if (currentLastMod === oldLastMod) {
            return true
        }
    }

    return false
}

// 基于摘要信息创建快照
export function createSnapshot(abstracts: AbstractInfo[]): Snapshot {
    const dataMap: Snapshot = {}
    for (let i = 0; i < abstracts.length; i++) {
        const tempItem = abstracts[i]
        dataMap[tempItem.id] = {
            id: tempItem.id,
            lastmod: tempItem.lastmod,
            etag: tempItem.etag,
            updateAt: tempItem.updateAt,
        }
    }
    return dataMap
}

type ChangeMap = Record<string, ChangeFlag>

// 比较两个快照的差异
export function diffSnapshot(
    current: Snapshot = {},
    old: Snapshot = {}
): ChangeMap {
    current = current || {};
    old = old || {}

    const result: Record<string, ChangeFlag> = {}

    // 遍历当前的快照
    for (const i in current) {
        const temCurrent = current[i]
        const temOld = old[i]

        // 之前不存在该数据，则标记为：新增 created
        if (temOld === undefined) {
            result[i] = ChangeFlag.created
        }
        // 如果相同，则标记为： 无变化 nochange
        else if (isSame(temCurrent, temOld)) {
            result[i] = ChangeFlag.nochange
        } else {
            result[i] = ChangeFlag.changed
        }
    }

    // 遍历旧快照，新快照没有的对象，则说明变化为 已删除
    for (const j in old) {
        if (current[j] === undefined) {
            result[j] = ChangeFlag.deleted
        }
    }

    return result
}

type SyncTaskInfo = {
    changeMap: ChangeMap
    latestSnapshot: Snapshot
}
export type SyncTaskMap = Record<string, TaskDetail>

// 基于 diff 和快照，计算两端的同步任务
export function computeSyncTask(
    local: SyncTaskInfo,
    cloud: SyncTaskInfo
): SyncTaskMap {
    const tasks: SyncTaskMap = {}
    /** 1 */
    for (const i in local.changeMap) {
        // 如果远端不存在该变化，则忽略该变化，进入步骤2处理
        const cloudFlag = cloud.changeMap[i]
        if (cloudFlag === undefined) {
            continue
        }
        const localFlag = local.changeMap[i]
        const localInfo = local.latestSnapshot[i]
        const cloudInfo = cloud.latestSnapshot[i]
        const same = isSame(localInfo, cloudInfo) // 当前本地和远端是否一致
        const flag = `${localFlag}${cloudFlag}` // 数据变化标记 01

        let actionType;
        if (CONFLICT_FLAT.includes(flag)) {
            if (!same) {
                actionType = SYNC_ACTION.conflict
            }
        } else if (DOWNLOAD_FLAG.includes(flag)) {
            if (!same) {
                actionType = SYNC_ACTION.overrideDownload
            }
        } else if (CLIENT_DELETE_FLAG.includes(flag)) {
            actionType = SYNC_ACTION.clientDelete
        } else if (CLIENT_UPLOAD_FLAG.includes(flag)) {
            if (!same) {
                actionType = SYNC_ACTION.overrideUpload
            }
        } else if (SERVER_DELETE_FLAG.includes(flag)) {
            actionType = SYNC_ACTION.serverDelete
        }

        if (actionType !== undefined) {
            tasks[i] = {
                id: i,
                state: TaskState.pending,
                cloudAbstract: cloud.latestSnapshot[i],
                localAbstract: local.latestSnapshot[i],
                actionType: actionType,
            }

        }

        delete local.changeMap[i]
        delete cloud.changeMap[i]
    }

    /** 2 */
    for (const i in local.changeMap) {
        const flag = local.changeMap[i]
        if (
            [ChangeFlag.nochange, ChangeFlag.changed, ChangeFlag.created].includes(
                flag
            )
        ) {
            tasks[i] = {
                id: i,
                state: TaskState.pending,
                cloudAbstract: cloud.latestSnapshot[i],
                localAbstract: local.latestSnapshot[i],
                actionType: SYNC_ACTION.clientUpload,
            }
        }
    }

    /** 3 */
    for (const i in cloud.changeMap) {
        const flag = cloud.changeMap[i]
        if (
            [ChangeFlag.nochange, ChangeFlag.changed, ChangeFlag.created].includes(
                flag
            )
        ) {
            tasks[i] = {
                id: i,
                state: TaskState.pending,
                cloudAbstract: cloud.latestSnapshot[i],
                localAbstract: local.latestSnapshot[i],
                actionType: SYNC_ACTION.clientDownload,
            }
        }
    }
    return tasks
}

type ResolveFunMap = Record<SYNC_ACTION,
    (key: string, taskDetail: TaskDetail) => Promise<boolean>>

// 执行同步任务
export function resolveSyncTask(
    taskMap: SyncTaskMap,
    resolveFunMap: ResolveFunMap
) {
    const clientDownload: Record<string, TaskDetail> = {}
    const clientDelete: Record<string, TaskDetail> = {}
    const serverDelete: Record<string, TaskDetail> = {}
    const clientUpload: Record<string, TaskDetail> = {}
    const conflict: Record<string, TaskDetail> = {}
    for (const i in taskMap) {
        const tempTask = taskMap[i]
        // 已执行、或正在执行，直接跳过，防止重复执行
        if ([TaskState.success, TaskState.resolving].includes(tempTask.state)) {
            continue
        }
        switch (tempTask.actionType) {
            case SYNC_ACTION.clientDelete:
                clientDelete[i] = tempTask
                resolveFunMap[SYNC_ACTION.clientDelete](i, tempTask)
                break
            case SYNC_ACTION.clientDownload:
                clientDownload[i] = tempTask
                resolveFunMap[SYNC_ACTION.clientDownload](i, tempTask)
                break
            case SYNC_ACTION.clientUpload:
                clientUpload[i] = tempTask
                resolveFunMap[SYNC_ACTION.clientUpload](i, tempTask)
                break
            case SYNC_ACTION.conflict:
                conflict[i] = tempTask
                resolveFunMap[SYNC_ACTION.conflict](i, tempTask)
                break
            case SYNC_ACTION.serverDelete:
                serverDelete[i] = tempTask
                resolveFunMap[SYNC_ACTION.serverDelete](i, tempTask)
                break
            case SYNC_ACTION.overrideDownload:
                clientDownload[i] = tempTask
                resolveFunMap[SYNC_ACTION.overrideDownload](i, tempTask)
                break
            case SYNC_ACTION.overrideUpload:
                clientUpload[i] = tempTask
                resolveFunMap[SYNC_ACTION.overrideUpload](i, tempTask)
                break
            default:
                console.log('未知类型任务', taskMap[i])
        }
    }
}

interface GetSnapshot {
    (): Promise<Snapshot | null>
}

interface SetSnapshot {
    (snapshot: Snapshot): void
}

export interface ResolveTask {
    (i: string, task: Omit<TaskDetail, 'id'>): Promise<{
        result: TaskState,
        abstract: AbstractInfo | null,
    }>
}

interface SyncOption {
    lockResolving: number //同步任务预估完成时间
    // 当前快照信息
    getCurrentCloudSnapshot: GetSnapshot
    getCurrentLocalSnapshot: GetSnapshot

    // 上次快照信息
    getLastCloudSnapshot: GetSnapshot
    getLastLocalSnapshot: GetSnapshot
    setLastCloudSnapshot: SetSnapshot
    setLastLocalSnapshot: SetSnapshot

    resolveActions: Record<SYNC_ACTION, ResolveTask>
}

class SyncStrategy {
    private readonly option: SyncOption
    private syncTaskMap: SyncTaskMap = {};
    public lastSyncAt: number = 0;
    public resolving: boolean = false;
    private nextTimer: NodeJS.Timer | undefined;
    private tempNewSnapshot: {
        localSnapshot: Snapshot,
        cloudSnapshot: Snapshot,
    } = {
        localSnapshot: {},
        cloudSnapshot: {}
    }

    constructor(option: SyncOption) {
        this.option = option
    }

    /**计算本地变化*/
    async _computeLocalDiff(): Promise<SyncTaskInfo> {
        const currentLocalSnapshot = await this.option.getCurrentLocalSnapshot() || {};
        const lastLocalSnapshot = await this.option.getLastLocalSnapshot() || {};

        this.tempNewSnapshot.localSnapshot = lastLocalSnapshot;
        return {
            latestSnapshot: currentLocalSnapshot,
            changeMap: diffSnapshot(currentLocalSnapshot, lastLocalSnapshot)
        }
    }

    /**计算远程变化*/
    async _computeCloudDiff(): Promise<SyncTaskInfo> {
        const lastCloudSnapshot = await this.option.getLastCloudSnapshot() || {};
        const currentCloudSnapshot = await this.option.getCurrentCloudSnapshot() || {};

        this.tempNewSnapshot.cloudSnapshot = lastCloudSnapshot;
        const diff = diffSnapshot(currentCloudSnapshot, lastCloudSnapshot);
        return {
            latestSnapshot: currentCloudSnapshot || {},
            changeMap: diff
        }
    }

    async _computeSyncTask(): Promise<SyncTaskMap> {
        this.syncTaskMap = {};
        // 计算差异
        const localDiff = await this._computeLocalDiff();
        const cloudDiff = await this._computeCloudDiff();
        this.syncTaskMap = computeSyncTask(localDiff, cloudDiff);

        return this.syncTaskMap
    }

    async _resolveTask(task: SyncTaskMap) {
        const newAbstractInfo: Record<string, AbstractInfo | null> = {}
        for (let i in task) {
            const taskDetail = task[i];
            const {actionType} = taskDetail;
            try {
                const result = await this.option.resolveActions[actionType](i, taskDetail);
                taskDetail.state = result.result;
                if(taskDetail.state === TaskState.success){
                    newAbstractInfo[i] = result.abstract;
                    // 更新摘要
                    // 如果删除资源，则快照中直接除名
                    if(newAbstractInfo[i]===null){
                        delete this.tempNewSnapshot.cloudSnapshot[i];
                        delete this.tempNewSnapshot.localSnapshot[i];
                    }else if(newAbstractInfo[i]){ // 有最新快照信息，将其赋值给本地、云端快照
                        this.tempNewSnapshot.cloudSnapshot[i] = newAbstractInfo[i] as AbstractInfo
                        this.tempNewSnapshot.localSnapshot[i] = newAbstractInfo[i] as AbstractInfo
                    }

                    this.option.setLastLocalSnapshot(this.tempNewSnapshot.localSnapshot);
                    this.option.setLastCloudSnapshot(this.tempNewSnapshot.cloudSnapshot);
                }
            } catch (e) {
                console.error('resolve error:',e)
                taskDetail.state = TaskState.networkError
            }
        }

        this.lastSyncAt = Date.now();
        this.resolving = false;
        return Promise.resolve(task)
    }

    async sync(): Promise<SyncTaskMap>{
        if(this.resolving){
            clearTimeout(<NodeJS.Timeout>this.nextTimer)
            this.nextTimer = setTimeout( ()=> {
                return this.sync()
            },this.option.lockResolving / 2)
            return Promise.reject('正在同步，请稍后执行')
        }
        this.resolving = true;
        // 解锁
        setTimeout( ()=> {
            this.resolving = false;
        },this.option.lockResolving)
        const task = await this._computeSyncTask();
        return this._resolveTask(task)
    }
}

export default SyncStrategy
