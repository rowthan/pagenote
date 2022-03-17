import create_new_light from "./create_new_light";
import search from "./search";
import send_to_email from "./send_to_email";
import send_to_flomo from "./send_to_flomo";
import copy from "./copy";
import custom from "./custom";
import {Action, ACTION_SCENE, ACTION_TYPES} from "./@types";
import {ICON} from "../icons";

const defaultActionMap: Record<ACTION_TYPES,ActionConfig> = {
    [ACTION_TYPES.custom]: custom,
    [ACTION_TYPES.create_new_pagenote]: create_new_light,
    [ACTION_TYPES.search]: search,
    [ACTION_TYPES.send_to_email]: send_to_email,
    [ACTION_TYPES.send_to_flomo]: send_to_flomo,
    [ACTION_TYPES.copyToClipboard]: copy
}

export const publicActionStores = [create_new_light,search,copy,send_to_email,send_to_flomo,custom]

export default defaultActionMap


export interface ActionDefine {
    icon: ICON, // initData  icon 为空的情况下，取define的值
    name: string,
    version: string,
    actionType: ACTION_TYPES,

    description: string,
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
    clickScript: string,
    scenes: ACTION_SCENE[],
}

export interface ActionConfig{
    define: ActionDefine,
    initData: Omit<Action, 'icon'|'version'|'actionType'|'name'>,
}

export function createInitAction(actionType: ACTION_TYPES):Action {
    const actionConfig = defaultActionMap[actionType];
    const action: Action = {
        actionType: actionConfig.define.actionType,
        name: actionConfig.define.name,
        version: actionConfig.define.version,

        scene: actionConfig.initData.scene,
        shortcut: actionConfig.initData.shortcut,
        customSetting: actionConfig.initData.customSetting,

        icon: actionConfig.define.icon,
    }
    return action
}