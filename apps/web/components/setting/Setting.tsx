import UserCard from '../account/UserCard'
import DataBackup from './DataBackup'
import {Route, Routes, useNavigate, useNavigation} from 'react-router-dom'
import React from 'react'
import LightSetting from './LightSetting'
import ImageCloud from '../backup/extension/ImageCloud'
import ImportAndExport from '../backup/extension/ImportAndExport'
import SettingDetail from './SettingDetail'
import Shortcut from './Shortcut'
import extApi from '@pagenote/shared/lib/pagenote-api'
import DisabledDetail from './DisabledDetail'
import Safety from "./Safety";
import PermissionList from "../permission/PermissionList";
import BasicSettingLine, {SettingMoreButton, SettingSection} from "./BasicSettingLine";
import CloudBackup from "../backup/CloudBackup";
import useWhoAmi from "../../hooks/useWhoAmi";
import DeviceInfo from "../account/DeviceInfo";
import CheckVersion from "../check/CheckVersion";
import {basePath} from "../../const/env";
import {MdOutlineSettingsBackupRestore} from "react-icons/md";
import classNames from "classnames";
import {Switch} from "../../@/components/ui/switch";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "../../@/components/ui/dialog";
import {Button} from "../../@/components/ui/button";
import ExportFilter from "../backup/extension/ExportFilter";
import CloudBackupList from "../backup/CloudBackupList";
import CloudSupporters from "../backup/CloudSupporters";
import CloudSync from "../backup/CloudSync";

function SettingHome() {
    const [whoAmI] = useWhoAmi()
    const navigate = useNavigate()
    function onClickUser() {
        extApi.commonAction.openTab({
            reUse: true,
            url: 'https://pagenote.cn/account',
            tab: {},
        })
    }
    return (
        <>
            <div className={'mb-4'}>
                <UserCard editable={false} onClick={onClickUser}>
                    <SettingMoreButton onClick={() => {
                        navigate('/id')
                    }}/>
                </UserCard>
            </div>
            <SettingSection>
                <BasicSettingLine label={'数据存储'} path={'/data'}/>
                <BasicSettingLine
                    label={'画笔设置'}
                    path={'/light'}
                />
                <BasicSettingLine label={'快捷键'} path={'/shortcut'}/>
            </SettingSection>

            <SettingSection className={'my-4'}>
                <BasicSettingLine label={'隐私与安全'} path={'/safety'}/>
            </SettingSection>


            <SettingSection className={'mt-6'}>
                <BasicSettingLine
                    label={'插件版本'}
                    subLabel={<a className={'hover:underline'} href={whoAmI?.extensionStoreUrl}
                                 target={'_blank'}>{whoAmI?.extensionPlatform}</a>}
                    right={
                        <DeviceInfo/>
                    }
                />
            </SettingSection>
        </>
    )
}

export default function Setting() {



    return (
        <div className={'max-w-3xl m-auto p-3'}>


            <div className="">
                <Routes>
                    <Route index element={<SettingHome/>}/>
                    <Route path={'/light'} element={<LightSetting/>}/>
                    <Route path={'/light/disable'} element={<DisabledDetail/>}/>
                    <Route path={'/shortcut'} element={<Shortcut/>}/>


                    <Route path={'/safety'} element={<Safety/>}/>
                    <Route path={'/safety/permission'} element={
                        <SettingDetail label={'权限管理'}>
                            <PermissionList/>
                        </SettingDetail>
                    }/>


                    <Route
                        path={'/data/backup'}
                        element={
                            <SettingDetail label={'本地备份'}>
                                <>
                                    <div className={'bg-card rounded-lg p-2'}>
                                        <MdOutlineSettingsBackupRestore
                                            className={classNames('text-[40px] text-blue-400 m-auto', {
                                            })}/>
                                        <h2 className={'text-lg text-accent-foreground font-bold text-center'}>本地备份</h2>
                                        <p className={'p-2  text-sm'}>
                                            将本设备的数据导出为备份文件，用于恢复或导入其他设备。                                        </p>
                                        {/*<hr className={'w-[90%] mx-auto my-2'}/>*/}
                                        {/*<div className={'p-2 flex justify-between'}>*/}
                                        {/*    <Dialog >*/}
                                        {/*        <DialogTrigger asChild>*/}
                                        {/*            <Button variant={'outline'} className={'w-full block'}>*/}
                                        {/*                备份并下载*/}
                                        {/*            </Button>*/}
                                        {/*        </DialogTrigger>*/}
                                        {/*        <DialogContent className="">*/}
                                        {/*            <DialogHeader>*/}
                                        {/*                <DialogTitle>导出数据</DialogTitle>*/}
                                        {/*                <DialogDescription>保存为单个备份文件或压缩包，你可以将该文件导入到其他设备中以实现数据交换*/}
                                        {/*                </DialogDescription>*/}
                                        {/*            </DialogHeader>*/}
                                        {/*            <ExportFilter exportBy={'extension'}/>*/}
                                        {/*        </DialogContent>*/}
                                        {/*    </Dialog>*/}
                                        {/*</div>*/}
                                    </div>
                                    <ImportAndExport/>
                                    <p className={'py-2 text-sm text-muted-foreground'}>

                                        <CheckVersion requireVersion={'0.29.5'} fallback={<div></div>}>
                                            <span>
                                                若需要自动备份，请前往
                                                <a className={'more'}
                                                   href={`${basePath}/ext/setting.html#/data/cloud-backup`}>云端备份</a>
                                            </span>
                                        </CheckVersion>

                                    </p>

                                </>
                            </SettingDetail>
                        }
                    />
                    <Route path="/data/cloud-backup" element={
                        <SettingDetail label={'云备份'}>
                            <CloudBackup/>
                        </SettingDetail>
                    }/>
                    <Route path="/data/cloud-sync" element={
                        <SettingDetail label={'云同步'}>
                            <CloudSync/>
                        </SettingDetail>
                    }/>
                    <Route path="/data/cloud-supporters" element={
                        <SettingDetail label={'云端存储服务商'}>
                            <CloudSupporters/>
                        </SettingDetail>
                    }/>
                    <Route path="/data/cloud-backup/history" element={
                        <SettingDetail label={'备份历史'}>
                            <CloudBackupList/>
                        </SettingDetail>
                    }/>
                    <Route path={'/data/image-cloud'} element={<ImageCloud/>}/>
                    <Route path={'/data/*'} element={<DataBackup/>}/>


                    <Route path={'*'} element={<SettingHome/>}/>
                </Routes>
            </div>
        </div>
    )
}
