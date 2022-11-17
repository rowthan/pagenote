export type Find<Model> = {
    query?: Query<Model>, // 搜索过滤条件
    sort?: Sort<Model>,
    limit: number, // 分页数
    skip?: number, // 游标 TODO 删除，使用
    next_cursor?: number | string,
    projection?: Projection<Model>, // 字段过滤
}

export type FindResponse<T> = {
    total: number
    list: T[]
    page?: number
    limit?: number
    has_more?: boolean
    next_cursor?: number | string | null
}

export type Projection<Model> = {
    [key in keyof Model]?: 1 | -1
}

export type Sort<Model> = {
    [key in keyof Model]?: 1 | -1
}

export type MongoLikeQueryValue = {
    $like?: string; // 模糊搜索
    $in?: string[]; // 数组
    $gt?: number; // 大于
    $lt?: number; // 小于
}

export type BasicQueryValue = string | number | boolean

export type QueryValue = BasicQueryValue | MongoLikeQueryValue;

export type Query<Model> = {
    [key in keyof Model]?: QueryValue;
} | {
    $or: {
        [key in keyof Model]?: QueryValue
    }[];
} | {
    $and: {
        [key in keyof Model]?: QueryValue
    }[];
}

export interface Pagination {
    total: number,
    limit: number,
    pages: number
}
