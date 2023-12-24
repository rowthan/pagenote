import {colord} from "colord";

export enum LightStatus {
    un_light=0,
    half_light=1,
    full_light=2
}

export enum LightType {
    highlight='light', // 背景涂色
    deleteLine='del', // 删除线
    bold='bold', // 加粗
}

export interface Brush {
    bg: string,
    shortcut: string,
    label: string,
    level: number,
    color: string,
    lightType: LightType,
    defaultStatus: LightStatus
    score?: number // 权重分数，1-10
}

export function getDefaultBrush(brush: Partial<Brush>={}):Brush {
    let bg = brush.bg || '#ffe534';
    let color = brush.color;
    try{
        if(bg.length <=6 && bg[0]!=='#'){
            bg = '#' + bg;
        }
        const colorObj = colord(bg)
        bg = colorObj.toHex();
        color = color || (colorObj.isDark() ? '#FFFFFF' : '#000000');
    }catch (e) {
        console.error(e)
    }

    return{
        bg: bg,
        shortcut: brush.shortcut || '',
        label: brush.label || '标记',
        level: brush.level || 1,
        // @ts-ignore todo
        color: color,
        lightType: brush.lightType || LightType.highlight,
        defaultStatus: brush.defaultStatus || LightStatus.full_light
    }
}
