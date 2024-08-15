import UserCard from '../account/UserCard'
import {Route, Routes, useNavigate} from 'react-router-dom'
import React, {JSXElementConstructor, ReactElement} from 'react'
import SettingDetail from './SettingDetail'
import extApi from '@pagenote/shared/lib/pagenote-api'
import BasicSettingLine, {SettingMoreButton, SettingSection} from "./BasicSettingLine";
import useWhoAmi from "../../hooks/useWhoAmi";
import DeviceInfo from "../account/DeviceInfo";
import {useWindowSize} from "react-use";
import {MdOutlineSettingsBackupRestore} from "react-icons/md";
import classNames from "classnames";
import ImportAndExport from "../backup/extension/ImportAndExport";
import CheckVersion from "../check/CheckVersion";
import {basePath} from "../../const/env";
import CloudBackup from "../backup/CloudBackup";
import CloudSupporters from "../backup/CloudSupporters";
import CloudBackupList from "../backup/CloudBackupList";
import CloudSync from "../cloud/CloudSync";
import ImageCloud from "../backup/extension/ImageCloud";
import LightSetting from "./LightSetting";
import DisabledDetail from "./DisabledDetail";
import ShortCutInfo from "../ShortCutInfo";
import Safety from "./Safety";
import PermissionList from "../permission/PermissionList";
import IdHome from "../account/id/IdHome";
import WebdavForm from "../form/WebdavForm";
import CloudIndex from 'components/cloud/CloudIndex'
import ExtensionData from 'components/data/ExtensionData'
import ExportFilter from "../backup/extension/ExportFilter";
import About from "./About";
import Advance from "./Advance";
import CustomStyle from "./CustomStyle";
import LinkedRule from "./LinkedRule";

export const routes: Record<string, {
    element: ReactElement<any, string | JSXElementConstructor<any>>,
    title: string
}> = {
    '/': {
        element: <SettingHomeRedirect/>,
        title: ''
    },
    '/about':
        {
            element: <About/>,
            title: '关于'
        },
    '/data': {
        element: <ExtensionData/>,
        title: '本机存储'
    },
    '/data/*': {
        element: <ExtensionData/>,
        title: '本机存储'
    },
    '/data/backup': {
        element: <>
            <div className={'bg-card rounded-lg p-2 mb-4'}>
                <MdOutlineSettingsBackupRestore
                    className={classNames('text-[40px] text-blue-400 m-auto', {})}/>
                <h2 className={'text-lg text-accent-foreground font-bold text-center'}>本地备份</h2>
                <div className={'p-2  text-sm'}>
                    将本设备的数据下载为备份文件，用于恢复或导入其他设备。
                    <CheckVersion requireVersion={'0.29.5'} fallback={<div></div>}>
                    <span>
                        自动备份，请前往
                        <a className={'more'}
                           href={`${basePath}/ext/setting.html#/cloud/backup`}>云端备份</a>
                    </span>
                    </CheckVersion>
                </div>
            </div>
            <ExportFilter exportBy={'extension'}/>
            <ImportAndExport/>

        </>,
        title: '本地备份'
    },
    '/cloud': {
        element: <CloudIndex/>,
        title: '云空间(Beta)'
    },
    "/cloud/backup": {
        element: <CloudBackup/>,
        title: '云备份'
    },
    '/cloud/supporters': {
        element: <CloudSupporters/>,
        title: '云盘服务商'
    },
    '/cloud/supporters/webdav': {
        element: <WebdavForm/>,
        title: 'WebDav 配置'
    },
    '/cloud/backup/history':
        {
            element: <CloudBackupList/>,
            title: '备份历史'
        },
    '/cloud/sync': {
        element: <CloudSync/>,
        title: '云同步'
    },
    '/cloud/image': {
        element: <ImageCloud/>,
        title: '图床'
    },
    '/light': {
        element: <LightSetting/>,
        title: '画笔设置'
    },
    '/light/disable': {
        element: <DisabledDetail/>,
        title: '网页禁用规则'
    },
    '/shortcut':
        {
            element: <ShortCutInfo/>,
            title: '快捷键'
        },
    '/backup':
        {
            element: <CloudBackup/>,
            title: '云备份'
        },

    '/backup/supporters':
        {
            element: <CloudSupporters/>,
            title: '云端存储服务商'
        },
    '/advance':
        {
            element: <Advance/>,
            title: '高级设置'
        },
    '/advance/style':
        {
            element: <CustomStyle/>,
            title: '自定义样式'
        },
    '/advance/link':
        {
            element: <LinkedRule/>,
            title: 'URL关联规则'
        },
    '/safety':
        {
            element: <Safety/>,
            title: '隐私与安全'
        },
    '/advance/permission': {
        element: <PermissionList/>,
        title: '权限管理'
    },
    '/safety/permission': {
        element: <PermissionList/>,
        title: '权限管理'
    },
    '/id/*': {
        element: <IdHome basePath={'/id'}/>,
        title: ''
    },
    '*': {
        element: <SettingHomeRedirect/>,
        title: ''
    }
}
function SettingHomeRedirect() {
    const {width} = useWindowSize(900, 600)
    return (
        width < 600 ?
            <SettingHome/> :
            <ExtensionData/>
    )
}

function SettingHome() {
    const navigate = useNavigate();

    function onClickUser() {
        extApi.commonAction.openTab({
            reUse: true,
            url: 'https://pagenote.cn/account',
            tab: {},
        })
    }

    return (
        <div>
            <div className={'mb-4'}>
                <UserCard editable={false} onClick={onClickUser}>
                    <SettingMoreButton onClick={() => {
                        navigate('/id')
                    }}/>
                </UserCard>
            </div>
            <SettingSection>
                <BasicSettingLine label={routes['/data'].title} path={'/data'}/>
                <BasicSettingLine label={routes['/cloud'].title} path={'/cloud'}/>
            </SettingSection>

            <SettingSection className={'mt-6'}>
                <BasicSettingLine
                    label={routes['/light'].title}
                    path={'/light'}
                />
                <BasicSettingLine label={'快捷键'} path={'/shortcut'}/>
            </SettingSection>

            <SettingSection className={'my-4'}>
                <BasicSettingLine label={routes['/advance'].title} path={'/advance'}/>
            </SettingSection>


            <SettingSection className={'mt-6'}>
                <BasicSettingLine
                    label={'关于'}
                    path={'/about'}

                    right={
                        <DeviceInfo/>
                    }
                />
            </SettingSection>
        </div>
    )
}

export default function Setting() {
    return (
        <div className={'m-auto sm:p-1 p-3 flex gap-16'}>
            <div className={'lg:block hidden'}>
                <SettingHome/>
            </div>
            <div className="w-full flex-grow">
                <Routes>
                    {
                        Object.keys(routes).map((path) => {
                            const item = routes[path];
                            return (
                                <Route key={path} path={path} element={
                                    <SettingDetail label={item.title || ''}>
                                        {item.element}
                                    </SettingDetail>
                                }/>
                            )
                        })
                    }
                </Routes>
            </div>
        </div>
    )
}
