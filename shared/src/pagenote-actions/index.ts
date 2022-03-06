import create_new_light from "./create_new_light";
import search from "./search";
import send_to_email from "./send_to_email";
import send_to_flomo from "./send_to_flomo";
import copy from "./copy";

// 缺省提供的方法
export enum ActionTypes{
    // custom='custom', // 自行写入的脚本
    // openLink='openLink',
    // openLinkWithPopup='openLinkWithPopup',
    copyToClipboard="copy",
    send_to_flomo='send_to_flomo',
    send_to_email='send_to_email',
    search='search',
    create_new_pagenote='create_new_pagenote'
}

const defaultActionMap: Record<ActionTypes,ActionConfig> = {
    [ActionTypes.create_new_pagenote]: create_new_light,
    [ActionTypes.search]: search,
    [ActionTypes.send_to_email]: send_to_email,
    [ActionTypes.send_to_flomo]: send_to_flomo,
    [ActionTypes.copyToClipboard]: copy,
}

export default defaultActionMap

export enum ACTION_SCENE{
    text='text'
}

export const sceneMap = {
    [ACTION_SCENE.text]: '选中文本时'
}

export interface ActionConfig{
    version?: string,
    icon: string,
    name: string,
    clickScript: string,
    setting?: {
        gridSize: number,
        name: string,
        label: string,
        type: string,
        rules: {
            required?: boolean,
            pattern?: RegExp,
            message: string,
        }[]
    }[],
    scene: string,
    description: string,
    defaultSetting: Record<string,any>
}