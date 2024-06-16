import React, {type ReactNode, useState} from 'react';
import BasicSettingLine, {BasicSettingDescription, BasicSettingTitle} from "../setting/BasicSettingLine";
import {Switch} from "@/components/ui/switch";
import useSettingConfig from "hooks/table/useSettingConfig";
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
import CloudStat from "../stat/CloudStat";
import useStat from "../../hooks/useStat";

interface Props {
    children?: ReactNode;
}

export default function CloudSupporters(props: Props) {
    const [showForm,setShowForm] = useState(false)
    const [ossConfig, updateOssConfig] = useSettingConfig<{
        switch: boolean
    }>('_oss');
    const {data: webdav,mutate:refreshWebdav} = useStat('webdav',);
    const {data: oss,refresh} = useStat('oss','data');

    const [webdavConfig, update] = useSettingConfig<{ host: string, username: string,password?: string }>('_webdav','secret')
    const webdavSwitch = !!webdavConfig?.host && !!webdavConfig?.username && !!webdavConfig?.password
    const pagenoteSwitch = Boolean(ossConfig?.switch);
    return (
        <div>
            {/* <BasicSettingTitle>
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
            </BasicSettingTitle> */}
            <div className="">
                <CheckVersion requireVersion={'0.29.5'} fallback={<></>}>
                    <BasicSettingLine
                        badge={<Status disabled={!webdav?.connected}><img src="//pagenote-public.oss-cn-beijing.aliyuncs.com/0000/webdav.jpeg" alt=""/></Status>}
                        label={'WebDav'}
                        subLabel={webdavSwitch?"数据保存至你自己的服务器。更安全":""}
                        path={'/cloud/supporters/webdav'}
                        right={
                            <>
                                {
                                    webdavSwitch ? <CloudStat type='webdav'/> :
                                        <span className={'text-xs'}>未配置</span>
                                }
                            </>
                        }/>
                </CheckVersion>
                <BasicSettingLine badge={<Status disabled={!oss?.connected}><img src="/images/light-48.png" alt=""/></Status>}
                                  label={'PAGENOTE Cloud'}
                                  subLabel={pagenoteSwitch ? '由 PAGENOTE 提供服务。' : '未开启'}
                                  right={
                                      <>
                                          {
                                              pagenoteSwitch && <CloudStat type='oss'/>
                                          }
                                          <Switch checked={pagenoteSwitch} onCheckedChange={
                                              () => {
                                                  updateOssConfig({
                                                      switch: !pagenoteSwitch,
                                                  }).then(function () {
                                                      refresh()
                                                  })
                                              }
                                          } id="pagenote-cloud-switch"/>
                                      </>
                                  }>
                </BasicSettingLine>

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
            {/*<BasicSettingDescription>*/}
            {/*    <span>*/}
            {/*        数据存储服务商可以查看、编辑、删除你的数据。*/}
            {/*        <br/>*/}
            {/*        当启用多个云端存储服务时，将同时工作，且优先使用由个人提供的存储服务（WebDav &gt; PAGENOTE）。*/}
            {/*        <a href="https://pagenote.cn/docs/cloud" className={'more'}>了解更多</a>*/}
            {/*    </span>*/}
            {/*</BasicSettingDescription>*/}
        </div>
    );
}

