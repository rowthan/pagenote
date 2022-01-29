import {WebPage} from "../../../../shared/src/@types/Types";
import mustache from 'mustache';

/**
* 数据转换方法，最基础的导出为其他文本格式
 * template: {{title}} {{url}}
 * webPage: {title:"网页title",url:"https://pagenote.cn"}
 * result: 网页title https://pagenote.cn
* */
const customExport = function (template:string,webPage: WebPage):string {
    return mustache.render(template,{
        webPage
    })
}

export default customExport;
