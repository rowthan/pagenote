import {Parser} from 'expr-eval'

export function ifCheck(input: string,context?: any) {
    const parser = new Parser();
    try{
        return parser.evaluate(input,context)
    }catch (e) {
        console.error(e);
        return false;
    }
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
    parse: parser.functions.parse
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
