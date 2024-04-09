import run from '../../src/actions/lib'

describe('lib dayjs test', () => {
    test('lib dayjs test', () => {
        const date = '2023-01-01 12:12:12';
        const format = 'YYYY-MM-DD HH:mm:ss'
        const dayjsData = run({
            lib: 'dayjs',
            method: '',
            arguments: [new Date(date)]
        })
        const timeString = run({
            lib: dayjsData,
            method: 'format',
            arguments: [format]
        })

        expect(timeString).toBe(date)
    })
})


describe('lib lodash test', () => {
    test('get array keys', () => {
        const array = [{
            key: 1,
        },{
            key: 2
        },{
            key: '3'
        }]

        expect(run({
            lib: 'lodash',
            method: 'map',
            arguments: [array,'key']
        })).toEqual([1, 2,'3'])
    })
})

describe('test call input object', () => {
    test('call global Date.now', () => {
        const date = Date.now();
        expect(run({
            lib: 'Date',
            method: 'now',
            arguments: []
        })).toEqual(date)
    })

    test('call input object fun',()=>{
        const EXPECT_DATE = '123'
        expect(run({
            lib: {
                testFun: ()=>{
                    return EXPECT_DATE
                }
            },
            method: 'testFun',
            arguments: []
        })).toEqual(EXPECT_DATE)
    })
})
