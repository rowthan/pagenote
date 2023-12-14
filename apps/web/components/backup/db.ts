import Dexie from "dexie";
import {BackupData, SnapshotResource} from "@pagenote/shared/lib/@types/data";
import {contentToFile} from "@pagenote/shared/lib/utils/document";

const database = new Dexie("lightpage-backup");
const TABLE_NAME = 'backup'
database.version(10).stores({
    [TABLE_NAME]: '++id,&backupId,*dataType,backup_at,version',
})

function getTable() {
    return database.table<BackupData>(TABLE_NAME)
}

export function getBackupDetail(backupId: string) {
    return getTable().where({
        backupId: backupId
    }).first()
}

export function addBackup(backup: BackupData & {snapshots?: Partial<SnapshotResource>[]}) {
    return getTable().put(backup);
}

export function removeBackup(backupId: string) {
    return getTable().where({
        backupId: backupId
    }).delete()
}

export function listBackupList(): Promise<BackupData[]> {
    getTable().orderBy('backup_at').reverse().offset(10).limit(10).delete();
    return getTable().orderBy('backup_at').reverse().limit(10).toArray();
}

export async function downloadBackupAsFile(backupId: string) {
    const data = await getTable().where({
        backupId: backupId
    }).first();

    if(!data){
        return Promise.reject('不存在备份数据')
    }

    contentToFile(JSON.stringify(data),data.backupId+'.pagenote.bak')
}

export function f() {

}
