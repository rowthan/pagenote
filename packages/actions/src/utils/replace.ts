
/**
 * input: {a: "${{env.host}}/get${{env.id}}", b:{ c: "${{env.id}}"},list: ["${{env.account.username}},"${{env.account}}""], d: "${{env.fun}}", e:["${{env.id}}","${{env.host}}"]}
 * variables: {env:{host: "127.0.0.1", id: "123",account:{username:"name"} fun: function(){}}}
 *
 * */
//@ts-nocheck
type InputValue = string | InputObject | string[];
type InputObject = Record<string, any>;
type VariablesObject = { [key: string]: any };

function replaceTemplates<T extends InputObject>(input: InputObject, variables: VariablesObject, replaceWhenEmpty?:any): T {
    const replacer = (value: InputValue): InputValue => {
        if (typeof value === 'string') {
            return replaceStringTemplate(value);
        } else if (Array.isArray(value)) {
            return value.map(replaceStringTemplate);
        } else if (typeof value === 'object' && value !== null) {
            return recursiveReplace(value);
        }
        return value;
    };

    const replaceStringTemplate = (str: string=''): any => {
        let response: str | unknown = str;
        const templateMatches = str.match(/\${{\s*([^}]+)\s*}}/g);
        const isStringTemplate = templateMatches && templateMatches.length > 1;
        if (templateMatches) {
            for (const match of templateMatches) {
                const key = match.match(/\${{\s*([^}]+)\s*}}/)?.[1]?.trim();
                /**变量key ，值替换*/
                if (key) {
                    let replacement =
                        getKey(variables, key);
                    /**如果变量中没有对应的值，则根据配置重新设置值*/
                   if(replacement === undefined){
                       replacement = replaceWhenEmpty;
                   }

                   // 如果没有值，则直接返回
                   if(replacement !== undefined){
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
        return response;
    };

    const recursiveReplace = (obj: InputObject) => {
        if (Array.isArray(obj)) {
            return obj.map(replacer);
        }

        const result: InputObject = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                const value = obj[key];
                result[key] = replacer(value);
            }
        }
        return result;
    };

    return recursiveReplace(input);
}

function getKey(obj: VariablesObject, key: string): string | (() => any) | VariablesObject {
    const keys = key.split('.');
    return keys.reduce((acc, currentKey) => acc && acc[currentKey], obj);
}

export {
    replaceTemplates
}
