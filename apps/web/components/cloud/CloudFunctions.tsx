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
import Status from "../Status";
import {Switch} from "@/components/ui/switch";
import useSettingConfig from "hooks/table/useSettingConfig";
import SettingDetail from "../setting/SettingDetail";
import { Button } from '@/components/ui/button';

interface Props {
    children?: ReactNode;
}

export default function CloudFunctions(props: Props) {
    const {children} = props;
  const [backup] = useSettingConfig<{ switch?: boolean }>('_backup')
  const [sync,update] = useSettingConfig<{
    switch: boolean,
  }>('_sync');

  const [cloudConfig, setCloudConfig] = useSettingConfig<{enable?:boolean}>('cloud')
  const enabled = cloudConfig?.enable ?? false;

  return (
        <>
            <BasicSettingTitle className={'mt-6'}>
                云空间用途
            </BasicSettingTitle>
            <SettingSection >
                <BasicSettingLine
                    badge={
                        <MdOutlineSettingsBackupRestore className={classNames('w-full h-full text-blue-400', {
                            'grayscale': !backup?.switch
                        })}/>
                    }
                    label={'备份'}
                    right={
                        <div className={'text-muted-foreground'}>
                            {backup?.switch ?
                                <CloudConnectedCheck/>
                                : '未开启'}
                        </div>
                    } path={'/cloud/backup'}/>
                <CheckVersion requireVersion={'0.29.13'} fallback={<></>}>
                    <BasicSettingLine badge={
                        <IoSyncCircleSharp className={classNames('w-full h-full text-blue-400', {
                            'grayscale': !sync?.switch
                        })}/>
                    } label={'同步'}
                                      right={sync?.switch ? <CloudConnectedCheck/> : '未开启'}
                                      path={'/cloud/sync'}/>
                </CheckVersion>

                <SettingSection>
                    <BasicSettingLine
                        badge={<Status disabled={!enabled}>
                            <img src="https://pagenote-public.oss-cn-beijing.aliyuncs.com/0000/img.jpg" alt=""/>
                        </Status>}
                        label={<span>图床</span>}
                        subLabel={<span>
                            将快照图片上传至云端，生成图片链接。可以在互联网公开访问该资源。
                        </span>}
                        right={
                            <>
                                <CloudStat type={'oss'} space={'private'}/>
                                <Switch checked={enabled} onCheckedChange={
                                    () => {
                                        setCloudConfig({
                                            enable: !enabled,
                                        })
                                    }
                                } id="pagenote-cloud-switch"/>
                            </>
                        }
                    />
                </SettingSection>
            </SettingSection>
            {/*<BasicSettingDescription>*/}
            {/*    <a>一键开启</a>*/}
            {/*</BasicSettingDescription>*/}
        </>
    );
}

