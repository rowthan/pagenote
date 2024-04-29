import React from 'react'
import BasicSettingLine, { SettingSection } from './BasicSettingLine'
import SettingDetail from './SettingDetail'

export default function Safety() {
  return (
    <SettingDetail label={'隐私与安全'}>
      <div className={'relative'}>
        <SettingSection>
          <BasicSettingLine
            label={'权限管理'}
            path={'/safety/permission'}
          ></BasicSettingLine>
        </SettingSection>
      </div>
    </SettingDetail>
  )
}
