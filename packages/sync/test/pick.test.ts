import pkData from "../src/utils/pick";

const dataList = [
    {
        createAt: 1,
        updateAt: 2,
        ctime: 3,
        atime: 1,
        same1: 1,
        same2: 2
    },
    {
        createAt: 1,
        updateAt: 3,
        ctime: 2,
        same1: 1,
        btime: 2,
    }
]

describe('pick', () => {
    it('should pick  by updateAt', () => {
        const [data, index] = pkData(dataList[0], dataList[1], ['same1','createAt','updateAt']);
        expect(data).toEqual(dataList[1]);
        expect(index).toEqual(1);
    });

    it('should pick by ctime', () => {
        const [data, index] = pkData(dataList[0], dataList[1], ['ctime']);
        expect(data).toEqual(dataList[0]);
        expect(index).toEqual(0);
    });

    it('should pick by atime', () => {
        const testList = [dataList[0], dataList[1]]
        const [data, index] = pkData(testList[0], testList[1], ['atime']);
        expect(data).toEqual(testList[0]);
        expect(index).toEqual(0);
    });

    it('should pick by atime when first data is undefined', () => {
        const testList = [dataList[1], dataList[0]]
        const [data, index] = pkData(testList[0],testList[1], ['atime','ctime']);
        expect(index).toEqual(1);
        expect(data).toEqual(testList[1]);
    });



    it('should pick by default when equal', () => {
        const [data, index] = pkData(dataList[0], dataList[1], ['createAt']);
        expect(data).toEqual(dataList[0]);
        expect(index).toEqual(-1);
    });



})
