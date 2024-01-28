import format from "../../src/actions/format";

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
const markdownContent = `---
## title
* list1
* list2
-[ ] todo 1  
---
`
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

describe('markdown2property',()=>{
    test('markdown to object', ()=>{
        const result = format({
            data: expectContent,
            method: 'markdown2property'
        })
        expect(result).toStrictEqual(object)
    })

    test('markdown with note and property to object', ()=>{
        const result = format({
            data: expectContent+markdownContent,
            method: 'markdown2property'
        })
        expect(result).toStrictEqual({
            ...object,
            __content: markdownContent
        })
    })

    test('string type like number',()=>{
        const result = format({
            method: 'markdown2property',
            data: `
---
string: 2023 
---
`
        })
        expect(result).toEqual({
            string: '2023'
        })
    })

    test('string type like date',()=>{
        const result = format({
            data: `
---
string: 2023-12-24 21:16:53 
---
        `,
            method: "markdown2property"
        })
        expect(result).toEqual({
            string: '2023-12-24 21:16:53'
        })
    })


    const inputString = `---
title: 
createAt: 1706353089444
updateAt: 1706412990676
key: 7d30bc56d48d4c47fc2c733967289e9d
relatedType: path
path: http://localhost:3000/ext/actions/data-flow
domain: localhost:3000
url: http://localhost:3000/ext/actions/data-flow
plainType: html
---
`
    const leftString = `
## hoa
* 1
`
    test('get content',()=>{
        const result = format({
            method:"markdown2property",
            data: inputString + leftString
        })
        expect(result.__content).toEqual(leftString)
    })

    test('get content without property',()=>{
        const result = format({
            method:"markdown2property",
            data: leftString
        })
        expect(result.__content).toEqual(leftString)
    })
})

describe('data2markdown',()=>{
    test('object to markdown',()=>{
        const result = format({
            data: object,
            method: 'property2markdown'
        })
        expect(result).toBe(expectContent)
    })
})

describe('markdown2html',()=>{
    test('markdown to html',()=>{
        const result = format({
            data: `## h2 标题`,
            method: 'markdown2html'
        }).trim()
        const expectString = `<h2>h2 标题</h2>`;
        expect(result).toBe(expectString)
    })
})
