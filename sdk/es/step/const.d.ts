export interface StepProps {
    x: number;
    y: number;
    id: string;
    text?: string;
    pre?: string;
    suffix?: string;
    tip?: string;
    bg: string;
    isActive: boolean;
    offsetX?: boolean;
    offsetY?: boolean;
    parentW?: number;
    lightId?: string;
    level: number;
    images?: string[];
    lightStatus?: LightStatus;
    annotationStatus?: AnnotationStatus;
    lightBg?: string;
    daskBg?: string;
    isFocusTag?: boolean;
    [other: string]: any;
}
export declare enum LightStatus {
    UN_LIGHT = 0,
    HALF = 1,
    LIGHT = 2
}
export declare enum AnnotationStatus {
    HIDE = 0,
    SHOW = 1
}
export declare const STORE_KEYS_VERSION_2_VALIDATE: string[];
