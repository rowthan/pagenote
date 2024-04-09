import {Parser} from 'expr-eval'
import lodash from "lodash";
import dayjs from "dayjs";

export function ifCheck(input: string,context?: any) {
    let result;
    /**
     * 对于非判断，则先进行正向判断后再逆转结果。
     * 因为如果直接逆向判断，执行 exprEval 异常时，恒为 false.
     * 如 !value==2 当value 变量不存在时预期结果应该为 true，，但由于表达式报错，进入 catch ，结果为 false.
     * 故，不推荐 != 的用法。应该优先使用： !(value==2) 而不是 value!=2
     * */
    const isConvertCheck = input[0] === '!';
    const operator = isConvertCheck ? input.slice(1) : input;
    try{
        result = Boolean(exprEval(operator,context));
    }catch (e) {
        result = false;
    }
    return isConvertCheck ? !result : result;
}
const parser = new Parser({
    operators:{
        logical: true,
        comparison: true,
    }
});

/**扩展方法*/
parser.functions.string = function (input:any) {
    return JSON.stringify(input)
};

parser.functions.parse = function (input: string) {
    try{
        return JSON.parse(input)
    }catch (e) {
        return input
    }
}

parser.functions.JSON = {
    stringify: parser.functions.string,
    parse: parser.functions.parse,
}

parser.functions = {
    ...parser.functions,
    lodash: lodash,
    dayjs: dayjs,
    Date: Date
}

/**
 * https://github.com/silentmatt/expr-eval
 * */
export function exprEval(input: string,context?: any):unknown {
    // 特殊字符处理
    if('null' === input.trim()){
        return null;
    }else if('undefined' === input.trim()){
        return undefined
    }

    /**
     * 提取变量字符串和修饰符方法名
     * */
    const modifier = input.split(/\s+\|\s+/);
    const [variableString,...modifierActions] = modifier;

    /**
     * 改写expr-eval || 运算符计算规则：
     * expr-eval 对于 || 当作数组合并运算符，同 join 方法。此处将其改写为 或 运算，用于对变量进行默认兜底赋值
     * */
    const variableKeys = variableString.split("||");
    let result:unknown;

    /**or 运算，单独计算每一个值
     * 直到满足条件
     * */
    if(variableKeys.length > 1){
        for(let i=0; i<variableKeys.length; i++){
            result = result || exprEval(variableKeys[i],context);
            if(result){
                break;
            }
        }
    }else {
        /**如果变量不存在则会报错，赋值为 undefined。多数情况是因为 context 不含有对应的变量声明*/
        try{
            result = parser.evaluate(variableString.trim(),context || {})
        }catch (e) {
            result = undefined;
        }
    }

    /**
     * 对结果进行二次加工处理，修饰符用法：
     * ${{object.key}} | string 等同于 string(${{object.key}})
     * 修饰符的用法相比方法调用，更加灵活易读
     * */
    if(modifierActions && modifierActions.length){
        for(let i=0; i<modifierActions.length; i++){
            const action = modifierActions[i];
            /**
             * 修饰符运算异常捕获
             * */
            try{
                result = parser.evaluate(`${action}(params)`,{
                    params: result as any
                })
            }catch (e) {
                console.warn(action ,'calc error: ',e,)
            }
        }
    }
    return result
    // return new Function('return ' + input)();
}
