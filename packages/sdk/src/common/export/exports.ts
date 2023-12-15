import {writeTextToClipboard} from "../../utils/document";
// TODO ,提出单独包，避免 pagenote sdk 引入不必要依赖
import axios, {AxiosRequestConfig} from 'axios';
/**
 * 将数据导出为其他载体形式，如导出为文件、发出 http 请求
*/

const ACTION_NUM = {
    COPY:'COPY',
    DOWNLOAD: 'DOWNLOAD',
    HTTP: 'HTTP',
}

const actions = {
    [ACTION_NUM.COPY]:function (inputString:string) {
        return writeTextToClipboard(inputString);
    },
    [ACTION_NUM.DOWNLOAD]: function (inputString:string,filename:string):void {
        const eleLink = document.createElement('a');
        eleLink.download = filename;
        eleLink.style.display = 'none';
        // 字符内容转变成blob地址
        const blob = new Blob([inputString]);
        eleLink.href = URL.createObjectURL(blob);
        // 触发点击
        document.body.appendChild(eleLink);
        eleLink.click();
        // 然后移除
        document.body.removeChild(eleLink);
    },
    [ACTION_NUM.HTTP]: function(config: AxiosRequestConfig){
        return axios(config)
    }
}

export {
    ACTION_NUM,
}

export default actions