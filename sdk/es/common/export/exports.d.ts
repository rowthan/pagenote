/**
 * 将数据导出为其他载体形式，如导出为文件、发出 http 请求
*/
declare const ACTION_NUM: {
    COPY: string;
    DOWNLOAD: string;
    HTTP: string;
};
declare const actions: {
    [x: string]: (inputString: string, filename: string) => void;
};
export { ACTION_NUM, };
export default actions;
