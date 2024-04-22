import {type ReactNode, useState} from 'react';
import {Switch} from "../../@/components/ui/switch";
import BasicSettingLine, {BasicSettingDescription, BasicSettingTitle} from "../setting/BasicSettingLine";
import CloudSupporters from "./CloudSupporters";
import { MdOutlineSettingsBackupRestore } from "react-icons/md";

interface Props {
    children?: ReactNode;
}

export default function CloudBackup(props: Props) {
    const {children} = props;
    const [open,setOpen] = useState(false)
    return (
        <div className="flex flex-col gap-6">
            <div className={'bg-card rounded-lg p-2'}>
                <MdOutlineSettingsBackupRestore className={'text-[40px] text-blue-400 m-auto'} />
                <h2 className={'text-lg text-accent-foreground font-bold text-center'}>云备份</h2>
                <p className={'p-2  text-sm'}>
                    自动备份全量数据至云端，当你卸载本插件、意外丢失数据、或重新在其他浏览器安装新的插件时，以便于你可以快速恢复数据。
                </p>
                <hr className={'w-[90%] mx-auto my-2'}/>
                <div className={'p-2 flex justify-between'}>
                    <span>备份此设备</span>
                    <Switch checked={open} onCheckedChange={setOpen} id="backup-switch" />
                </div>
            </div>

            {
                open &&
                <CloudSupporters>

                </CloudSupporters>
            }

            {
                open &&
                <div>
                    <BasicSettingTitle>
                        可用历史备份
                    </BasicSettingTitle>
                    <div>

                    </div>
                </div>
            }

        </div>
    );
}

