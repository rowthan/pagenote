export type Find<Model> = {
    query?: Query<Model>, // 搜索过滤条件
    sort?: Sort<Model>,
    projection?: Projection<Model>, // 字段过滤
} & Pagination

export type Pagination = {
    /**余量标识*/
    has_more?: boolean

    /**总条目数量*/
    total?: number,

    /**按分页*/
    limit?: number | undefined, // 一页数量
    page?: number | undefined, // 当前页面

    /**按游标*/
    cursor?: string | undefined
    next_cursor?: string | undefined,
}

export type FindResponse<T> = {
    list: T[]
} & Required<Pagination>

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


