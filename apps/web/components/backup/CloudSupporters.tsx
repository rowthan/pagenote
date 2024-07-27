import React, {type ReactNode, useState} from 'react';
import BasicSettingLine, {
    BasicSettingDescription,
    BasicSettingTitle,
    SettingSection
} from "../setting/BasicSettingLine";
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
import CloudStat from "../cloud/CloudStat";
import useStat from "../../hooks/useStat";
import {supporters} from "../../const/supporters";

interface Props {
    children?: ReactNode;
}

export default function CloudSupporters(props: Props) {
    return (
        <div>
            <div className="">
                {
                    supporters.map((item)=>(
                        <BasicSettingLine
                            key={item.name}
                            badge={<Status>
                                <img src={item.icon} alt={item.name}/>
                            </Status>}
                            label={item.name}
                            subLabel={item.description}
                            path={`${item.path||''}`}
                            right={
                                <>
                                    {/*@ts-ignore*/}
                                    <CloudStat type={item.type} space={'data'}/>
                                </>
                            }/>
                    ))
                }
                {/*<CheckVersion requireVersion={'0.29.5'} fallback={<></>}>*/}
                {/*    <BasicSettingLine*/}
                {/*        badge={<Status disabled={!webdav?.connected}><img src="//pagenote-public.oss-cn-beijing.aliyuncs.com/0000/webdav.jpeg" alt=""/></Status>}*/}
                {/*        label={'WebDav'}*/}
                {/*        subLabel={webdavSwitch?"数据保存至你自己的服务器。更安全":""}*/}
                {/*        path={'/cloud/supporters/webdav'}*/}
                {/*        right={*/}
                {/*            <>*/}
                {/*                {*/}
                {/*                    webdavSwitch ? <CloudStat type='webdav'/> :*/}
                {/*                        <span className={'text-xs'}>未配置</span>*/}
                {/*                }*/}
                {/*            </>*/}
                {/*        }/>*/}
                {/*</CheckVersion>*/}
                {/*<BasicSettingLine badge={<Status disabled={!oss?.connected}><img src="/images/light-48.png" alt=""/></Status>}*/}
                {/*                  label={'PAGENOTE Cloud'}*/}
                {/*                  subLabel={'由 PAGENOTE 提供服务。'}*/}
                {/*                  right={*/}
                {/*                      <CloudStat type='oss'/>*/}
                {/*                  }>*/}
                {/*</BasicSettingLine>*/}
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

