import {customMapCode} from "../../src/utils/code";
import * as assert from "assert";


describe('customMapCode',()=>{
    it('超短字符',()=>{
        const code = customMapCode('ab',3,'1234567890','-');
        console.log(code,'ab')
        assert.equal(code.length,3)
    })

    it('非倍数字符',()=>{
        const code = customMapCode('abcd',3,'1234567890','-');
        assert.equal(code.length,3)
        console.log(code,'abcd')
    })

    it('非倍数字符2',()=>{
        const code = customMapCode('abcde',3,'1234567890','-');
        assert.equal(code.length,3)
        console.log(code,'abcde')
    })

    it('倍数字符',()=>{
        const code = customMapCode('abcdef',3,'1234567890','-');
        assert.equal(code.length,3)
        console.log(code,'abcdef')
    })

    it('map 结果校验',()=>{
        const input = 'abcdef' // 97 98 99 100 101 102
        const code = customMapCode(input,3,'0123456789','-');
        assert.equal(code,'593')
    })

    it('特殊字符map',()=>{
        const input = 'abcdef@qq.com~🏷😄🌛'
        const code = customMapCode(input,10,'123456789','0');
        assert.equal(code,'7267742398')
    })

    it('邮箱map 生成UID',()=>{
        const input = 'pagenote@126.com'
        const code = customMapCode(input,8,'123456789','0');
        assert.equal(code,'37626625')
    })

    it('固定长度',()=>{
        const input = 'abcdefghij@163.com'
        for(let i=1; i<50; i++){
            const code = customMapCode(input,i)
            console.log(i,code)
            assert.equal(code.length,i)
        }
    })
})
