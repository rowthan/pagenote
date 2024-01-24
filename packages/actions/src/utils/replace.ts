
/**
 * input: {a: "${{env.host}}/get${{env.id}}", b:{ c: "${{env.id}}"},list: ["${{env.account.username}},"${{env.account}}""], d: "${{env.fun}}", e:["${{env.id}}","${{env.host}}"]}
 * variables: {env:{host: "127.0.0.1", id: "123",account:{username:"name"} fun: function(){}}}
 *
 * */
//@ts-nocheck
type InputValue = string | InputObject | string[];
type InputObject = { [key: string]: InputValue };
type VariablesObject = { [key: string]: any };

function replaceTemplates(input: InputObject, variables: VariablesObject): InputObject {
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

    const replaceStringTemplate = (str: string): any => {
        let response: any = str;
        const templateMatches = str.match(/\${{\s*([^}]+)\s*}}/g);
        const remainLastResult = templateMatches && templateMatches.length > 1;
        if (templateMatches) {
            for (const match of templateMatches) {
                const key = match.match(/\${{\s*([^}]+)\s*}}/)?.[1]?.trim();
                if (key) {
                    const replacement = getKey(variables, key) || (remainLastResult ? '' : undefined);
                    if(replacement!==undefined){
                        if (typeof replacement === 'string') {
                            response = response.replace(match, replacement !== undefined ? replacement : match);
                        } else {
                            response = replacement;
                        }
                    }else{
                        response = undefined
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
