import { WebPage } from "../Types";
declare enum BackupVersion {
    version1 = 1,
    version = 2
}
interface BackupData {
    pages: WebPage[];
    version: BackupVersion;
    extension_version: string;
    backup_at: number;
}
declare const makeExportString: (backupData: BackupData) => string;
declare const resolveImportString: (inputStr: string) => BackupData;
export { BackupData, BackupVersion, makeExportString, resolveImportString, };
