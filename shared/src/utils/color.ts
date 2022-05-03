const stringToColor = function(str:string,alpha=1):string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = '#';
    for (let i = 0; i < 3; i++) {
        const value = (hash >> (i * 8)) & 0xFF;
        color += ('00' + value.toString(16)).substr(-2);
    }
    return color;
}

/**
 * 传入一个颜色值，返回文本色、背景色
 * color: rgb(255,24,244) => {rgb:[],textColor}
 * */
function convertColor(color='rgb(244,244,244)'):{rgb:[number,number,number],textColor: string} {
    if(!color){
        return {
            rgb:[255,255,255],
            textColor: '#000000'
        };
    }
    let rgb: [number,number,number] = [0,0,0];
    let rate = 1;
    if(color.indexOf('rgb')>-1){
        // @ts-ignore
        rgb = color.match(/\((.*)\)/)[1].split(',');
        // @ts-ignore
        rgb = [parseInt(rgb[0]),parseInt(rgb[1]),parseInt(rgb[2])];
        // @ts-ignore
        if(rgb[3]!==undefined){
            // @ts-ignore
            rate = rgb[3];
        }
    }else{
        color = color.replace('#','');
        // @ts-ignore
        rgb = [color.substr(0,2),color.substr(2,2),color.substr(4,2),1]
        // @ts-ignore
        rgb = [parseInt(rgb[0],16),parseInt(rgb[1],16),parseInt(rgb[2],16)];
    }
    const r = rgb[0];
    const g = rgb[1];
    const b = rgb[2];
    const Y = (0.3*r + 0.59*g + 0.11*b)*Math.min(rate,1);
    return {
        rgb: rgb,
        textColor: Y >= 180 ? '#000000' : '#ffffff'
    };
}

/**
 * 格式化颜色未 Hex
 * */
/**
 * input: 255 ff  op
 * output: 255 255  throw Error
 * */
const getColorInt = function (input:string) {
    if (input === '') {
        return;
    }
    if (typeof input === "number") {
        if (isValidColorInt(input)) {
            return input;
        }
    }
    else { // 16进制
        const intValue = parseInt(input);
        let parsedNumber = null;
        if (isNaN(intValue)) {
            if (!isValidColorHexUnit(input)) {
                throw Error("not valid hex unit: " + input);
            }
            const number = parseInt(input, 16);
            if (isValidColorInt(number)) {
                parsedNumber = number;
            }
        }
        else if (isValidColorInt(intValue)) {
            parsedNumber = intValue;
        }
        if (parsedNumber === null) {
            throw Error("not a valid value in range [0-255] or [00-ff] " + input);
        }
        return parsedNumber;
    }
    throw Error("not valid color value [" + typeof input + "] " + input);
};
const isValidColorInt = function (value:number) {
    return value >= 0 && value <= 255 && value % 1 === 0;
};
const isValidColorHexUnit = function (value:string) {
    return /^[0-9a-fA-F]{2}$/.test(value);
};
/**
 * input: rgb(255,255,255) ,rgba(255,255,255,1) ffffff
 * output: #ffffff #ffffffff #ffffff
 * */
function formatToHex(anyColorString:string):string {
    if (anyColorString === void 0) { anyColorString = 'rgb(244,244,244)'; }
    function resolveRGBA(input:string) {
        const rgb = input.match(/\((.*)\)/)[1].split(',');
        const r = getColorInt(rgb[0]);
        const g = getColorInt(rgb[1]);
        const b = getColorInt(rgb[2]);
        const a = rgb[3];
        const hex = "#" + r.toString(16) + g.toString(16) + b.toString(16);
        let alpha = '';
        if (a !== undefined) {
            let alphaPercent = parseFloat(a);
            if (typeof alphaPercent === 'number' && alphaPercent >= 0) {
                alphaPercent = Math.min(alphaPercent, 1);
                alpha = (alphaPercent * 255).toString(16);
            }
        }
        return hex + alpha;
    }
    function resolveHex(input:string) {
        const hexString = input.replace('#', '');
        const r = hexString.substring(0, 2);
        const g = hexString.substring(2, 4);
        const b = hexString.substring(4, 6);
        const a = hexString.substring(6, 8);
        const r_number = getColorInt(r);
        const g_number = getColorInt(g);
        const b_number = getColorInt(b);
        if (!isValidColorInt(r_number) || !isValidColorInt(g_number) || !isValidColorInt(b_number)) {
            throw Error('not a valid hex string ' + input);
        }
        const a_number = a ? getColorInt(a) : 1;
        const hex = "#" + r + g + b;
        const alpha = a_number <= 1 ? a : '';
        return hex + alpha;
    }
    try {
        let result = '';
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

export {
    stringToColor,
    convertColor,
    formatToHex,
}
