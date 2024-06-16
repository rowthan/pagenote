import React, {type ReactNode} from 'react';
import BasicSettingLine, {
    BasicSettingDescription,
    BasicSettingTitle,
    SettingSection
} from "../setting/BasicSettingLine";
import {MdOutlineSettingsBackupRestore} from "react-icons/md";
import classNames from "classnames";
import CloudStat, {CloudConnectedCheck} from "../stat/CloudStat";
import CheckVersion from "../check/CheckVersion";
import {IoSyncCircleSharp} from "react-icons/io5";
import useSettingConfig from "../../hooks/table/useSettingConfig";
import Status from "../Status";
import {get} from "lodash";
import CloudSupporters from '../backup/CloudSupporters';
import { MdOutlineCloudUpload } from "react-icons/md";
import {Switch} from "../../@/components/ui/switch";
import useStat from "../../hooks/useStat";
import CloudFunctions from "./CloudFunctions";


interface Props {
    children?: ReactNode;
}

export default function CloudIndex(props: Props) {
    const {children} = props;
    const {data: oss} = useStat('oss','data');
    const {data: webdav} = useStat('webdav');
    let count = 0;
    if (oss?.connected) {
        count++;
    }
    if (webdav?.connected) {
        count++;
    }

    const [cloudConfig, setCloudConfig] = useSettingConfig<{enable?:boolean}>('cloud')
    const enabled = cloudConfig?.enable ?? false;

    return (
        <div className="">
            <div className="">
                <div className={'bg-card rounded-lg'}>
                    <div className={'p-3'}>
                        <MdOutlineCloudUpload className={classNames('text-[40px] text-blue-400 m-auto', {
                            'grayscale': count === 0
                        })}/>
                        <h2 className={'text-lg text-accent-foreground font-bold text-center'}>云空间</h2>
                    </div>
                    <BasicSettingDescription className={'text-center'}>
                        <span>
                            将数据上传至云端，以实现数据备份、数据同步、存储空间优化等需求。
                            <a href="https://pagenote.cn/docs/cloud" className={'more'}>了解更多</a>
                        </span>
                    </BasicSettingDescription>
                    <CloudSupporters/>
                </div>
                <BasicSettingDescription>
                    {count > 0 ? <span>已连接云端存储服务：{count}个</span>:<span className={'text-destructive'}>未启用云端服务，请检查云端存储介质配置</span>}
                </BasicSettingDescription>
            </div>

            {
                count >= 1 && <CloudFunctions />
            }
        </div>
    );
}

