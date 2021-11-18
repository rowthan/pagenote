declare enum AnnotationStatus {
    fixed = 1,
    un_fixed = 0
}
declare enum LightStatus {
    un_light = 0,
    half_light = 1,
    light = 2
}
interface Step {
    bg: string;
    id: string;
    isActive: string;
    offsetX: number;
    offsetY: number;
    parentW: number;
    x: number;
    y: number;
    time: string;
    pre: string;
    tip: string;
    suffix: string;
    text: string;
    annotationStatus: AnnotationStatus;
    lightStatus: LightStatus;
}
interface PlainData {
    version: string;
    url: string;
    title: string;
    createAt: number;
    description: string;
    icon: string;
    images: string[];
    categories: string[];
    lastModified: number;
    snapshots: string[];
    setting: any;
    steps: Step[];
}
interface WebPage {
    deleted: boolean;
    key: string;
    url: string;
    urls: string[];
    lastSyncTime: number;
    mtimeMs: number;
    createAt: number;
    updateAt: number;
    plainData: PlainData;
}
export type { PlainData, WebPage, };
