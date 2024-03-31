import {Parser} from 'expr-eval'

export function ifCheck(input: string,context?: any) {
    const parser = new Parser();
    return parser.evaluate(input,context)
    // return new Function('return ' + input)();
}

export function exprEval(input: string,context?: any) {
    const parser = new Parser();
    return parser.evaluate(input,context)
    // return new Function('return ' + input)();
}
