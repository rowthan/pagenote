import React, {type ReactNode, useState} from 'react';
import BasicSettingLine, {BasicSettingDescription, BasicSettingTitle} from "../setting/BasicSettingLine";
import {Switch} from "@/components/ui/switch";
import useSettingConfig from "hooks/table/useSettingConfig";
import {Button} from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import WebdavForm from "../form/WebdavForm";
import Status from "../Status";
import CheckVersion from "../check/CheckVersion";
import useUserInfo from "../../hooks/useUserInfo";
import CloudStat from "../stat/CloudStat";

interface Props {
    children?: ReactNode;
}


export default function CloudSupporters(props: Props) {
    const {children} = props;
    const [showForm,setShowForm] = useState(false)
    const [cloudBackupConfig, updateCloudUpdate] = useSettingConfig<{
        pagenote: boolean
        switch: boolean
    }>('_cloud');
    const [webdavConfig, update] = useSettingConfig<{ host: string, username: string,password?: string }>('_webdav')
    const [userInfo] = useUserInfo()
    const webdavSwitch = !!webdavConfig?.host && !!webdavConfig?.username && !!webdavConfig?.password
    const pagenoteSwitch = !!cloudBackupConfig?.pagenote;
    return (
        <div>
            <BasicSettingTitle>
                <span>
                    {
                       ( !webdavSwitch && !pagenoteSwitch) ?
                           <span className={'text-xs mx-2 text-destructive'}>
                               未配置可用的云端存储服务商。将无法使用云端功能。
                           </span>:
                           <span>

                           </span>
                    }
                </span>
            </BasicSettingTitle>
            <div className="">
                <BasicSettingLine badge={<Status disabled={!pagenoteSwitch}><img src="/images/light-48.png" alt=""/></Status>}
                                  label={'PAGENOTE Cloud'}
                                  subLabel={pagenoteSwitch ? '由 PAGENOTE 提供服务。' : '未开启'}
                                  right={
                                      <>
                                          {
                                              pagenoteSwitch && <CloudStat types={['oss']}/>
                                          }
                                          <Switch checked={pagenoteSwitch} onCheckedChange={
                                              () => {
                                                  updateCloudUpdate({
                                                      pagenote: !pagenoteSwitch,
                                                  })
                                              }
                                          } id="pagenote-cloud-switch"/>
                                      </>
                                  }>
                </BasicSettingLine>
               <CheckVersion requireVersion={'0.29.5'} fallback={<></>}>
                   <BasicSettingLine
                       badge={<Status disabled={!webdavSwitch}><img src="//pagenote-public.oss-cn-beijing.aliyuncs.com/0000/webdav.jpeg" alt=""/></Status>}
                       label={'WebDav'}
                       subLabel={webdavSwitch?"数据保存至你自己的服务器。":"即将开放"}
                       right={
                           <>
                               {
                                   webdavSwitch && <CloudStat types={['webdav']}/>
                               }
                               <Switch className={'bg-input'} checked={webdavSwitch} onClick={
                                   () => {
                                       setShowForm(true)
                                   }
                               }/>
                           </>
                       }>
                   </BasicSettingLine>
               </CheckVersion>
                <Dialog open={showForm} onOpenChange={setShowForm}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>配置 WebDav 账号密码</DialogTitle>
                            <DialogDescription>
                                账号信息仅保存在本地，你仍需要在其他设备中再次配置。
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <WebdavForm afterSubmit={()=>{setShowForm(false)}}/>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
            <BasicSettingDescription>
                <span>
                    数据存储服务商可以查看、编辑、删除你的数据。
                    <br/>
                    当启用多个云端存储服务时，将同时工作，且优先使用由个人提供的存储服务（WebDav &gt; PAGENOTE）。
                    <a href="https://pagenote.cn/docs/cloud" className={'more'}>了解更多</a>
                </span>
            </BasicSettingDescription>
        </div>
    );
}

