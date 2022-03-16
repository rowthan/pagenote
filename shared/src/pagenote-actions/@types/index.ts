import {commonKeyValuePair} from "../../@types/common";

// 注册缺省提供的方法
export enum ActionTypes {
    custom = 'custom', // 自行写入的脚本
    // openLink='openLink',
    // openLinkWithPopup='openLinkWithPopup',
    copyToClipboard = "copy",
    send_to_flomo = 'send_to_flomo',
    send_to_email = 'send_to_email',
    search = 'search',
    create_new_pagenote = 'create_new_pagenote',
}

export enum ActionScene {
    text='text',
    image='image',
    video='video',
    block='block',
    all='all'
}

export type Action = {
    icon: string,
    name: string,
    shortcut: string,
    clickUrl?: string,// 0.24 后待删除
    clickScript: string,
    scriptType?: string,  // TODO 预定义脚本
    customSetting: commonKeyValuePair[],
    version: string,
    actionType?: ActionTypes,
    scene: ActionScene,
}