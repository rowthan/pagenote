import React from 'react'
import useWhoAmi from 'hooks/useWhoAmi'
import useSettingConfig from "hooks/table/useSettingConfig";
import {SettingSection} from "../setting/BasicSettingLine";
import StorageInfo from "../backup/extension/StorageInfo";

export default function ExtensionData() {
    const [whoAmI] = useWhoAmi()
    const [backup] = useSettingConfig<{ switch?: boolean }>('_backup')
    const [sync,update] = useSettingConfig<{
        switch: boolean,
    }>('_sync');
    return (
        <div className={'mb-4'}>
            <StorageInfo/>
        </div>
    )
}
