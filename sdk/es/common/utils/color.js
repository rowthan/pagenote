var stringToColor = function (str, alpha) {
    if (alpha === void 0) { alpha = 1; }
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    var color = '#';
    for (var i = 0; i < 3; i++) {
        var value = (hash >> (i * 8)) & 0xFF;
        color += ('00' + value.toString(16)).substr(-2);
    }
    return color;
};
/**
 * 传入一个颜色值，返回文本色、背景色
 * color: rgb(255,24,244) => {rgb:[],textColor}
 * */
function convertColor(color) {
    if (color === void 0) { color = 'rgb(244,244,244)'; }
    if (!color) {
        return {
            rgb: [255, 255, 255],
            textColor: '#000000'
        };
    }
    var rgb = [0, 0, 0];
    var rate = 1;
    if (color.indexOf('rgb') > -1) {
        // @ts-ignore
        rgb = color.match(/\((.*)\)/)[1].split(',');
        // @ts-ignore
        rgb = [parseInt(rgb[0]), parseInt(rgb[1]), parseInt(rgb[2])];
        // @ts-ignore
        if (rgb[3] !== undefined) {
            // @ts-ignore
            rate = rgb[3];
        }
    }
    else {
        color = color.replace('#', '');
        // @ts-ignore
        rgb = [color.substr(0, 2), color.substr(2, 2), color.substr(4, 2), 1];
        // @ts-ignore
        rgb = [parseInt(rgb[0], 16), parseInt(rgb[1], 16), parseInt(rgb[2], 16)];
    }
    var r = rgb[0];
    var g = rgb[1];
    var b = rgb[2];
    var Y = (0.3 * r + 0.59 * g + 0.11 * b) * Math.min(rate, 1);
    return {
        rgb: rgb,
        textColor: Y >= 180 ? '#000000' : '#ffffff'
    };
}
/**
 * input: 255 ff  op
 * output: 255 255  throw Error
 * */
var getColorInt = function (input) {
    if (input === '') {
        return;
    }
    if (typeof input === "number") {
        if (isValidColorInt(input)) {
            return input;
        }
    }
    else { // 16进制
        var intValue = parseInt(input);
        var parsedNumber = null;
        if (isNaN(intValue)) {
            if (!isValidColorHexUnit(input)) {
                throw Error("not valid hex unit: ".concat(input));
            }
            var number = parseInt(input, 16);
            if (isValidColorInt(number)) {
                parsedNumber = number;
            }
        }
        else if (isValidColorInt(intValue)) {
            parsedNumber = intValue;
        }
        if (parsedNumber === null) {
            throw Error("not a valid value in range [0-255] or [00-ff] ".concat(input));
        }
        return parsedNumber;
    }
    throw Error("not valid color value [".concat(typeof input, "] ").concat(input));
};
var isValidColorInt = function (value) {
    return value >= 0 && value <= 255 && value % 1 === 0;
};
var isValidColorHexUnit = function (value) {
    return /^[0-9a-fA-F]{2}$/.test(value);
};
/**
 * input: rgb(255,255,255) ,rgba(255,255,255,1) ffffff
 * output: #ffffff #ffffffff #ffffff
 * */
function formatToHex(anyColorString) {
    if (anyColorString === void 0) { anyColorString = 'rgb(244,244,244)'; }
    function resolveRGBA(input) {
        var rgb = input.match(/\((.*)\)/)[1].split(',');
        var r = getColorInt(rgb[0]);
        var g = getColorInt(rgb[1]);
        var b = getColorInt(rgb[2]);
        var a = rgb[3];
        var hex = "#".concat(r.toString(16)).concat(g.toString(16)).concat(b.toString(16));
        var alpha = '';
        if (a !== undefined) {
            var alphaPercent = parseFloat(a);
            if (typeof alphaPercent === 'number' && alphaPercent >= 0) {
                alphaPercent = Math.min(alphaPercent, 1);
                alpha = (alphaPercent * 255).toString(16);
            }
        }
        return hex + alpha;
    }
    function resolveHex(input) {
        var hexString = input.replace('#', '');
        var r = hexString.substring(0, 2);
        var g = hexString.substring(2, 4);
        var b = hexString.substring(4, 6);
        var a = hexString.substring(6, 8);
        var r_number = getColorInt(r);
        var g_number = getColorInt(g);
        var b_number = getColorInt(b);
        if (!isValidColorInt(r_number) || !isValidColorInt(g_number) || !isValidColorInt(b_number)) {
            throw Error('not a valid hex string ' + input);
        }
        var a_number = a ? getColorInt(a) : 1;
        var hex = "#".concat(r).concat(g).concat(b);
        var alpha = a_number <= 1 ? a : '';
        return hex + alpha;
    }
    try {
        var result = '';
        if (anyColorString.includes('rgb')) {
            result = resolveRGBA(anyColorString);
        }
        else {
            result = resolveHex(anyColorString);
        }
        return result.toUpperCase();
    }
    catch (e) {
        return '';
    }
}
export { stringToColor, convertColor, formatToHex, };
//# sourceMappingURL=color.js.map