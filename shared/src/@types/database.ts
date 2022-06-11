export interface Find<Model> {
    query?: Query<Model>, // 搜索过滤条件
    sort?: Sort<Model>,
    limit: number, // 分页数
    skip?: number, // 游标
    projection?: Projection<Model>, // 字段过滤
    ignoreDetail?: boolean // 是否忽略详情，一般用于 list 列表时候，不需要查看详情
}

export type Projection<Model> = Partial<Record<keyof Model, 1|0>> & {[key:string]:1|0}

export type Sort<Model> = Partial<Record<keyof Model, 1|-1>>

export type Query<Model> = Partial<Record<keyof Model, any>>

export interface Pagination {
    total: number,
    limit: number,
    pages: number
}
