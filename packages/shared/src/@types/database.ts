export type Find<Model> = {
    query?: Query<Model>, // 搜索过滤条件
    sort?: Sort<Model>,
    projection?: Projection<Model>, // 字段过滤
} & Pagination

export type Pagination = {
    /**分页*/
    limit?: number, // 本次查询限额数量
    skip?: number,

    // @deprecated 使用 skip
    page?: number, // 当前页码
    // @deprecated 使用 skip
    pageSize?: number, // 一页数量
    // @deprecated 使用 skip
    totalPages?: number // 总页数

    /**按游标，暂无使用场景*/
    // cursor?: string | undefined
    // next_cursor?: string | undefined,
}

export type FindResponse<T> = {
    list: T[]
} & Required<{
    has_more: boolean
    total?: number,
}>

export type Projection<Model> = {
    [key in keyof Model]?: 1
}

export type Sort<Model> = {
    [key in keyof Model]?: 1 | -1
}

// TODO 使用mongoose query 替换
export type MongoLikeQueryValue = {
    $like?: string; // 模糊搜索

    $regex?: string,
    $options?: string

    $exists?: boolean; // 是否存在


    $in?: string[]; // 数组
    $nin?: string[];
    $gt?: number; // 大于
    $lt?: number; // 小于
    $ne?: any, // 不等于
}

export type BasicQueryValue = string | number | boolean

export type QueryValue = BasicQueryValue | MongoLikeQueryValue;

export type Query<Model> = {
    [key in keyof Model]?: QueryValue;
} | {
    $or: {
        [key in keyof Model]?: QueryValue | Query<Model>
    }[];
} | {
    $and: {
        [key in keyof Model]?: QueryValue | Query<Model>
    }[];
}


