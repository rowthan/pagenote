
import handlebars  from './handlebars';
import http  from './http';
import pickData from "./pkData";
import table from "./table";
import format from './format'
import lib from './lib';
import {IAction} from "../typing/IAction";


export {
    handlebars,
    http,
    pickData,
    table,
    format,
}

const actionMap: Record<string, IAction> = {
    'pagenote/lib@v1': lib,
}

/**
 * 根据action 名称，获取执行方法
 * */
export function getAction(uses: string):Promise<IAction|null> {
    const [_namespace = '', action=''] = uses.split('/');
    const [actionName = ''] = action.split('@');
    if(actionMap[uses]){
        return Promise.resolve(actionMap[uses]);
    }
    switch (actionName) {
        case 'handlebars':
            return Promise.resolve(handlebars);
        case 'http':
            return Promise.resolve(http);
        case 'pick':
            return Promise.resolve(pickData);
        case 'format':
            return Promise.resolve(format);
        default:
            return Promise.resolve(null);
    }
}
