import markdownConvert from "../src/util";


describe('object to string',()=>{
    const object = {
        string: 'string type',
        number: 1,
        boolean: true,
        array: [1,2,3,4],
        arrayString:  ['姓名','年龄'],
        dataString: '2023-11-12 12:02:01',
        dataNumber: 1703423813057,
        dataNumberString: '1703423813057',
        date: new Date('2022-11-23')
    }

    test('check all types',()=>{
        const result = markdownConvert.objectToMarkdown(object)
        const expectContent = `---
string: string type
number: 1
boolean: true
array:
- 1
- 2
- 3
- 4
arrayString:
- 姓名
- 年龄
dataString: 2023-11-12 12:02:01
dataNumber: 2023-11-12 20:02:01
dataNumberString: 2023-11-12 12:02:01
date: 2022-11-23 00:00:00
---
`
        expect(result).toBe(expectContent)
    })
})
