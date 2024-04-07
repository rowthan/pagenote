import set from "lodash/set";
import {format} from "../actions";

/**
 * input: {a: "${{env.host}}/get${{env.id}}", b:{ c: "${{env.id}}"},list: ["${{env.account.username}},"${{env.account}}""], d: "${{env.fun}}", e:["${{env.id}}","${{env.host}}"]}
 * variables: {env:{host: "127.0.0.1", id: "123",account:{username:"name"} fun: function(){}}}
 *
 * */
//@ts-nocheck
type InputValue = string | InputObject | string[] | boolean | number | null | undefined;
type InputObject = Record<string, any> | string;
type VariablesObject = { [key: string]: any };

/**
 * todo 对于数组 .length 计算异常
 * ${{steps.lights_keys.outputs}} 对于没有的值，设置初始默认值
 * */
function replaceTemplates<T extends InputObject>(input: InputObject, variables: VariablesObject,replaceWhenEmpty?: any): T {
    const replacer = (value: InputValue): InputValue => {
        if (typeof value === 'string') {
            return replaceStringTemplate(value);
        } else if (Array.isArray(value)) {
            return value.map(typeof value === 'string' ? replaceStringTemplate : replacer);
        } else if (typeof value === 'object' && value !== null) {
            return recursiveReplace(value);
        }
        return value;
    };

    const replaceStringTemplate = (str: string=''): any => {
        let response: string | any = str;
        const templateMatches = str.match(/\${{\s*([^}]+)\s*}}/g);
        const isStringTemplate = templateMatches && templateMatches.length > 1;
        if (templateMatches) {
            for (const match of templateMatches) {
                const matchString = match.match(/\${{\s*([^}]+)\s*}}/)?.[1]?.trim();
                // 修饰符，对输出结果，进行二次加工处理
                const keyAndModifier = matchString?.split("|");
                const key = keyAndModifier?.[0]?.trim();
                /**变量key ，值替换*/
                if (key) {
                    let replacement;
                    // 特殊字符串直接返回
                    if('null' === key){
                        replacement = null;
                    } else {
                        replacement = getKey(variables, key)
                    }

                    if(replacement === undefined){
                        replacement = replaceWhenEmpty;
                    }

                   // 如果没有值，则直接返回
                   if(replacement !== undefined){
                       if(keyAndModifier && keyAndModifier?.length > 1){
                           for(let i=1; i<keyAndModifier.length; i++){
                               replacement = format({
                                   data: replacement,
                                   method: keyAndModifier[i],
                               })
                           }
                       }
                       // 如果是字符串模板，以及替换结果是字符串，则直接按照字符串替换变量
                       if(isStringTemplate || typeof replacement === 'string'){
                           response = response
                               .replace(match,replacement);
                       }else{
                           response = replacement;
                       }
                   }
                }
            }
        }
        if(response===str && templateMatches && templateMatches.length===1){
            return undefined
        }
        return response;
    };

    /**
     * 遍历模板对象，递归处理
     * */
    const recursiveReplace = (obj: InputObject) => {
        /**
         * 如果是数组，需要循环处理每一个元素进行替换；
         * */
        if (Array.isArray(obj)) {
            return obj.map(replacer);
        }
        // 字符串，进行变量替换
        else if(typeof obj === 'string'){
            return replacer(obj);
        }
        // 数值、布尔，类型，不需要替换，直接返回
        else if(['number','boolean'].includes(typeof obj)) {
            return obj
        }

        const result: InputObject = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                const value = obj[key];
                set(result,key,replacer(value))
            }
        }
        return result;
    };

    return recursiveReplace(input) as T;
}

function getKey(obj: VariablesObject, key: string): string | (() => any) | VariablesObject {
    const keys = key.split('.');
    return keys.reduce((acc, currentKey) => acc && acc[currentKey], obj);
}

export {
    replaceTemplates
}
