

export type DeveloperTask = {
    taskID: string,
    title: string,
    message: string,
    reward: string,
    coin: number,
    draftImg?: string,
    taskType: string,
    subType: string,
    git: string
}

export const developerTask: Record<string, DeveloperTask> = {
    "importPart": {
        taskID: "importPart",
        title: "备份选项",
        message: "备份时，弹窗交互，让用户选择备份哪些数据，避免冗余备份",
        reward: "",
        coin: 1,
        draftImg: "",
        taskType: "",
        subType: "",
        git: "",
    }
}
