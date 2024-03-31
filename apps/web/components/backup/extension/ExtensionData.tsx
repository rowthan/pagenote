import React from 'react'
import StorageInfo from './StorageInfo'
import BasicSettingLine, {SettingSection} from '../../setting/BasicSettingLine'
import { checkIsInPopup } from 'utils/check'
import useWhoAmi from 'hooks/useWhoAmi'
import { basePath } from 'const/env'

export default function ExtensionData() {
  const [whoAmI] = useWhoAmi()
  function onClick() {
    const url = `${basePath}/ext/setting.html#/setting/data/backup`
    if (checkIsInPopup()) {
      window.open(url)
      window.close()
    } else {
      window.location.href = url
    }
  }

  return (
    <div className={'mb-4'}>
      <div className={'text-sm text-muted-foreground mb-2 px-5'}>
        你的数据在本机
        <span
          className={'text-xs ml-1 tooltip tooltip-right'}
          data-tip={whoAmI?.did}
        >
          ({whoAmI?.did?.substring(0, 6)})
        </span>
        ，不同设备之间不会相互同步。
      </div>
      <SettingSection>
        <StorageInfo />
        <BasicSettingLine
          className={ 'cursor-pointer'}
          label={'管理插件数据'}
          onClick={onClick}
        />
      </SettingSection>
    </div>
  )
}
