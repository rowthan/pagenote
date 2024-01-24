import {replaceTemplates} from "../../src/utils/replace";


describe('check replace', () => {
    it('should replace variables', function () {
        const input = {
            a: "${{env.host}}/get/${{env.id}}",
            b: { c: "${{env.id}}", d: {
                  h: "11",
                  e: "${{env.id}}"
                }
            },
            list: ["${{env.account}}","${{env.account.username}}"],
            d: "${{env.fun}}",
            e: ["${{env.id}}", "${{env.host}}"],
            f: "${{env.host}}/get/${{env.ids}}",
            g: ["${{env.id}}", "${{env.emptykey}}"],
            h: ["${{env.emptykey}}", "${{env.id}}"],
            i: "${{env.empty}}/get/${{env.id}}",
        };

        const variables = {
            env: {
                host: "127.0.0.1",
                id: "123",
                account: { username: "name" },
                fun: function () {
                    console.log("Executing function");
                }
            }
        };

        const result = replaceTemplates(input, variables);
        expect(result).toEqual({
            a: "127.0.0.1/get/123",
            b: { c: variables.env.id ,
                d:{
                    h: "11",
                    e: "123"
                }
            },
            list: [variables.env.account,variables.env.account.username],
            d: variables.env.fun,
            e: [variables.env.id, variables.env.host],
            f: '127.0.0.1/get/',
            g: ['123',undefined],
            h: [undefined,'123'],
            i: '/get/123'
        })
    });
})
