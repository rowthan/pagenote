type Tasks = {
    conflict: Record<string, TaskDetail>,
    clientDownload: Record<string, TaskDetail>,
    clientDelete: Record<string, TaskDetail>,
    clientUpload: Record<string, TaskDetail>,
    serverDelete: Record<string, TaskDetail>,
}

type TaskDetail = {
    basename: string,
    key?: string,
    state: TaskState,
    localEtag: string,
    localLastmod: string,
    // localUpdateAt: number,
    // cloudUpdateAt?: number,
    cloudEtag: string,
    cloudLastmod: string,
}

enum TaskState {
    pending='pending',
    resolving='resolving',
    networkError='networkError',
    localDataError='localDataError',
    success='success',
    valid='valid', // 数据不合法
    decodeError='decodeError' // 解密失败
}

enum WebdavStatus {
    blocked=503, // 被禁用
    unAuth= 401, // 无权限
    unknown=0,
    connected=1,
}

export type {
    Tasks,
    TaskDetail,
    WebdavStatus,
}

export {
    TaskState
}