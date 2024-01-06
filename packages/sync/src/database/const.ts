import { ChangeFlag } from "./typing";


// 冲突

export const CONFLICT_FLAT = [
    `${ChangeFlag.nochange}${ChangeFlag.nochange}`, // 本地无变化、远程无变化
    `${ChangeFlag.changed}${ChangeFlag.changed}`, // 本地有变化、远程有变化
    `${ChangeFlag.changed}${ChangeFlag.created}`, // 本地有变化、远程有新建
    `${ChangeFlag.created}${ChangeFlag.changed}`, // 本地有新建、远程有变化
    `${ChangeFlag.created}${ChangeFlag.created}`, // 本地有新建、远程有新建
];// 下载

export const DOWNLOAD_FLAG = [
    `${ChangeFlag.nochange}${ChangeFlag.changed}`, // 本地无变化、远程有变化
    `${ChangeFlag.nochange}${ChangeFlag.created}`, // 本地无变化、远程有新建
];
// 本地删除

export const CLIENT_DELETE_FLAG = [
    `${ChangeFlag.nochange}${ChangeFlag.deleted}`, // 本地无变化、远程已删除
    `${ChangeFlag.changed}${ChangeFlag.deleted}`, // 本地有变化、远程已删除
    `${ChangeFlag.created}${ChangeFlag.deleted}`, // 本地有新增、远程已删除
];
// 上传服务端

export const CLIENT_UPLOAD_FLAG = [
    `${ChangeFlag.changed}${ChangeFlag.nochange}`, // 本地有变化、远程无变化
    `${ChangeFlag.created}${ChangeFlag.nochange}`, // 本地已创建、远程无变化
];
// 服务端删除

export const SERVER_DELETE_FLAG = [
    `${ChangeFlag.deleted}${ChangeFlag.nochange}`, // 本地已删除、远程无变化
    `${ChangeFlag.deleted}${ChangeFlag.changed}`, // 本地已删除、远程已修改
    `${ChangeFlag.deleted}${ChangeFlag.created}`, // 本地已删除、远程已创建
];
// 无需操作

export const NO_ACTION = [`${ChangeFlag.deleted}${ChangeFlag.deleted}`];

