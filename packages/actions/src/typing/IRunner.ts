import {WorkFlow} from "./index";
import {IAction} from "./IAction";

/***
 * 一个运行容器
 * */
export interface IRunner {
    new(props: WorkFlow): IRunner;
    context: {
        // 环境变量
        env: {
            [key: string]: string | number | boolean | undefined
        },
        trigger:{

        },
        actions: Record<string, IAction>
    }
    // 环境检测
    check:()=>Promise<boolean>
    // 装载 action ，环境准备
    prepare:(action: string)=>Promise<void>

    // 执行任务
    runNext:()=>void
}
