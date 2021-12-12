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
export { stringToColor, convertColor, };
//# sourceMappingURL=color.js.map