import {ifCheck,exprEval} from "../../src/utils/expr-eval";


describe('if', () => {
    const context = {
        steps:{
            test_put: {
                outputs: {
                    _status: 204
                }
            }
        },
        number:22,
    }

    it('if equal', async () => {
        const result = ifCheck('1==1');
        expect(result).toBe(true);
    });

    it('if variable check', async () => {
        const result = ifCheck(`steps.outputs==1`, {
            steps: {
                outputs: 1
            }
        });
        expect(result).toBe(true);
    });

    it('if operator 三元表达式', async () => {
        const result = ifCheck(`steps.test_put.outputs._status == 204 ? 0 : 1`,context);
        expect(result).toBe(false);

        const result2 = ifCheck(`number==22 ? 1 : 0`,context);
        expect(result2).toBe(true);
        expect(ifCheck('number==22',context)).toBe(true);
        expect(ifCheck('numbers==22',context)).toBe(false);
    });

    it('非判断',()=>{
        expect(ifCheck('number!=24',context)).toBe(true);
        expect(ifCheck('!(numbers==22)',context)).toBe(true);
        expect(ifCheck('!(number==22)',context)).toBe(false);
    })

})

const variables = {
    a: 1,
    b: 2,
    fun: function () {

    },
    array1: [1],
    array2: [2],
    author: "pagenote rowthan"
}
describe('exprEval', () => {
    it('get value',()=> {
        expect(exprEval('1+1')).toBe(2)

        expect(exprEval('1+a',variables)).toBe(2)
        expect(exprEval('a+b',variables)).toBe(3)
        expect(exprEval('fun',variables)).toBe(variables.fun)
    })
    it('or operation',()=>{
        expect(exprEval('1 == 1 or 1 == 2')).toBe(true)
    })

    it('|| operation',()=>{
        expect(exprEval('array1 || array2',variables)).toEqual(variables.array1)
        expect(exprEval('0 || array1 || array2',variables)).toEqual(variables.array1)
        expect(exprEval("1 || 0")).toEqual(1)
        expect(exprEval("0 || 0 || 1")).toEqual(1)
        expect(exprEval("false || 1 || 2")).toEqual(1)
    })

    it('length',()=>{
        expect(exprEval('length(array1)',variables)).toEqual(1)
        expect(exprEval('length("array1")',variables)).toEqual(6)
    })

    it('自定义 string 方法',()=>{
        expect(exprEval('string(array1)',variables)).toEqual(JSON.stringify(variables.array1))

    })

    it('自定义 parse 方法',()=>{
        const object = {a:1}
        const string = JSON.stringify(object)
        expect(exprEval(`parse('${string}')`,variables)).toEqual(object)
    })

    it('运行时生成变量',()=>{
        const result = exprEval('Date.now()') as number;
        expect(result - Date.now() < 10).toBe(true)
    })

})

describe('复杂运算', () => {
    it('方法 + 比较运算',()=>{
        const context = {
            a: [1,2,2]
        }
        expect(exprEval('length(a)',context)).toBe(context.a.length)
    })
})

describe('扩展方法', () => {
    it('contains 方法',()=>{
        expect(exprEval('contains(author,"pagenote")',variables)).toBe(true)
        expect(exprEval('contains(author,"aaaa")',variables)).toBe(false)

    })

    it('startsWith 方法',()=>{
        expect(exprEval('startsWith(author,"pagenote")',variables)).toBe(true)
        expect(exprEval('startsWith(author,"aaaa")',variables)).toBe(false)

    })
})
