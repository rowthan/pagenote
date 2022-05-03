export interface Find<Index> {
    query?: Query<Index>, // 搜索过滤条件
    sort?: Record<keyof Index, 1|-1>,
    limit: number, // 分页数
    skip?: number, // 游标
    projection?: Projection<Index>, // 字段过滤
    ignoreDetail?: boolean // 是否忽略详情，一般用于 list 列表时候，不需要查看详情
}

export type Projection<Index> = Partial<Record<keyof Index, 1|0>> & {[key:string]:1|0}

export type Query<Index> = Partial<Record<keyof Index | '_keywords', any>>

export type Pagination ={
    total: number,
    limit: number,
    pages: number
}
