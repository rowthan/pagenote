import {ifCheck} from "../../src/utils/expr-eval";


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
