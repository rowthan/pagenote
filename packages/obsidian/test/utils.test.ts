import {markdownConvert} from "../src/index";


describe('object & string',()=>{
    const object = {
        string: 'string type',
        number: 1,
        boolean: true,
        array: [1,2,3,4,'5'],
        likeString: '2023',
        numberString: 2023,
        arrayString:  ['姓名','年龄'],
        dataNumber: 1703423813057,
        dataNumberString: '1703423813057',
        dataString: '2023-11-12 12:02:01',
        date: new Date('2023-12-24 21:16:53'),
        date2: new Date('2022-11-23 08:00:00')
    }

    const expectContent = `---
string: string type
number: 1
boolean: true
array:
- 1
- 2
- 3
- 4
- 5 
likeString: 2023 
numberString: 2023
arrayString:
- 姓名
- 年龄
dataNumber: 1703423813057
dataNumberString: 1703423813057 
dataString: 2023-11-12 12:02:01 
date: 2023-12-24 21:16:53
date2: 2022-11-23 08:00:00
---
`

    test('object to markdown',()=>{
        const result = markdownConvert.objectToMarkdown(object)
        expect(result).toBe(expectContent)
    })

    test('markdown to object', ()=>{
        const result = markdownConvert.markdownToObject(expectContent)
        expect(result).toStrictEqual(object)
    })

    test('string type like number',()=>{
        const result = markdownConvert.markdownToObject(`
---
string: 2023 
---
`)
        expect(result).toEqual({
            string: '2023'
        })
    })

    test('string type like date',()=>{
        const result = markdownConvert.markdownToObject(`
        ---
        string: 2023-12-24 21:16:53 
        ---
        `)
        expect(result).toEqual({
            string: '2023-12-24 21:16:53'
        })
    })
})

