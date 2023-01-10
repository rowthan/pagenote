// 将webpage数据导出为字符串文本
import {BackupData, BackupVersion} from "../@types/data";

const makeExportString = function (backupData:BackupData):string{
    // version4 不做encode处理，避免增加文件体积
    if(backupData.version === BackupVersion.version4 || backupData.version > BackupVersion.version4){
        return JSON.stringify(backupData)
    }

    // 低版本处理方式
    const dataString = encodeURIComponent(JSON.stringify(backupData));
    return dataString;
}

// 还原备份数据
const resolveImportString = function (inputStr: string):BackupData {
    let data
    try{
        data = JSON.parse(inputStr);
        return data
    }catch (e) {
        console.warn('低版本数据，二次解码处理中。不推荐使用，请使用最新版本导出数据')
    }

    try{
        data = JSON.parse(decodeURIComponent(inputStr));
    }catch (e) {
        console.error(e);
        throw '数据可能已经损坏或不兼容，请联系开发者处理'
    }
    return data;
}

export {
    makeExportString,
    resolveImportString,
}
