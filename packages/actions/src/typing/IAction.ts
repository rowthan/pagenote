

export type IAction = (args: any, context?: {
    runner: "background" | 'content_script',
    extVersion: string,
}) => Promise<any>
