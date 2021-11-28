import {WebPage} from "../Types";

enum BackupVersion {
    version1=1,
    version=2
}

interface BackupData {
    pages: WebPage[],
    version: BackupVersion,
    extension_version: string,
    backup_at: number,
}

// 将webpage数据导出为字符串文本
const makeExportString = function (backupData:BackupData):string{
    const exportDataObject = {
        pages: backupData.pages,
        version: backupData.version || 2,
        extension_version: backupData.version,
        backup_at: backupData.backup_at || new Date().getTime(),
    }
    const dataString = encodeURIComponent(JSON.stringify(exportDataObject));
    return dataString;
}

// 还原备份数据
const resolveImportString = function (inputStr: string):BackupData {
    let datas
    try{
        datas = JSON.parse(decodeURIComponent(inputStr));
    }catch (e) {
        console.error(e);
        alert('解析错误，请检查备份文件是否有损坏');
    }
    return datas;
}

export {
    BackupData,
    BackupVersion,
    makeExportString,
    resolveImportString,
}