import React, {type ReactNode} from 'react';
import BasicSettingLine, {
    BasicSettingDescription,
    BasicSettingTitle,
    SettingSection
} from "../setting/BasicSettingLine";
import {MdOutlineSettingsBackupRestore} from "react-icons/md";
import classNames from "classnames";
import {IoSyncCircleSharp} from "react-icons/io5";
import useSettingConfig from "hooks/table/useSettingConfig";
import { Button } from '@/components/ui/button';
import ConfigSwitch from "../backup/ConfigSwitch";

interface Props {
    children?: ReactNode;
}

export default function CloudFunctions(props: Props) {
    const {children} = props;
  const [backup,updateBackup] = useSettingConfig<{ cloudSource?: 'webdav' | 'oss',switch?:boolean }>('_backup','config')
  const [sync,updateConfig] = useSettingConfig<{
    switch?: boolean,
  }>('_sync','config');
  const cloudBackupEnabled = Boolean(backup?.switch);
  const syncEnabled = Boolean(sync?.switch);

  const enabledAll = cloudBackupEnabled && syncEnabled;

  function toggleAll() {
        updateBackup({
            switch: !enabledAll
        })
        updateConfig({
            switch: !enabledAll
        })
  }

  return (
        <>
            <BasicSettingTitle className={'mt-6'}>
                云空间用途
            </BasicSettingTitle>
            <SettingSection >
                <BasicSettingLine
                    badge={
                        <MdOutlineSettingsBackupRestore className={classNames('w-full h-full text-blue-400', {
                            'grayscale': !cloudBackupEnabled
                        })}/>
                    }
                    label={'备份'}
                    right={
                        <div className={'text-muted-foreground'}>
                            {cloudBackupEnabled ?
                                '已开启':
                                <ConfigSwitch rootKey={'_backup'} />
                                }
                        </div>
                    } path={cloudBackupEnabled ? '/cloud/backup' :''}/>
                <BasicSettingLine
                    badge={
                        <IoSyncCircleSharp className={classNames('w-full h-full text-blue-400', {
                            'grayscale': !syncEnabled
                        })}/>
                    }
                    label={'同步'}
                    right={syncEnabled ? '已开启' : <ConfigSwitch rootKey={'_sync'} />}
                    path={syncEnabled ? '/cloud/sync':''}/>

                {/*<SettingSection>*/}
                {/*    <BasicSettingLine*/}
                {/*        badge={<Status disabled={!enabled}>*/}
                {/*            <img src="https://pagenote-public.oss-cn-beijing.aliyuncs.com/0000/img.jpg" alt=""/>*/}
                {/*        </Status>}*/}
                {/*        label={<span>图床</span>}*/}
                {/*        subLabel={<span>*/}
                {/*            将快照图片上传至 PAGENOTE 云端，生成图片链接。请不要分享图片链接，链接可在互联网公开环境下访问。*/}
                {/*        </span>}*/}
                {/*        right={*/}
                {/*            <>*/}
                {/*                <CloudStat connectedLable='✅' type={'oss'} space={'private'}/>*/}
                {/*                <Switch checked={enabled} onCheckedChange={*/}
                {/*                    () => {*/}
                {/*                        setCloudConfig({*/}
                {/*                            enable: !enabled,*/}
                {/*                        })*/}
                {/*                    }*/}
                {/*                } id="pagenote-cloud-switch"/>*/}
                {/*            </>*/}
                {/*        }*/}
                {/*    />*/}
                {/*</SettingSection>*/}
            </SettingSection>
            <BasicSettingDescription className={'flex justify-end'}>
                <Button variant={'ghost'} size={'sm'} onClick={()=>{toggleAll()}}>一键{enabledAll ? '关闭' : '开启'}</Button>
            </BasicSettingDescription>
        </>
    );
}

