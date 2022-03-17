import {commonKeyValuePair} from "../../@types/common";
import {ICON} from "../../icons";

// 注册缺省提供的方法
export enum ACTION_TYPES {
    custom = 'custom', // 自行写入的脚本
    // openLink='openLink',
    // openLinkWithPopup='openLinkWithPopup',
    copyToClipboard = "copy",
    send_to_flomo = 'send_to_flomo',
    send_to_email = 'send_to_email',
    search = 'search',
    create_new_pagenote = 'create_new_pagenote',
}

export enum ACTION_SCENE {
    text='text',
    image='image',
    video='video',
    block='block',
    all='all'
}

export const ActionSceneLabelMap = {
    [ACTION_SCENE.text] : '选中文本',
    [ACTION_SCENE.image] : '选中图片',
    [ACTION_SCENE.video] : '选中视频',
    [ACTION_SCENE.block] : '圈选模块',
    [ACTION_SCENE.all] : '所有',
}

export type Action = {
    icon: ICON,
    name: string,
    shortcut: string,
    customSetting: commonKeyValuePair[],
    version: string,
    actionType: ACTION_TYPES,
    scene: ACTION_SCENE,
}