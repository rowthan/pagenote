import React, {type ReactNode} from 'react';
import BasicSettingLine, {
    BasicSettingDescription, SettingArea,
} from "../setting/BasicSettingLine";
import classNames from "classnames";
import CloudStat from "./CloudStat";
import useSettingConfig from "../../hooks/table/useSettingConfig";
import { MdOutlineCloudUpload } from "react-icons/md";
import useStat from "../../hooks/useStat";
import CloudFunctions from "./CloudFunctions";
import {CloudSelect} from "./CloudSelector";
import CloudSupportLink from "./CloudSupportLink";

interface Props {
    children?: ReactNode;
}

export default function CloudIndex(props: Props) {
    const [cloud] = useSettingConfig<{ cloudSource: string }>('_cloud','config');
    const cloudSource = cloud?.cloudSource as 'oss' | 'webdav'
    //@ts-ignore
    const {data:cloudStat} = useStat(cloudSource,'data')
    const enabled =   cloudStat?.connected;

    return (
        <div className="">
            <SettingArea
                title={'云空间'}
                icon={<MdOutlineCloudUpload className={classNames( {
                    'grayscale': !enabled
                })}/>}
                description={
                <span>
                    将数据上传至云端，以实现数据备份、数据同步、存储空间优化等需求。
                    <a href="https://pagenote.cn/docs/cloud" className={'more'}>了解更多</a>
                </span>}>
                    <BasicSettingLine
                        label={
                            <div className={'flex gap-2'}>
                                <span>云存储服务商</span>
                                {cloud?.cloudSource && <CloudStat type={cloud?.cloudSource||''} space={'data'} />}
                            </div>
                        }
                        subLabel={cloud?.cloudSource?<span>已选择 <CloudSupportLink /> 作为云存储服务商</span>:'未启用云'}
                        right={ <CloudSelect />}
                    />
            </SettingArea>

            {
                enabled && <CloudFunctions />
            }
        </div>
    );
}

