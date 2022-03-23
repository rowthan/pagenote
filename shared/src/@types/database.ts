export interface Find {
    query?: Query, // 搜索过滤条件
    sort?: { // 排序
        [key:string]: 1|-1
    },
    limit: number, // 分页数
    skip?: number, // 游标
    projection?: {[key:string]: 1|0}, // 字段过滤
    ignoreDetail?: boolean // 是否忽略详情，一般用于 list 列表时候，不需要查看详情
}

export interface Query {
    [key:string]:any
}

export type Pagination ={
    total: number,
    limit: number,
    pages: number
}
