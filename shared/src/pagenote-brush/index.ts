

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
}