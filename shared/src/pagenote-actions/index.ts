import create_new_light from "./create_new_light";
import search from "./search";
import send_to_email from "./send_to_email";
import send_to_flomo from "./send_to_flomo";
import copy from "./copy";
import custom from "./custom";
import {Action, ActionTypes} from "./@types";

const defaultActionMap: Record<ActionTypes,ActionConfig> = {
    [ActionTypes.custom]: custom,
    [ActionTypes.create_new_pagenote]: create_new_light,
    [ActionTypes.search]: search,
    [ActionTypes.send_to_email]: send_to_email,
    [ActionTypes.send_to_flomo]: send_to_flomo,
    [ActionTypes.copyToClipboard]: copy
}

export default defaultActionMap

export enum ACTION_SCENE{
    text='text'
}

export const sceneMap = {
    [ACTION_SCENE.text]: '选中文本时'
}

export interface ActionConfig extends Action{
    actionType: ActionTypes,

    // 设置项字段
    formConfig: {
        gridSize: number,
        name: string,
        label: string,
        type: string,
        data?: any,
        rules?: {
            required?: boolean,
            pattern?: RegExp,
            message: string,
        }[]
    }[],
    description: string,
}