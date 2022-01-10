import {formatToHex} from "../../../src/common/utils/color";

const assert = require('assert');
describe('Color', function() {
    describe('#formatToHex()', function() {
        it('格式化为hex进制色值', function() {
            assert.equal(formatToHex('rgb(255,255,255,0.6)'),'#FFFFFF99');
            assert.equal(formatToHex('rgba(167,255,234,255)'),'#A7FFEAFF');
            assert.equal(formatToHex('rgb(247,206,122)'),'#F7CE7A');
            assert.equal(formatToHex('#8f4d4d'),'#8F4D4D');
            assert.equal(formatToHex('9affe9'),'#9AFFE9');
        });
        it('超出范围的色值处理', function() {
            assert.equal(formatToHex('rgb(255,255,285,0.6)'),'');
            assert.equal(formatToHex('rgba(167,255,365,255)'),'');
            assert.equal(formatToHex('#9xzee9'),'');
        });
    });
});
