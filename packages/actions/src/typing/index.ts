enum USES {
    ARTIFACTV3 = 'pagenote/table@v1', // 使用缓存保存信息表
    FETCH = 'pagenote/fetch@v1', // 请求服务端数据
    CONFIG = 'pagenote/config@v1', // 获取配置
    TABLE_DIFF = "pagenote/table_diff@v1",
    DATA_MAPPING = "pagenote/mapping@v1",
    PICK_DATA = "pagenote/pick@v1",
    DATA_CONVERT = "pagenote/convert@v1",
}

export enum TaskState {
    running = 1,
    complete = 2,
    fail = -1,
    waiting = 0,
    skip    = 3,
}

export enum WorkFlowState {
   waiting = 0,
   running = 1,
   success = 2,
   fail = -1,
}

export type Step = {
    name: string,
    id?: string, // 唯一，运行获取此 step 的output 的重要参数
    uses?: USES | string,
    with?: Record<string, any> // uses 的参数配置
    'continue-on-error'?: boolean
    output?: string // 将结果存储为
    debug?: boolean
    // run?: Step[]
    if?: string
    _state: TaskState
}
export type Job = {
    // 任务id
    id?: string,
    // 任务名
    name: string,
    // 任务步骤
    steps: Step[],
    // 列表运行
    strategy?: {
        matrix: {
            [key: string]: any[]
        }
    }

    _state: TaskState
}
export type WorkFlow = {
    name: string,
    env: {
        key: string,
        id: string,
        name: string
        default: string | any;
    }[]
    on: {
        change?: {
            dbs?: string[],
            tables?: string[],
        },
        schedule?: {},
        visit?: {
            url?: string,
            domain?: string,
        }
    },
    jobs: Job[],
}
