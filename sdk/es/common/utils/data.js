var BackupVersion;
(function (BackupVersion) {
    BackupVersion[BackupVersion["version1"] = 1] = "version1";
    BackupVersion[BackupVersion["version"] = 2] = "version";
})(BackupVersion || (BackupVersion = {}));
// 将webpage数据导出为字符串文本
var makeExportString = function (backupData) {
    var exportDataObject = {
        pages: backupData.pages,
        version: backupData.version || 2,
        extension_version: backupData.version,
        backup_at: backupData.backup_at || new Date().getTime(),
    };
    var dataString = encodeURIComponent(JSON.stringify(exportDataObject));
    return dataString;
};
// 还原备份数据
var resolveImportString = function (inputStr) {
    var datas;
    try {
        datas = JSON.parse(decodeURIComponent(inputStr));
    }
    catch (e) {
        console.error(e);
        alert('解析错误，请检查备份文件是否有损坏');
    }
    return datas;
};
export { BackupVersion, makeExportString, resolveImportString, };
//# sourceMappingURL=data.js.map