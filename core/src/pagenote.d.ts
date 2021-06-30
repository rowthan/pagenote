import {Step, StepProps} from "./pagenote-step";
import { OptionsProps } from './pagenote.option'


export interface Pagenote {
    // 配置参数
    options: OptionsProps;

    /**API**/
    // 创建一个标记
    record(info:StepProps): Step;
    // 删除第n个标记
    remove(index:number): boolean;
    // 播放标记，index: 第n个标记，goto: 移动滚动至标记处；autoNext: 自动播放下一个标记； isActive: 是否点亮
    replay(index:number,goto:boolean,autoNext:boolean,isActive:boolean): void;
    // 保存数据
    makelink(callback: Function): void;
    // toast 提醒
    notification(message: string,type: string,duration:number,position:{x:string,y:string}): void;
    // 网页截图
    capture(target: HTMLElement): void;
    // 导出数据为其他格式
    exportData(template: string, data: any): string;

    /**将废弃的 API **/
    openModal(): void;
    _syncModal(): void;
    // 导出数据为 Markdown ，将废弃，替代 API：exportData
    generateMD(): void;
    // 加密数据
    decodeData(): string;
    // 解密数据
    encryptData(): string;
    // 手动触发监听函数
    triggerListener(): void;
}
