import {PredefinedSchema, predefinedSchemaMap} from "./predefined";
import mustache from "mustache";
import {WebPage} from "../@types";

export const convertDataToString = function(data: WebPage,schema=predefinedSchemaMap[PredefinedSchema.markdown]): string{
    let result = '';
    try{
        result = mustache.render(schema,data)
    }catch (e){
        console.error(e)
    }
    return result;
}
