type Action = {

}

enum WorkFlowOn {
    change = 'change',
    schedule = 'schedule'
}

enum USES {
    ARTIFACTV3 = 'actions/table@v1', // 使用缓存保存信息表
    FETCH = 'actions/fetch@v1', // 请求服务端数据
    CONFIG = 'actions/config@v1', // 获取配置
    TABLE_DIFF = "actions/table_diff@v1",
    DATA_MAPPING = "actions/mapping@v1",
    PICK_DATA = "actions/pick@v1",
    DATA_CONVERT = "actions/convert@v1",


}

type Step = {
    name: string,
    id?: string, // 唯一，运行获取此 step 的output 的重要参数
    uses?: USES | string,
    with?: Record<string,any> // uses 的参数配置
    output?: string // 将结果存储为
    // run?: Step[]
    if?: {
        input: any,
        target: any,
        compare: '=' | ">" | "!=" | "startsWith"
    }
}

type Job = {
    id?: string,
    name: string,
    steps: Step[],
    needs?: string[],
    strategy?:{
        matrix: {
            [key: string]: string | any;
        }
    }
}

type WorkFlow = {
    name: string,
    on: {
        change?: {
            dbs?: string[],
            tables?: string[],
        },
        schedule?:{

        },
        visit?:{
            url?: string,
            domain?: string,
        }
    },
    jobs: Job[],
    configTip?:{
        "obsidian.url":"obsidian 服务器地址",
        "obsidian.token":"obsidian token"
    }
}

const flowToCloudString = `
name: memo to obsidian
on:
 schedule: 1*
 change:
  tables: 
   - memo
   - setting
jobs:
# 任务1 拉取本地
 - name: 读取变更内容
   id: "get_change_list"
   steps: 
     - name: "读取配置"
       id: "get_config"
       uses: "actions/config@v1"
       with: 
         rootKey: "obsidian"
     - name: "请求远程的同步ID"
       id: "getConfig"
       uses: "actions/fetch@v1"
       with:
         url: ${{steps.url}}
         headers:
          token: ${{steps.get_config.obsidian.token}}
     - name: "计算本地上次变更后"
       uses: "actions/table_diff@v1"
       with: 
         table: "memo"
         db: "lightpage"
         sync_id: ${{steps.getConfig.output}}

# 任务2: 流出数据
 - name: "本地变更的数据与远程同步"
   strategy:
     matrix:
       # 从上一个 job 中获取获得变更列表作为循环处理的初始值
       item: ${{jobs.output.get_change_list}}
   steps:
     - name: "获取本地数据"
       uses: "actions/table@v1"
       with:
         table: "memo"
         db: "lightpage"
         get: ${{matrix.item.key}}
     - name: "获取远程数据"
       uses: "actions/fetch@v1"
       with:
         url: ${{config.url}}
`

const flowToCloud: WorkFlow = {
    name: "memo to obsidian",
    on: {
        change: {
            tables: ['memo']
        },
    },
    jobs: [{
        name: "读取远程变更内容",
        steps: [{
            name:"读取配置",
            uses: "actions/config@v1",
            with:{
                rootKey: "obsidian",
            },
            output: "config"
        },{
            name:"请求远程的同步ID",
            uses: "actions/fetch@v1",
            with:{
                url: "${{config.url}}",
                headers: {
// todo 配置项
                }
            },
            output: "sync_id"
        },{
            name:"计算本地与远程同步后的变更",
            uses: "actions/table_diff@v1",
            with: {
                table:"memo",
                db:"lightpage",
                snapshotId: "${{output.sync_id}}"
            },
            output: "change_list"
        }]
    },{
        name:"比较本地远端的数据pick",
        strategy:{
            matrix: {
                changeKey: "${{output.change_list}}"
            }
        },
        steps: [{
            name:"获取本地数据",
            uses: "actions/table@v1",
            with:{
                table:"memo",
                db:"lightpage",
                get: "${{matrix.changeKey}}"
            },
            output: "localData"
        },{
            name:"获取远程数据",
            uses: "actions/fetch@v1",
            with:{
                url: "${{obsidian.url}}",
                headers: {}
            },
            output: "cloudData.${{matrix.index}}"
        },{
            name:"比较数据",
            uses: "actions/pick@v1",
            with:{
                first: "${{localData}}",
                second: "${{cloudData}}"
            },
            output: "pickResult"
        },{
            if:{
                input: "${{pickResult.index}}",
                target: 1,
                compare: "=",
            },
            name:"数据转换为远程数据",
            uses: "actions/convert@v1",
            with:{
                input:"${{pickResult.winner}}",
            },
            output: "winner"
        },{
            name:"更新至远程",
            uses: "actions/fetch@v1",
            if:{
                input: "${{pickResult.index}}",
                target: 1,
                compare: "=",
            },
            with:{
                url: "${{obsidian.url}}",
                headers: {}
            },
            output: "cloudData"
        },{
            name:"标记成功",
            uses:"actions/table@v1",
            with:{
                table:"history",
                db: "sync",
                put:{
                    failer: "${{}}",
                    winnder: "${{}}",
                    cloudId: "${{}}",
                }
            }
        },{
            if:{
                input: "${{pickResult.index}}",
                target: 0,
                compare: "=",
            },
            name:"数据转换为远程数据",
            uses: "actions/convert@v1",
            with:{
                input:"${{pickResult.winner}}",
            },
            output: "winner"
        },{
            name:"更新至本地",
            uses: "actions/fetch@v1",
            if:{
                input: "${{pickResult}}",
                target: 0,
                compare: "=",
            },
            with:{
                url: "${{obsidian.url}}",
                headers: {}
            },
            output: "cloudData"
        },{
            name:"记录本次更新后的快照",
        
        }]
    }]
}

// https://nodeca.github.io/js-yaml/
const cloudToLocal: WorkFlow = {
    name: "远程同步至本地",
    on: {
        schedule: {
            
        },
    },
    jobs: [
        {
            name:"获取远程数据",
            steps: [{
                name:"拉取数据列表",
                uses: "actions/fetch@v1",
                with:{
                    url: "${{obsidian.url}}",
                    headers: {}
                },
                output: "cloud_list"
            }]
        },
        {
            name:"获取远程数据",
            strategy:{
                matrix: {
                    changeKey: "${{output.change_list}}"
                }
            },
            steps:[
                {
                    name:"获取本地数据",
                    uses: "actions/table@v1",
                    with:{
                        table:"memo",
                        db:"lightpage",
                        get: "${{matrix.changeKey}}"
                    },
                    output: "localData"
                }
            ]
        },
    ]
}