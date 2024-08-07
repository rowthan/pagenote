import React, {type ReactNode, useState} from 'react';
import {Switch} from "../../@/components/ui/switch";
import BasicSettingLine, {
    BasicSettingDescription,
    BasicSettingTitle,
    SettingSection
} from "../setting/BasicSettingLine";
import useSettingConfig from "../../hooks/table/useSettingConfig";
import classNames from "classnames";
import { FcOpenedFolder } from "react-icons/fc";
import { FcSettings } from "react-icons/fc";
import { IoSyncCircleSharp } from "react-icons/io5";
import Status from "../Status";
import ConfigSwitch from "../backup/ConfigSwitch";
import CloudSupportLink from './CloudSupportLink';
import {NavLink} from "react-router-dom";

interface Props {
    children?: ReactNode;
}

export default function CloudSync(props: Props) {
    const [syncInfo,update] = useSettingConfig<{
        switch: boolean,
    }>('_sync','config');
    const [cloudConfig] = useSettingConfig<{cloudSource?: string}>('_cloud','config')

    return (
        <div className="flex flex-col gap-6">
            <div className={'bg-card rounded-lg'}>
                <div className={'p-2'}>
                    <IoSyncCircleSharp className={classNames('text-[40px] text-blue-400 m-auto',{
                        'grayscale': !syncInfo?.switch
                    })} />
                    <h2 className={'text-lg text-accent-foreground font-bold text-center'}>同步</h2>
                    <div className={'p-2 text-center text-sm text-muted-foreground'}>
                        各个设备将数据同步至云端交换数据，最终使得各设备数据同步、保持一致。
                    </div>
                </div>
                <hr className={'w-[90%] mx-auto'}/>
                <BasicSettingLine label={'云同步此设备'}
                                  subLabel={syncInfo?.switch && cloudConfig?.cloudSource? <span>数据将同步至云端</span> : '未开启'}
                                  right={ <ConfigSwitch rootKey={'_sync'}/>} />
            </div>

            {
                syncInfo?.switch &&
                <div>
                    <BasicSettingTitle>
                        云同步的数据类型
                    </BasicSettingTitle>
                    <SettingSection>
                        <BasicSettingLine label={'配置'}
                                          subLabel={'如画笔、开关等。不包含账号密码等敏感信息的配置数据'}
                                          badge={<Status>
                                              <FcSettings className={'w-full h-full'}/>
                                          </Status>}
                                          right={
                                              <Switch checked={true} disabled={true}>
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
                           服务商可以查看、编辑、删除你的数据，<NavLink to="/cloud">请选择你信任的存储服务商</NavLink>。
                      </span>
                    </BasicSettingDescription>
                </div>
            }

        </div>
    );
}

