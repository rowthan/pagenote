

export interface IAction {
    id: string
    version: string
    // 运行环境要求、权限管理
    engines?: {
        extension?: string
        browser?: string
        runner?: string
    }
    description: string
    run: (args: any, context?: {
        background: any,
    }) => Promise<any>
}
