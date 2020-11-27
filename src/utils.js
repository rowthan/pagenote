// http://bai.com?a=1&b=2  output [a,b],{a:1,b:1}
function getParams(url) {
    const urlSearch = url || window.location.href;
    const paramStr = (urlSearch.match(/\?(.*)/)||[])[1];
    const paramObj = {};
    const paramKeys = [];
    if (!paramStr) {
        return {
            paramObj,
            paramKeys
        };
    }
    paramStr.split('&').forEach((item) => {
        const tempArr = item.split('=');
        if(tempArr[0]){
            paramKeys.push(tempArr[0]);
            paramObj[tempArr[0]] = tempArr[1];
        }
    });
    return {
        paramObj,
        paramKeys
    };
}

// TODO 优化精简字符串长度
function encryptData(string) {
    return btoa(encodeURI(JSON.stringify(string)))
}

function decryptedData(data) {
    let result = {};
    try {
        result = JSON.parse(decodeURI(atob(data)));
    }catch (e) {

    }
    return result;
}

function throttle(fn, interval = 300) {
    let canRun = true;
    return function () {
        if (!canRun) return;
        canRun = false;
        setTimeout(() => {
            fn.apply(this, arguments);
            canRun = true;
        }, interval);
    };
}

function debounce(fn, interval = 300) {
    let timeout = null;
    return function () {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            fn.apply(this, arguments);
        }, interval);
    };
}

// rgba(12,323,456) #123222
function convertColor(color='') {
    if(!color){
        return '#000000';
    }
    let rgb = [];
    let rate = 1;
    if(color.indexOf('rgb')>-1){
        rgb = color.match(/\((.*)\)/)[1].split(',');
        rgb = [parseInt(rgb[0]),parseInt(rgb[1]),parseInt(rgb[2])];
        if(rgb[3]!==undefined){
            rate = rgb[3];
        }
    }else{
        color = color.replace('#','');
        rgb = [color.substr(0,2),color.substr(2,2),color.substr(4,2),1]
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

const isMobile = ('ontouchstart' in window) || window.innerWidth<600;

function computePosition(index,radio=25) {
    const p = 45//360/(colors.length-1);
    const hudu = -(2 * Math.PI / 360) * p * index;
    const x =  Number.parseFloat(radio * Math.sin(hudu)).toFixed(3);
    const y = Number.parseFloat(radio * Math.cos(hudu)).toFixed(3);
    return {
        x:-x,
        y:-y,
    }
}

export {
    getParams,
    encryptData,
    decryptedData,
    throttle,
    debounce,
    convertColor,
    computePosition,
    isMobile,
}
