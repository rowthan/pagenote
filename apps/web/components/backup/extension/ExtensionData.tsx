import React from 'react'
import StorageInfo from './StorageInfo'
import BasicSettingLine, {SettingSection} from '../../setting/BasicSettingLine'
import useWhoAmi from 'hooks/useWhoAmi'
import CheckVersion from "../../check/CheckVersion";
import useSettingConfig from "../../../hooks/table/useSettingConfig";
import classNames from "classnames";
import {MdOutlineSettingsBackupRestore} from "react-icons/md";
import CloudStat from "../../stat/CloudStat";

export default function ExtensionData() {
    const [whoAmI] = useWhoAmi()
    const [config] = useSettingConfig<{ switch?: boolean }>('_cloud')

    return (
        <div className={'mb-4'}>
            <div className={'text-sm text-muted-foreground mb-2 px-5'}>
                你的数据在本机
                <span
                    className={'text-xs ml-1 tooltip tooltip-right'}
                    data-tip={whoAmI?.did}
                >
          ({whoAmI?.did?.substring(0, 6)})
        </span>
            </div>
            <SettingSection>
                <StorageInfo/>
                <BasicSettingLine
                    badge={
                        <MdOutlineSettingsBackupRestore className={classNames('w-full h-full text-blue-400', {
                            'grayscale': !config?.switch
                        })}/>
                    }
                    label={'备份'}
                    right={
                        <div className={'text-muted-foreground'}>
                            {config?.switch ? <CloudStat types={['oss', 'webdav']}/> : '未开启'}
                        </div>
                    } path={'/data/cloud-backup'}/>
                <CheckVersion requireVersion={'0.30.0'} fallback={<></>}>
                    <BasicSettingLine label={'同步'} path={'/data/cloud-sync'}/>
                </CheckVersion>
            </SettingSection>
        </div>
    )
}
