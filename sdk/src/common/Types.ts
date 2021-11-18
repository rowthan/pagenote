enum AnnotationStatus {
    fixed=1,
    un_fixed=0,
}

enum LightStatus {
    un_light=0,
    half_light=1,
    light=2,
}

interface Step {
    bg: string,
    id: string,
    isActive: string,
    offsetX: number,
    offsetY: number,
    parentW: number,
    x: number,
    y: number,
    time: string,
    pre: string,
    tip: string,
    suffix: string,
    text: string,
    annotationStatus: AnnotationStatus,
    lightStatus: LightStatus
}

interface PlainData {
    version: string,
    url: string,
    title: string,
    createAt: number,
    description: string,
    icon: string,
    images: string[],
    categories: string[],
    lastModified: number,
    snapshots: string[],
    setting: any,
    steps: Step[],
}

interface WebPage {
    deleted: boolean,
    key: string, // 此数据的唯一标识符，一般为 URL，但也可能是hash值
    url: string, // 此条数据绑定的 URL
    urls: string[], // 此条数据绑定的 URL 集合
    lastSyncTime: number, // 云盘最后同步时间
    mtimeMs: number, // 文件夹最后同步时间
    createAt: number,
    updateAt: number,
    plainData: PlainData,
}

export type {
    PlainData,
    WebPage,
}
