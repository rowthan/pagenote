import React, {type ReactNode, useState} from 'react';
import {Switch} from "../../@/components/ui/switch";
import BasicSettingLine, {
    BasicSettingDescription,
    BasicSettingTitle,
    SettingSection
} from "../setting/BasicSettingLine";
import CloudSupporters from "./CloudSupporters";
import { MdOutlineSettingsBackupRestore } from "react-icons/md";
import useSettingConfig from "../../hooks/table/useSettingConfig";
import classNames from "classnames";
import { LuFolderSync } from "react-icons/lu";
import { FcOpenedFolder } from "react-icons/fc";
import { FcSettings } from "react-icons/fc";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "../../@/components/ui/dialog";
import {Button} from "../../@/components/ui/button";
import ExportFilter from "./extension/ExportFilter";
import ImportAndExport from "./extension/ImportAndExport";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "../../@/components/ui/alert-dialog";
import {basePath} from "../../const/env";
import CloudBackupList from "./CloudBackupList";
import Link from "next/link";
import {NavLink} from "react-router-dom";
import Status from "../Status";

interface Props {
    children?: ReactNode;
}

export default function CloudSync(props: Props) {
    const {children} = props;
    const [config,update] = useSettingConfig<{
        switch: boolean,
        data: boolean
    }>('_sync');
    const [showImport,setShowImport] = useState(false)
    const [showSupporters,setShowSupporters] = useState(false)

    return (
        <div className="flex flex-col gap-6">
            <div className={'bg-card rounded-lg'}>
                <div className={'p-2'}>
                    <LuFolderSync className={classNames('text-[40px] text-blue-400 m-auto',{
                        'grayscale': !config?.switch
                    })} />
                    <h2 className={'text-lg text-accent-foreground font-bold text-center'}>同步</h2>
                    <div className={'p-2  text-sm text-muted-foreground'}>
                        将数据同步至云端，使得各个设备之间的数据保持一致。
                    </div>
                </div>
                <hr className={'w-[90%] mx-auto'}/>
                <BasicSettingLine label={'云同步此设备'}
                                  right={
                                      <Switch checked={config?.switch} onCheckedChange={(checked)=>{
                                          update({
                                              switch: checked,
                                          })
                                      }} />
                } />
            </div>

            {
                config?.switch &&
                <div>
                    <BasicSettingTitle>
                        使用 CLOUD 同步的数据类型
                    </BasicSettingTitle>
                    <SettingSection>
                        <BasicSettingLine label={'配置'}
                                          subLabel={'如画笔、开关等。不包含账号密码等敏感信息的配置数据'}
                                          badge={<Status disabled={!config.switch}>
                                              <FcSettings className={'w-full h-full'}/>
                                          </Status>}
                                          right={
                                              <Switch checked={config?.switch}>
                                              </Switch>
                                          }
                        />
                        <BasicSettingLine label={'笔记'}
                                          badge={<Status disabled={true}>
                                              <FcOpenedFolder className={'w-full h-full'}/>
                                          </Status>}
                                          subLabel={'如批注、截图、网页快照等。包含你的笔记数据。'}
                                          right={
                                              <Switch checked={false} disabled={true}>
                                              </Switch>
                                          }
                        />
                    </SettingSection>
                    <BasicSettingDescription>
                        <span>
                           数据将上传至<NavLink className={'a'} to={'/data/cloud-supporters'}>云端</NavLink>。服务商可以查看、编辑、删除你的数据，请选择你授信的存储服务商。
                      </span>
                    </BasicSettingDescription>
                </div>
            }

        </div>
    );
}

