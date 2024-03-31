import {replaceTemplates} from "../../src/utils/replace";

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

        const result = replaceTemplates(input, variables,'');
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
            g: ['123',''],
            h: ['','123'],
            i: '/get/123'
        })
    });

    it('should keep origin value when replaceWhenEmpty is empty', () => {
        const input = {
            a: `$\{{env.id}}/123/$\{{env.emptyKey}}`,
            g: ["${{env.id}}", "${{env.emptykey}}"],
        }
        expect(replaceTemplates(input, variables)).toEqual({
            a: `${variables.env.id}/123/$\{{env.emptyKey}}`,
            g: ["123", "${{env.emptykey}}"],
        })
    })

    it('replace array object', () => {
        const job = {
            "steps": [
                {
                    "name": "或许当前插件内数据",
                    "uses": "pagenote/table@v1",
                    "id": "getCurrentDataList",
                    "with": {
                        "table": "memo",
                        "db": "lightpage",
                        "method": "keys"
                    }
                }
            ],
            "_state": 1
        }
        const variables = {
            "jobs": {
                "get_change_list": {}
            }
        }
        expect(replaceTemplates(job, variables)).toEqual(job)
    })


    it('should replace matrix by jobs outputs',()=>{
        const input = {
            "name": "将本地变更的数据同步至远端",
            "id": "sync_to_cloud",
            "strategy": {
                "matrix": {
                    "item": "${{jobs.get_change_list.outputs}}"
                }
            },
        }
        const variables = {
            "jobs": {
                "get_change_list": {
                    "outputs": [
                        "test",
                        "init_key1706189561513"
                    ]
                }
            }
        }

        const replaced = replaceTemplates(input, variables)
        //@ts-ignore
        expect(replaced?.strategy?.matrix?.item).toEqual(variables.jobs.get_change_list.outputs)
    })

    it('should replace plain string',()=>{
        const res = replaceTemplates("hello ${{hello.world}}",{
            hello: {
                world: "world"
            }
        })

        expect(res).toEqual('hello world')
    })
})

describe('replace by and modify',()=>{
    it('should replace by and modify',()=>{
        const input = "${{env.account | JSON.stringify}}"
        expect(replaceTemplates(input,variables)).toEqual(JSON.stringify(variables.env.account))
    })

    it('should replace by multi modify',()=>{
        const input = "${{env.account | JSON.stringify | JSON.parse}}"
        expect(replaceTemplates(input,variables)).toEqual(variables.env.account)
    })
})
