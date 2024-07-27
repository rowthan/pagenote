import React from 'react'
import BasicSettingLine, { SettingSection } from './BasicSettingLine'
import SettingDetail from './SettingDetail'

export default function Safety() {
  return (
      <div className={'relative'}>
          <SettingSection>
              <BasicSettingLine
                  label={'权限管理'}
                  path={'/advance/permission'}
              ></BasicSettingLine>
          </SettingSection>
      </div>
  )
}
