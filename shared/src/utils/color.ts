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

export {
    stringToColor,
    convertColor,
}