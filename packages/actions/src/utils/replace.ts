import set from "lodash/set";
import {exprEval} from "./expr-eval";

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
 *
 * */
function replaceTemplates<T extends InputObject>(input: InputObject, variables: VariablesObject): T {
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
        // 定义默认返回为源字符串
        // 提取变量组
        const templateMatches = str.match(/\${{\s*([^}]+)\s*}}/g) || []
        if(templateMatches.length===0){
            return str;
        }
        const leftStr = str.replaceAll(/\${{\s*([^}]+)\s*}}/g,'');
        /**
         * 判断是否当作纯字符串处理
         * 变量模板替换后，没有任何其他字符时，可以认为是单一变量替换
         * */
        const isStringTemplate = templateMatches.length > 1 || leftStr.trim().length > 0;

        // 循环遍历查找变量值
        const responseArray = [];
        let responseStr = str;
        for (const match of templateMatches) {
            // 提取变量key
            const key = match.match(/\${{\s*([^}]+)\s*}}/)?.[1]?.trim() //keyAndModifier?.[0]?.trim();
            // 初始化本次替换值
            let variableValue:unknown = "${{"+key+"}}";
            if (key) {
                // 特殊字符串直接返回
                if('null' === key){
                    variableValue = null;
                }else if('undefined' === key){ // 外层的判断不可删除
                    variableValue = undefined
                } else {
                    // 如果variables 缺少变量，则可能替换异常,异常情况，不做任何修改
                    try{
                        const evalValue = exprEval(key,variables)
                        if(evalValue!==undefined){
                            variableValue = evalValue;
                        }
                    }catch (e) {
                        console.warn(e)
                    }
                }
            }
            responseArray.push(variableValue)
            if(isStringTemplate){
                responseStr = responseStr.replace(match,variableValue as string);
            }
        }

        // 字符串模板，则拼接字符串返回。单一变量则直接返回结果
        if(isStringTemplate){
            return responseStr
        }else{
            return responseArray[0];
        }
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

export {
    replaceTemplates
}
