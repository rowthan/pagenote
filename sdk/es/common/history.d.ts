declare enum URLchangeTypes {
    history = "history",
    hash = "hash",
    document = "document"
}
declare type ListenType = URLchangeTypes;
declare type Options = {
    listenTypes: ListenType[];
};
/**
 * 监听页面 URL 发生变更
 * 涉及场景：1、通过hash发生了变更，2、通过 history 发生变更；3、兜底通过click来比对是否变化
 * */
export default function addUrlChangeListener(fun: Function, options?: Options): void;
export {};
