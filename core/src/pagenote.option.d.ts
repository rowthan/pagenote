// 侧边栏状态
declare enum BAR_STATUS{
    fold, // 折叠
    expand, // 展开
}

// 画笔配置
interface Brush {
    // 画笔快捷键
    shortcut?: string,
    // 画笔背景色
    bg: '',
    // 画笔层级 ，暂不支持
    level: number,
}

// pagenote 支持的配置项
export class OptionsProps{
    // 监听数据变化
    addListener?: Function;
    // true: 将数据存储至localstorage中，刷新页面后笔记仍然存在。false: 不存储数据于用户本地，刷新后数据丢失。
    saveInLocal?: boolean; // true；
    // 最大标记数
    maxMarkNumber?: number; // 30
    // 控制侧边栏位置
    barInfo?: {right:number,top:number,status:BAR_STATUS}; // {right:0,top:0,status:0}
    // 画笔配置
    brushes: Brush[];
    // 侧边栏按钮控制
    sideBarActions: string[];
    // 延迟功能控制，选中文本长按鼠标 xx 毫秒后，功能按钮出现
    showBarTimeout?: number; // 0
    // 快捷键延迟功能控制，长按键盘 xx 毫秒后，触发画笔快捷键
    keyupTimeout?: number; // 0
    // 是否启用标记图片，功能测试中，暂不推荐使用。
    enableMarkImg?: boolean; // false
    // 禁止选中标记的元素列表，ID 为 whats-element 支持的类型，如 ['body','.block','#no-pagenote']
    blacklist: string[]; // []
    // 是否自动点亮、熄灭，即滚动至笔记处，自动点亮，离开时自动熄灭。
    autoLight?: boolean; // false

    /**以下配置不推荐使用，未来可能废弃**/
    categories: string[]; // 初始化待选择标签
    saveInURL?: boolean; // 是否将数据存储至 URL 中 如 https://baidu.com?pagenote_data=xxxxx 。将废弃
    initType?: string; // 将废弃，
    dura?: number; // 将废弃
    actionBarOffset?: {offsetX:number,offsetY:number}; // 划词操作面板偏移量，用于防止与其他插件重叠遮挡。 暂不支持
    showIconAnimation?: boolean; // false, 启动icon动画
    onShare?: object; // 已废弃
}