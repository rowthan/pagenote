import {ifCheck,exprEval} from "../../src/utils/expr-eval";


describe('if', () => {
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

    it('if operator', async () => {
        const result = ifCheck(`steps.test_put.outputs._status == 204 ? 0 : 1`,{
            steps:{
                test_put: {
                    outputs: {
                        _status: 204
                    }
                }
            }
        });
        expect(result).toBe(0);
    });

    it('if operator', async () => {
        const result = ifCheck(`number==22 ? 0 : 1`,{
            number: 22
        });
        expect(result).toBe(0);
    });
})

const variables = {
    a: 1,
    b: 2,
    fun: function () {

    },
    array1: [1],
    array2: [2],
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

    // it('关键字字符串',()=>{
    //
    // })

})
