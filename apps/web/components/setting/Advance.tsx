import React from 'react'
import BasicSettingLine, { SettingSection } from './BasicSettingLine'

export default function Advance() {
  return (
      <div className={'relative'}>
          <SettingSection>
              <BasicSettingLine
                  label={'权限管理'}
                  path={'/advance/permission'}
              />
              <BasicSettingLine
                  label={'自定义样式'}
                  path={'/advance/style'}
              />
          </SettingSection>
      </div>
  )
}
