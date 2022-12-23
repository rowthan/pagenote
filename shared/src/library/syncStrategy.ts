
export enum SYNC_ACTION {
    /**1. 远程本地存在冲突*/
    conflict = 'conflict',
    /**2. 下载服务端至本地*/
    clientAdd = 'clientAdd',
    /**3. 删除本地*/
    clientDelete = "clientDelete",
    /**4. 下载服务端至本地（覆盖更新）*/
    clientUpdate = "clientUpdate",

    /**5. 上传本地至服务端*/
    serverAdd = "serverAdd",
    /**6. 服务端删除*/
    serverDelete = "serverDelete",
    /**7. 上传至服务端（覆盖更新）*/
    serverUpdate = "serverUpdate",
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

export type SyncTaskDetail = {
    id: string;
    state: TaskState;
    localAbstract?: AbstractInfo,
    cloudAbstract?: AbstractInfo,
    actionType: SYNC_ACTION;
};


/** 一条数据的摘要信息 */
export type AbstractInfo = null | {
    id: string // 唯一标识，本地、远程联系的唯一ID

    /**本地读写基于的，操作ID*/
    l_id?: string
    /**远程读写基于的，操作ID，如文件系统的，文件名路径；数据库系统的 自动生成ID；notion 系统的 page ID*/
    c_id?: string

    /**1. 文件相关指标，文件指标相同的情况下，可以避免进一步比较文件内容是否相同**/
    etag?: string // etag hash标识，
    lastmod?: string // 文件的最后修改时间 GTM 格式

    mtimeMs?: number // 文件系统的最后修改时间，单位 s

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
    const temCurrent: AbstractInfo = current || {id: '', updateAt: 0, l_id: '', c_id:''}
    const temOld: AbstractInfo = old || {id: '', updateAt: 0, l_id: '', c_id:''}
    // 按etag比较
    if (temCurrent?.etag && temCurrent.etag === temOld.etag) {
        return true
    }
    // 按最后修改时间比较
    if (temCurrent.lastmod && temCurrent.lastmod === temOld.lastmod) {
        return true
    }

    if (
        !isNaN(temCurrent.updateAt) &&
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
export type SyncTaskMap = Map<string, SyncTaskDetail>
export type SyncTaskActionsMap = {
    [key in SYNC_ACTION]: SyncTaskMap
}
// 基于 diff 和快照，计算两端的同步任务
export function computeSyncTask(
    local: SyncTaskInfo,
    cloud: SyncTaskInfo
): SyncTaskActionsMap {
    const taskGroup: SyncTaskActionsMap = getInitTaskMap();
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
                actionType = SYNC_ACTION.clientUpdate
            }
        } else if (CLIENT_DELETE_FLAG.includes(flag)) {
            actionType = SYNC_ACTION.clientDelete
        } else if (CLIENT_UPLOAD_FLAG.includes(flag)) {
            if (!same) {
                actionType = SYNC_ACTION.serverUpdate
            }
        } else if (SERVER_DELETE_FLAG.includes(flag)) {
            actionType = SYNC_ACTION.serverDelete
        }

        if (actionType !== undefined) {
            taskGroup[actionType].set(i,{
                id: i,
                state: TaskState.pending,
                cloudAbstract: cloud.latestSnapshot[i],
                localAbstract: local.latestSnapshot[i],
                actionType: actionType,
            })
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
            taskGroup[SYNC_ACTION.serverAdd].set(i,{
                id: i,
                state: TaskState.pending,
                cloudAbstract: cloud.latestSnapshot[i],
                localAbstract: local.latestSnapshot[i],
                actionType: SYNC_ACTION.serverAdd,
            })
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
            taskGroup[SYNC_ACTION.clientAdd].set(i,{
                id: i,
                state: TaskState.pending,
                cloudAbstract: cloud.latestSnapshot[i],
                localAbstract: local.latestSnapshot[i],
                actionType: SYNC_ACTION.clientAdd,
            })
        }
    }
    return taskGroup
}

interface GetSnapshot {
    (): Promise<Snapshot | null>
}

export interface ResolveTask {
    (id: string, task: SyncTaskDetail): Promise<{
        result: TaskState,
        abstract: AbstractInfo | null,
    }>
}


export interface MethodById<T> {
    (id: string, taskDetail: SyncTaskDetail): Promise<T | null>
}

export interface ModifyByIdAndData<T> {
    (id: string, data: T, taskDetail: SyncTaskDetail): Promise<T | null>,
}

/**增删改查*/
export type SyncMethods<T> = {
    /**当前数据源ID标识*/
    getSourceId: ()=>Promise<string>

    /**增删改查基础方法*/
    add: ModifyByIdAndData<T>
    update: ModifyByIdAndData<T>
    remove: MethodById<T>
    query: MethodById<T>

    /**全量数据的当前快照信息*/
    getCurrentSnapshot: GetSnapshot

    /**基于单个数据的全量信息，提取摘要数据*/
    getAbstractInfo: (data: T | null)=>AbstractInfo
}

export type CacheMethod = {
    /**快照信息缓存，至少选择存储到一端。推荐存储在本地*/
    cache:{
        storageGet: (cacheId: string) => Promise<Snapshot | null>
        storageSet: (cacheId: string, snapshot: Snapshot | null) => Promise<void>
    }
}

export type Client<T> = {
    cloud: SyncMethods<T>,
    local: SyncMethods<T> & CacheMethod
}
export interface SyncOption<T> {
    /**同步任务预估完成时间，加锁时长依据*/
    lockResolving: number
    /**本地和远程数据操作的基础方法*/
    client: Client<T>
}

function getInitTaskMap(): SyncTaskActionsMap {
    return {
        [SYNC_ACTION.clientDelete]: new Map(),
        [SYNC_ACTION.clientAdd]: new Map(),
        [SYNC_ACTION.clientUpdate]: new Map(),
        [SYNC_ACTION.conflict]: new Map(),
        [SYNC_ACTION.serverAdd]: new Map(),
        [SYNC_ACTION.serverUpdate]: new Map(),
        [SYNC_ACTION.serverDelete]: new Map()
    }
}

export default class SyncStrategy<T> {
    private readonly client: Client<T>
    public syncTaskMap: SyncTaskActionsMap = getInitTaskMap();
    public lastSyncAt: number = 0;

    public lockResolving: number
    public resolving: boolean = false;
    private nextTimer: NodeJS.Timer | undefined;
    // 一次任务集处理ID，标识当前正在执行的任务集；非当前任务集ID的任务，放弃执行
    private resolveId: string = '';
    private tempNewSnapshot: {
        local: Snapshot,
        cloud: Snapshot,
    } = {
        local: {},
        cloud: {}
    }

    private syncPairId = ''

    constructor(option: SyncOption<T>) {
        this.lockResolving = option.lockResolving
        this.client = option.client;
    }

    /**生成同步对ID*/
    async _getSyncPariId(type:'local'|'cloud'){
        if(!this.syncPairId){
            const localId = await this.client.local.getSourceId();
            const cloudId = await this.client.cloud.getSourceId();
            this.syncPairId = `${localId}_${cloudId}`;
        }
        return `${this.syncPairId}_${type}`
    }


    async _computeDiff(client: 'local'|'cloud'){
        const currentSnapshot = await this.client[client].getCurrentSnapshot() || {};
        const storeId = await this._getSyncPariId(client);
        const lastSnapshot = await this.client.local.cache.storageGet(storeId) || {};
        this.tempNewSnapshot[client] = {
            ...currentSnapshot,
            ...lastSnapshot
        };
        const diff = diffSnapshot(currentSnapshot,this.tempNewSnapshot[client]);
        return {
            latestSnapshot: currentSnapshot,
            changeMap: diff
        }
    }

    _computeSyncTask(): Promise<SyncTaskActionsMap> {
        this.syncTaskMap = getInitTaskMap();
        // 计算差异
        return Promise.all([
            this._computeDiff('local'),
            this._computeDiff('cloud'),
        ]).then(([localDiff, cloudDiff]) => {
            this.syncTaskMap = computeSyncTask(localDiff, cloudDiff);
            return this.syncTaskMap
        })
    }

    _getResolveMethod(actionType: SYNC_ACTION): ResolveTask {
        const {cloud, local} = this.client;
        switch (actionType) {
            case SYNC_ACTION.clientDelete:
                return function (id,taskDetail) {
                    return local.remove(id,taskDetail).then(function (res) {
                        return {
                            data: res,
                            abstract: local.getAbstractInfo(res),
                            result: TaskState.success
                        }
                    })
                }
            case SYNC_ACTION.serverDelete:
                return function (id,taskDetail) {
                    return cloud.remove(id,taskDetail).then(function (res) {
                        return {
                            data: res,
                            abstract: cloud.getAbstractInfo(res),
                            result: TaskState.success
                        }
                    })
                }

            case SYNC_ACTION.conflict:
                return function (id,taskDetail) {
                    return Promise.all([
                        cloud.query(id,taskDetail),
                        local.query(id,taskDetail)
                    ]).then(function ([cloudRes, localRes]) {
                        const localUpdateAt = localRes ? local.getAbstractInfo(localRes)?.updateAt : 0
                        const cloudUpdateAt = cloudRes ? cloud.getAbstractInfo(cloudRes)?.updateAt : 0;

                        if ((localUpdateAt || 0) > (cloudUpdateAt || 0)) {
                            if (!localRes) {
                                console.error('resolve conflict error', localRes)
                                throw Error('no data to add')
                            }
                            return cloud.add(id, localRes,taskDetail).then(function (res) {
                                return {
                                    data: res,
                                    abstract: cloud.getAbstractInfo(res),
                                    result: TaskState.success
                                }
                            })
                        } else {
                            if (!cloudRes) {
                                console.error('resolve conflict error', localRes)
                                throw Error('no data to add')
                            }
                            return local.add(id, cloudRes,taskDetail).then(function (res) {
                                return {
                                    data: res,
                                    abstract: local.getAbstractInfo(res),
                                    result: TaskState.success
                                }
                            })
                        }
                    })
                }

            /**override 和 download 使用同样的方法**/
            case SYNC_ACTION.clientUpdate:
            case SYNC_ACTION.clientAdd:
                return function (id,taskDetail) {
                    return cloud.query(id,taskDetail).then(function (result) {
                        if (result) {
                            return local.add(id, result,taskDetail).then(function (res) {
                                return {
                                    data: res,
                                    abstract: local.getAbstractInfo(res),
                                    result: TaskState.success
                                }
                            })
                        } else {
                            throw Error(`can't find ${id} from cloud`)
                        }
                    })
                }

            /**override 和 batchUpdate 使用同样的方法**/
            case SYNC_ACTION.serverUpdate:
            case SYNC_ACTION.serverAdd:
                return function (id,taskDetail) {
                    return local.query(id,taskDetail).then(function (result) {
                        if (result) {
                            return cloud.add(id, result,taskDetail).then(function (res) {
                                return {
                                    data: res,
                                    abstract: cloud.getAbstractInfo(res),
                                    result: TaskState.success
                                }
                            })
                        } else {
                            throw Error(`can't find ${id} from cloud`)
                        }
                    })
                }
        }
        throw Error('无可使用方法')
    }

    async _resolveSingleTask(taskDetail: SyncTaskDetail, resolveId: string){
        /**
         * 判断当前任务集ID是否匹配最新的任务集ID，如有更新的处理集，抛弃历史任务。
         * 1. 防止历史任务时效性过期
         * 2. 防止重复执行相同任务
         * */
        if(resolveId && resolveId !== this.resolveId){
            return Promise.reject(`resolveId is not matched`)
        }
        const {actionType,id} = taskDetail;
        let responseAbstract: AbstractInfo;
        try {
            const result = await this._getResolveMethod(actionType)(id, taskDetail);
            taskDetail.state = result.result;
            if (taskDetail.state === TaskState.success) {
                responseAbstract = result.abstract;
                // 更新摘要
                // 如果删除资源，则快照中直接除名
                if (responseAbstract === null) {
                    delete this.tempNewSnapshot.cloud[id];
                    delete this.tempNewSnapshot.local[id];
                } else if (responseAbstract) { // 有最新快照信息，将其赋值给本地、云端快照
                    this.tempNewSnapshot.cloud[id] = this.tempNewSnapshot.local[id] = {
                        id: responseAbstract.id,
                        updateAt: responseAbstract.updateAt,
                    }
                }


                this.client.local.cache.storageSet(await this._getSyncPariId('local'), this.tempNewSnapshot.local).then(async ()=>{
                    this.client.local.cache.storageSet(await this._getSyncPariId('cloud'), this.tempNewSnapshot.cloud);
                });
            }
        } catch (e) {
            console.error('resolve error:', e)
            taskDetail.state = TaskState.networkError
        }
    }

    async _resolveTaskMap(task: SyncTaskActionsMap, resolveId?: string):Promise<SyncTaskActionsMap> {
        this.resolveId = resolveId || new Date().toString();

        /**本地数据更新 start
         * 按照 本地 > 远程 优先级处理任务，保证本地能得到最新的数据展示。
         * */

        const promiseTaskList: Promise<any>[] = []
        const that = this;
        function pushTask(item: SyncTaskDetail) {
            promiseTaskList.push(that._resolveSingleTask(item,that.resolveId))
        }
        /**1. 优先删除本地，不需要等待完成 await*/
        task[SYNC_ACTION.clientDelete].forEach( pushTask)

        /**2. 优先下载本地*/
        task[SYNC_ACTION.clientAdd].forEach( pushTask)

        /**3. 优先更新本地*/
        task[SYNC_ACTION.clientUpdate].forEach(pushTask)

        /**4. 冲突解决*/
        task[SYNC_ACTION.conflict].forEach(pushTask)

        /**服务端更新 start*/
        /**5. 服务端删除*/
        task[SYNC_ACTION.serverDelete].forEach(pushTask)

        /**6. 服务端上传*/
        task[SYNC_ACTION.serverAdd].forEach(pushTask)

        /**7. 服务端更新*/
        task[SYNC_ACTION.serverUpdate].forEach(pushTask)

        return Promise.all(promiseTaskList).then(function () {
            return task;
        }).finally( ()=> {
            //  同步结束
            this.lastSyncAt = Date.now();
            this.resolving = false;
        })
    }

    sync(): Promise<SyncTaskActionsMap> {
        if (this.resolving) {
            clearTimeout(<NodeJS.Timeout>this.nextTimer)
            this.nextTimer = setTimeout(() => {
                return this.sync()
            }, this.lockResolving / 2)
            return Promise.reject('正在同步，已加锁')
        }
        this.resolving = true;
        // 解锁
        setTimeout(() => {
            this.resolving = false;
        }, this.lockResolving)
        return this._computeSyncTask().then((task) => {
            return this._resolveTaskMap(task)
        })
    }
}


interface ScheduleFun<T extends (...args: any)=>Promise<any>> {
    (...args: Parameters<T>): ReturnType<T>;
}

/**
 * 对方法添加频控调度处理；防止连续触发导致被限制。执行间隔 n ms
 * */
export function scheduleWrap<T extends (...args: any)=>Promise<any>>(fun: T,gap: number=100,parallel: number=2): ScheduleFun<T>{
    let times = -1;
    return function (...args: any){
        times++

        // 基于已有执行的任务 times - 可并行的任务 parallel 得到需要延时执行的时长
        const timeout = Math.max(times - parallel,0) * gap;

        //@ts-ignore
        const promise: ReturnType<T> = new Promise(function (resolve, reject) {
            setTimeout(function () {
                fun(...args).then(function (res) {
                    resolve(res)
                }).catch(function (reason) {
                    reject(reason)
                })
                times--
            }, timeout)
        })

        return promise;
    }
}

