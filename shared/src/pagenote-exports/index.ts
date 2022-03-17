import {commonKeyValuePair} from "../@types/common";
import {PredefinedSchema} from "./predefined";

export enum METHOD_NUM {
    copy='COPY',
    download= 'DOWNLOAD',
    api='API',
}


export type ExportMethod = {
    name: string,
    schema: string | PredefinedSchema,
    method: METHOD_NUM,
    customSetting: commonKeyValuePair[]
}