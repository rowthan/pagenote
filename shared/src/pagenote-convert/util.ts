import {WebPage} from "../@types/data";
import {PredefinedSchema, predefinedSchemaMap} from "./predefined";
import mustache from "mustache";

export const convertDataToString = function(data: WebPage,schema=predefinedSchemaMap[PredefinedSchema.markdown]): string{
    let result = '';
    try{
        result = mustache.render(schema,data)
    }catch (e){
        console.error(e)
    }
    return result;
}
