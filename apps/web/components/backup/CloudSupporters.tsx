import {type ReactNode, useState} from 'react';
import BasicSettingLine, {BasicSettingDescription, BasicSettingTitle} from "../setting/BasicSettingLine";
import {Switch} from "../../@/components/ui/switch";

interface Props {
    children?: ReactNode;
}

export default function CloudSupporters(props: Props) {
    const {children} = props;
    const [open,setOpen] = useState(false)
    return (
        <div>
            <BasicSettingTitle>
                云端存储服务商
            </BasicSettingTitle>
            <div className="">
                <BasicSettingLine label={'PAGENOTE Cloud'} subLabel={'由 PAGENOTE 提供'} right={
                    <div>
                        <Switch checked={open} onCheckedChange={setOpen} id="pagenote-cloud-switch" />
                    </div>
                }>

                </BasicSettingLine>
                <BasicSettingLine label={'Webdav'} subLabel={'由你自己托管'} right={
                    <div>
                        待开放
                    </div>
                }>

                </BasicSettingLine>
            </div>
            <BasicSettingDescription>
                <span>
                    选择将你信任的云端存储类型作为存储服务器，该服务商可以查看、编辑、删除你的数据。
                    <a href="https://pagenote.cn/docs/cloud-space" className={'more'}>了解更多</a>
                </span>
            </BasicSettingDescription>
        </div>
    );
}

