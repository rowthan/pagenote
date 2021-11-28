import { WebPage } from "../Types";
/**
* 数据转换方法，最基础的导出为其他文本格式
 * template: {{title}} {{url}}
 * webPage: {title:"网页title",url:"https://pagenote.cn"}
 * result: 网页title https://pagenote.cn
* */
declare const customExport: (template: string, webPage: WebPage) => string;
export default customExport;
