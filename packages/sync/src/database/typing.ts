
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
    serverUpdate = "serverUpdate"
}/**同步任务状态*/
export enum TaskState {
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
    localAbstract?: AbstractInfo;
    cloudAbstract?: AbstractInfo;
    actionType: SYNC_ACTION;
};
/** 一条数据的摘要信息 */

export type AbstractInfo = null | {
    id: string; // 唯一标识，本地、远程联系的唯一ID


    /**本地读写基于的，操作ID*/
    l_id?: string;
    /**远程读写基于的，操作ID，如文件系统的，文件名路径；数据库系统的 自动生成ID；notion 系统的 page ID*/
    c_id?: string;

    /**1. 文件相关指标，文件指标相同的情况下，可以避免进一步比较文件内容是否相同**/
    etag?: string; // etag hash标识，
    lastmod?: string; // 文件的最后修改时间 GTM 格式

    mtimeMs?: number; // 文件系统的最后修改时间，单位 s


    /**2. 业务数据相关指标*/
    updateAt: number; // 数据的最后更新时间；由应用自身控制的数据，具有最高优先级
};
export type Snapshot = Record<string, AbstractInfo>;

export enum ChangeFlag {
    nochange = '0',
    changed = '1',
    deleted = '2',
    created = '3'
}
export type ChangeMap = Record<string, ChangeFlag>;
export type SyncTaskInfo = {
    // 变更描述
    changeMap: ChangeMap;
    // 快照信息
    latestSnapshot: Snapshot;
};
export type SyncTaskMap = Map<string, SyncTaskDetail>;
export type SyncTaskActionsMap = {
    [key in SYNC_ACTION]: SyncTaskMap;
};
interface GetSnapshot {
    (): Promise<Snapshot | null>;
}

export interface ResolveTask {
    (id: string, task: SyncTaskDetail): Promise<{
        result: TaskState;
        abstract: AbstractInfo | null;
    }>;
}


export interface MethodById<T> {
    (id: string, taskDetail?: SyncTaskDetail): Promise<T | null>;
}

export interface ModifyByIdAndData<T> {
    (id: string, data: T, taskDetail?: SyncTaskDetail): Promise<T | null>;
}
/**增删改查*/

export interface SyncClient<T> {
    /**当前数据源ID标识*/
    getSourceId: () => Promise<string>;

    /**增删改查基础方法*/
    add: ModifyByIdAndData<T>;
    update: ModifyByIdAndData<T>;
    remove: MethodById<T>;
    query: MethodById<T>;

    /**全量数据的当前快照信息*/
    getCurrentSnapshot: GetSnapshot;

    /**基于单个数据的全量信息，提取摘要数据*/
    getAbstractInfo: (data: T | null) => AbstractInfo;
};

export type CacheMethod = {
    /**快照信息缓存，至少选择存储到一端。推荐存储在本地*/
    cache: {
        storageGet: (cacheId: string) => Promise<Snapshot | null>;
        storageSet: (cacheId: string, snapshot: Snapshot | null) => Promise<void>;
    };
};

export type Client<T> = {
    cloud: SyncClient<T>;
    local: SyncClient<T> & CacheMethod;
};
export interface SyncOption<T> {
    /**同步任务预估完成时间，加锁时长依据*/
    lockResolving: number;
    /**本地和远程数据操作的基础方法*/
    client: Client<T>;
}

