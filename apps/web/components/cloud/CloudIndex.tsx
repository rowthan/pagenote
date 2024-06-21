import React, {type ReactNode} from 'react';
import BasicSettingLine, {
    BasicSettingDescription,
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
            <div className="">
                <div className={'bg-card rounded-lg'}>
                    <div className={'p-3'}>
                        <MdOutlineCloudUpload className={classNames('text-[40px] text-blue-400 m-auto', {
                            'grayscale': !enabled
                        })}/>
                        <h2 className={'text-lg text-accent-foreground font-bold text-center'}>云空间</h2>
                    </div>
                    <BasicSettingDescription className={'text-center'}>
                        <span>
                            将数据上传至云端，以实现数据备份、数据同步、存储空间优化等需求。
                            <a href="https://pagenote.cn/docs/cloud" className={'more'}>了解更多</a>
                        </span>
                    </BasicSettingDescription>
                    {/*<BasicSettingLine*/}
                    {/*    label={'候选存储服务商'}*/}
                    {/*    // right={*/}
                    {/*    //     <span className='text-xs'>*/}
                    {/*    //         {*/}
                    {/*    //             count > 0 ? <span>已联通云端存储服务：{count}个</span>:<span className={'text-destructive'}>未联通云端存储服务，请配置</span>*/}
                    {/*    //         }*/}
                    {/*    //     </span>*/}
                    {/*    // }*/}
                    {/*    path='/cloud/supporters'*/}
                    {/*></BasicSettingLine>*/}
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
                </div>
            </div>

            {
                enabled && <CloudFunctions />
            }
        </div>
    );
}

