const mustache = require('mustache');
import {commonKeyValuePair} from "../@types/common";
import { WebPage } from "../@types/data";
import {PredefinedSchema, predefinedSchemaMap} from "./predefined";

export enum METHOD_NUM {
    copy='COPY',
    download= 'DOWNLOAD',
    api='API',
}


export type ConvertMethod = {
    name: string,
    template: string | PredefinedSchema,
    method: METHOD_NUM,
    customSetting: commonKeyValuePair[]
}

export const getDefaultConvertMethod = function(): ConvertMethod{
    return {
        name: "导出Markdown至剪切板",
        template: PredefinedSchema.markdown,
        method: METHOD_NUM.copy,
        customSetting: [{
            key: '_test',
            value: ''
        }],
    }
}

export const convertDataToString = function(data: WebPage,schema=predefinedSchemaMap[PredefinedSchema.markdown]): string{
    let result = '';
    try{
        result = mustache.render(schema,data)
    }catch (e){
        console.error(e)
    }
    return result;
}