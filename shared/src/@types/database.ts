export interface Find<Model> {
    query?: Query<Model>, // 搜索过滤条件
    sort?: Sort<Model>,
    limit: number, // 分页数
    skip?: number, // 游标 TODO 删除，使用
    next_cursor?: number | string,
    projection?: Projection<Model>, // 字段过滤
}

export interface FindResponse<T> {
    total: number
    list: T[]
    page?: number
    limit?: number
    has_more?: boolean
    next_cursor?: number | string
}

export type Projection<Model> = Partial<Record<keyof Model, 1|-1>> & {[key:string]:1|-1}

export type Sort<Model> = Partial<Record<keyof Model, 1|-1>>

export type Query<Model> = Partial<Record<keyof Model, any>>

export interface Pagination {
    total: number,
    limit: number,
    pages: number
}
