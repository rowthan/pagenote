import { Collection } from "./collection"

enum ExportTarget {
    obsidian = 'obsidian'
}


type ExportConfig =  {
    template: string; // 单条数据的渲染模板
    targetDir: string; // 单挑数据渲染后的存储路径
    abstractTemplate?: string // 摘要统计模板
    abstractTargetDir?: string // 摘要存储路径
}

type ExportMap = Record<ExportTarget,ExportConfig>

export const exportConfig:  Record<Collection,ExportMap> = {
    [Collection.webpage]: {
        [ExportTarget.obsidian]:{
            template: '<>',
            targetDir: '/pagenote/webpage/',
        }
    },
    [Collection.light]: {
        [ExportTarget.obsidian]:{
            template: '<>',
            targetDir: '/pagenote/light/',
        }
    },
    [Collection.snapshot]: {
        [ExportTarget.obsidian]:{
            template: '<>',
            targetDir: '/pagenote/snapshot/',
        }
    },
    [Collection.html]: {
        [ExportTarget.obsidian]:{
            template: '<>',
            targetDir: '/pagenote/html/',
        }
    },
    [Collection.note]: {
        [ExportTarget.obsidian]:{
            template: '<>',
            targetDir: '/pagenote/memo/',
        }
    }
}