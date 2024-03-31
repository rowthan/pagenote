
import handlebars  from './handlebars';
import http  from './http';
import pickData from "./pkData";
import table from "./table";
import format from './format'
import {IAction} from "../typing/IAction";


export {
    handlebars,
    http,
    pickData,
    table,
    format,
    getAction,
}

/**
 * 根据action 名称，获取执行方法
 * */
function getAction(uses: string):Promise<IAction> {
    const [_namespace = '', action] = uses.split('/');
    const [actionName = ''] = action.split('@');
    switch (actionName) {
        case 'handlebars':
            return Promise.resolve(handlebars);
        case 'http':
            return Promise.resolve(http);
        case 'pickData':
            return Promise.resolve(pickData);
        case 'table':
            return Promise.resolve(table);
        case 'format':
            return Promise.resolve(format);
        default:
            return Promise.reject(`未找到${uses}的实现`);
    }
}
