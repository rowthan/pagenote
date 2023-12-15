import {getDefaultBrush} from "../../src/pagenote-brush";
import * as assert from "assert";


describe('brush get',function () {
    it('bg ff2ff2',function () {
        const brush = getDefaultBrush({
            bg: 'ff2ff2'
        })
        assert.equal(brush.bg,'#FF2FF2')
    })

    it('bg #ff2ff2',function () {
        const brush = getDefaultBrush({
            bg: '#ff2ff2'
        })
        assert.equal(brush.bg,'#FF2FF2')
    })

    it('bg rgb',function () {
        const brush = getDefaultBrush({
            bg: 'rgb(255,255,255)'
        })
        assert.equal(brush.bg,'#FFFFFF')
    })

    it('bg rgba',function () {
        const brush = getDefaultBrush({
            bg: 'rgba(255,255,254,0.5)'
        })
        assert.equal(brush.bg,'#FFFFFE')
    })
})
