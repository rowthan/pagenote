import CheckVersion from "components/check/CheckVersion";
import BasicLayout from "layouts/BasicLayout";
import BackupList from "components/backup/BackupList";


export default function BackupPage() {
    return(
        <BasicLayout title={'备份、还原数据'}>
            <div className="p-4">
                <CheckVersion requireVersion={'0.23.8'}>
                    <BackupList />
                </CheckVersion>
            </div>
        </BasicLayout>
    )
}
