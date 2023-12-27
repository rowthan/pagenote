/**
 * 数据 a, b 比较获得最新数据
 * */
export default function pkData<T>(data1asDefault: T, data2: T, compareKeys: Array<keyof T>): [T, number] {
    for (let i = 0; i < compareKeys.length; i++) {
        const compareKey = compareKeys[i];
        /**
         * 值相同时，继续下一个字段的比较
         * */
        if (data1asDefault[compareKey] === data2[compareKey]) {
            return pkData(data1asDefault, data2, compareKeys.slice(i + 1));
        } else {
            const value1 = data1asDefault[compareKey] || 0;
            const value2 = data2[compareKey] || 0;
            /**
             * 明确当 value2 大于 value1 时， data2 胜出，否则 data1 胜出
             * */
            if (value2 > value1) {
                return [data2, 1];
            } else {
                return [data1asDefault, 0];
            }
        }
    }

    /**
     * 无法通过 pick 字段决胜的情况下，使用第一个作为胜出项
     * */
    return [data1asDefault, -1];
}
