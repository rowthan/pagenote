import UserCard from '../account/UserCard'
import DataBackup from '../backup/DataBackup'
import SettingHome from './SettingHome'
import { Route, Routes } from 'react-router-dom'
import React from 'react'
import LightSetting from './LightSetting'
import ImageCloud from '../backup/extension/ImageCloud'
import ImportAndExport from '../backup/extension/ImportAndExport'
import SettingDetail from './SettingDetail'
import Shortcut from './Shortcut'
import extApi from '@pagenote/shared/lib/pagenote-api'
import DisabledDetail from './DisabledDetail'

export default function Setting() {
  function onClickUser() {
    extApi.commonAction.openTab({
      reUse: true,
      url: 'https://pagenote.cn/account',
      tab: {},
    })
  }

  return (
    <div className={'max-w-3xl m-auto p-3'}>
      <div className={'mb-4'}>
        <UserCard editable={false} onClick={onClickUser} />
      </div>

      <div className="">
        <Routes>
          <Route index element={<SettingHome />} />
          <Route path={'/light'} element={<LightSetting />} />
          <Route path={'/disable'} element={<DisabledDetail />} />
          <Route path={'/shortcut'} element={<Shortcut />} />
          <Route path={'/data'} element={<DataBackup />} />
          <Route
            path={'/data/backup'}
            element={
              <SettingDetail label={'导入导出'}>
                <div>
                    <p className={'py-2 text-sm text-muted-foreground'}>
                        你可以将本设备的备份数据导入到其他设备，也可以将本设备的备份数据导出到其他设备。
                    </p>
                    <ImportAndExport />
                </div>
              </SettingDetail>
            }
          />
          <Route path={'/data/image-cloud'} element={<ImageCloud />} />
          <Route path={'*'} element={<SettingHome />} />
        </Routes>
      </div>
    </div>
  )
}
