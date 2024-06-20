import React from 'react'
import useWhoAmi from 'hooks/useWhoAmi'
import useSettingConfig from "hooks/table/useSettingConfig";
import BasicSettingLine, {BasicSettingDescription, SettingSection} from "../setting/BasicSettingLine";
import StorageInfo from "../backup/extension/StorageInfo";
import Status from "../Status";
import CloudStat from "../stat/CloudStat";
import {Switch} from "../../@/components/ui/switch";
import ConfigSwitch from "../backup/ConfigSwitch";

export default function ExtensionData() {
    const [cloudConfig, setCloudConfig] = useSettingConfig<{enable?:boolean}>('cloud','config')
    const enabled = cloudConfig?.enable ?? false;
    return (
        <div className={'mb-4'}>
            <StorageInfo/>


            <SettingSection className={'mt-6'}>
                <BasicSettingLine
                    badge={<Status disabled={!enabled}>
                        <img src="https://pagenote-public.oss-cn-beijing.aliyuncs.com/0000/img.jpg" alt=""/>
                    </Status>}
                    label={<span>图床</span>}
                    subLabel={<span>
                            将快照图片上传至 PAGENOTE 云端，优化本地存储空间。
                        </span>}
                    right={
                        <>
                            {enabled && <CloudStat connectedLable='✅' type={'oss'} space={'private'}/>}
                            <ConfigSwitch rootKey={'cloud'} />
                        </>
                    }
                />
            </SettingSection>
            <BasicSettingDescription>
                生成图片链接。请不要分享图片链接，链接可在互联网公开环境下访问。
                <a
                    href="https://pagenote.cn/privacy#51a07bcd45dc4e03be0b8301bf5a7bed"
                    target={'_blank'}
                    className={'text-xs a'}
                >
                    隐私保护须知
                </a>
            </BasicSettingDescription>
        </div>
    )
}
