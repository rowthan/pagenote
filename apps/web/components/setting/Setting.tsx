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
                                <div>
                                    <p className={'py-2 text-sm text-muted-foreground'}>
                                        将本设备的备份数据导出为文件，方便在其他设备导入。
                                        <CheckVersion requireVersion={'0.29.5'} fallback={<div></div>}>
                                            <span>
                                                若需要自动备份，请前往
                                                <a className={'more'}
                                                   href="/ext/setting.html#/data/cloud-backup">云端备份</a>
                                            </span>
                                        </CheckVersion>

                                    </p>
                                    <ImportAndExport/>
                                </div>
                            </SettingDetail>
                        }
                    />
                    <Route path="/data/cloud-backup" element={
                        <SettingDetail label={'云备份'}>
                            <CloudBackup/>
                        </SettingDetail>
                    }/>
                    <Route path={'/data/image-cloud'} element={<ImageCloud/>}/>
                    <Route path={'/data*'} element={<DataBackup/>}/>


                    <Route path={'*'} element={<SettingHome/>}/>
                </Routes>
            </div>
        </div>
    )
}
