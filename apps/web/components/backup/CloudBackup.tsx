import React, {type ReactNode} from 'react';
import BasicSettingLine from "../setting/BasicSettingLine";
import { MdOutlineSettingsBackupRestore } from "react-icons/md";
import useSettingConfig from "../../hooks/table/useSettingConfig";
import classNames from "classnames";
import {NavLink} from "react-router-dom";
import { CloudSelect } from 'components/cloud/CloudSelector';
import CloudStat from "../stat/CloudStat";
import {Switch} from "../../@/components/ui/switch";
import ConfigSwitch from "./ConfigSwitch";

interface Props {
    children?: ReactNode;
}

export default function CloudBackup(props: Props) {
    const [config,update] = useSettingConfig<{
        cloudSource: 'oss' | 'webdav',
        switch?: boolean
    }>('_backup','config');

    const enabled = config?.switch;

    return (
        <div className="flex flex-col gap-6">
            <div className={'bg-card rounded-lg'}>
                <div className={'p-2'}>
                    <MdOutlineSettingsBackupRestore className={classNames('text-[40px] text-blue-400 m-auto',{
                        'grayscale': !enabled
                    })} />
                    <h2 className={'text-lg text-accent-foreground font-bold text-center'}>云备份</h2>
                    <div className={'p-2 w-4/5 mx-auto text-center text-sm text-muted-foreground'}>
                        创建全量数据快照。当你重装插件、数据意外丢失数据、或重新在其他浏览器安装新的插件时，备份数据便于你快速地恢复数据。
                    </div>
                </div>
                <hr className={'w-[90%] mx-auto'}/>
                <BasicSettingLine
                  label={'云备份此设备'}
                  subLabel={enabled ? <span>
                      将在系统闲置时备份今日数据至云
                  </span>:'未启用云备份功能'}
                  right={
                    <div className={'flex gap-2'}>
                        {/*<CloudStat type={config?.cloudSource || 'oss'} space={'data'} />*/}
                        {/*<CloudSelect />*/}
                        <ConfigSwitch rootKey={'_backup'} />
                    </div>
                  } />
                {
                    enabled &&
                    <BasicSettingLine label={'云备份历史'} path={'/cloud/backup/history'} />
                }
            </div>
        </div>
    );
}
