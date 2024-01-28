import {ifCheck} from "../../src/utils/if";


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

})
