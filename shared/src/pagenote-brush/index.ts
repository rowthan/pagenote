

export enum LightStatus {
    un_light=0,
    half_light=1,
    full_light=2
}

export enum LightType {
    highlight='light',
    deleteLine='del',
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

export function getDefaultBrush(brush: Partial<Brush>):Brush {
    return{
        bg: brush.bg || '#FFDE5D',
        shortcut: brush.shortcut || '',
        label: brush.label || '标记',
        level: brush.level || 1,
        color: brush.color || '',
        lightType: brush.lightType || LightType.highlight,
        defaultStatus: brush.defaultStatus || LightStatus.full_light
    }
}
