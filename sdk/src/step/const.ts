export interface StepProps {
    x: number, // 标记在文档中基于 body 的 x轴 位置
    y: number, // 标记在文档中基于 body 的 y轴 位置
    id: string, // 标记的元素节点，在文档中唯一标识符，取值参考 whats-element
    text?: string, // 标记的文本内容
    pre? : string, // 标记的文本内容 上文信息
    suffix?: string, // 标记的文本内容 下文信息
    tip?: string, // 标记的笔记（用户输入）
    bg: string, // 标记背景色
    isActive: boolean, // 是否为激活状态
    offsetX?: boolean, // 批注与高亮元素的相对偏移量
    offsetY?: boolean, // 批注与高亮元素的相对偏移量
    parentW?: number, // 高亮元素父节点宽度
    lightId?: string, // 每一条标记的唯一 hash id
    level: number, // 高亮层级
    images?: string[], // 图片高亮，待支持
    lightStatus? : LightStatus,
    annotationStatus? : AnnotationStatus,
    lightBg?: string, // 将废弃
    daskBg?: string, // 将废弃
    isFocusTag?: boolean,
    [other: string]: any,
}

export enum LightStatus{
    UN_LIGHT=0,
    HALF=1,
    LIGHT=2,
}

export enum AnnotationStatus {
    HIDE=0,
    SHOW=1,
}

export const STORE_KEYS_VERSION_2_VALIDATE = ["x","y","id","text","tip","bg","time","isActive","offsetX","offsetY","parentW","pre","suffix","images","level","lightStatus","annotationStatus"]