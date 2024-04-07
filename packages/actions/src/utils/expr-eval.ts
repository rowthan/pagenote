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

export function exprEval(input: string,context?: any) {
    const parser = new Parser();
    // todo 如果context 不存在 input 表达式中的变量，会报错
    // 异常输入：a.b.c {}
    return parser.evaluate(input,context)
    // return new Function('return ' + input)();
}
