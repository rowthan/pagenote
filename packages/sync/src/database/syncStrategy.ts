import { SyncTaskActionsMap } from "./typing";
import { Client, SyncOption, ResolveTask } from "./typing";
import { SyncTaskDetail } from "./typing";
import { Snapshot } from "./typing";
import { AbstractInfo } from "./typing";
import { TaskState } from "./typing";
import { SYNC_ACTION } from "./typing";
import { getInitTaskMap } from "./utils";
import { computeSyncTask } from "./utils";
import { diffSnapshot } from "./utils";

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

    async sync(): Promise<{task?: SyncTaskActionsMap,locked?: boolean,}> {
        /**锁判断，如果正在同步，则延迟重试*/ 
        if (this.resolving) {
            clearTimeout(<NodeJS.Timeout>this.nextTimer)
            this.nextTimer = setTimeout(() => {
                return this.sync()
            }, this.lockResolving / 2)
            return Promise.resolve({locked: true})
        }
        this.resolving = true;
        /**超时自动解锁；同步可以被中断，不影响下次执行。这里是安全的*/ 
        setTimeout(() => {
            this.resolving = false;
        }, this.lockResolving)

        /**
         * 计算同步任务，并将同步任务交给执行器，执行同步操作
         * */
        const task = await  this.computeDiffTask();
        return this._resolveTaskMap(task).then(function (res) {
            return{
                task: res,
                locked: false,
            }
        })
    }

    /**计算本地与远程客户端的差异，并生成任务，待执行*/ 
    computeDiffTask(): Promise<SyncTaskActionsMap> {
        // 初始化任务 map
        this.syncTaskMap = getInitTaskMap();
        // 计算差异
        return Promise.all([
            /**1. 计算本地基于上次同步后的差异变更**/ 
            this.computeDiff('local'),
            /**2. 计算云端基于上次同步后的差异变更*/
            this.computeDiff('cloud'),
        ]).then(([localDiff, cloudDiff]) => {
            /**基于自从上次同步后云端与本地的差异变更*/ 
            this.syncTaskMap = computeSyncTask(localDiff, cloudDiff);
            return this.syncTaskMap
        })
    }

    /**基于上次快照，计算本地或远程的变更*/ 
    async computeDiff(client: 'local'|'cloud'){
        /**
         * 获取当前快照
         * */ 
        const currentSnapshot = await this.client[client].getCurrentSnapshot() || {};
        /**
         * 获取上次快照存储的键值
        */
        const storeId = await this._getSyncPariId(client);
        const lastSnapshot = await this.client.local.cache.storageGet(storeId) || {};
        /**
         * 缓存当下最新的快照信息
         * */ 
        this.tempNewSnapshot[client] = {
            ...currentSnapshot,
            ...lastSnapshot
        };
        /**
         * 用当下的快照和历史快照进行对比，得到 diff
         * */ 
        const diff = diffSnapshot(currentSnapshot,lastSnapshot);
        return {
            latestSnapshot: currentSnapshot,
            changeMap: diff
        }
    }

    /**生成同步关系ID，local - cloud*/
    async _getSyncPariId(type:'local'|'cloud'){
        if(!this.syncPairId){
            const localId = await this.client.local.getSourceId();
            const cloudId = await this.client.cloud.getSourceId();
            this.syncPairId = `${localId}_${cloudId}`;
        }
        return `${this.syncPairId}-${type}`
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
                            throw Error(`can't find ${id} from local`)
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
        return
    }

    async _resolveTaskMap(task: SyncTaskActionsMap, resolveId?: string):Promise<SyncTaskActionsMap> {
        /**锁ID*/
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
}



