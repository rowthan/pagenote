import React from 'react'
import BasicSettingLine, { SettingSection } from './BasicSettingLine'
import useWhoAmi from '../../hooks/useWhoAmi'
import extApi from '@pagenote/shared/lib/pagenote-api'
import { BrowserType } from '@pagenote/shared/lib/utils/browser'

export default function SettingHome() {
  const [whoAmI] = useWhoAmi()
  const isFirefox = whoAmI?.browserType === BrowserType.Firefox

  function openDataCenter() {
    extApi.commonAction.openTab({
      reUse: false,
      tab: {},
      url: `${whoAmI?.origin}/web/ext/popup.html#/setting/data`,
    })
    window.close()
  }

  function openShortCutSetting() {
    if (!whoAmI?.extensionShortcutUrl) {
      alert('当前浏览器不支持直达插件设置中心')
      return
    }
    extApi.developer.chrome({
      namespace: 'tabs',
      type: 'create',
      args: [
        {
          url: whoAmI?.extensionShortcutUrl,
        },
      ],
    })
  }

  function gotoSetting() {
    const url = whoAmI?.origin + '/web/ext/setting.html#/setting/light'
    window.open(url, 'setting')
    window.close()
    // extApi.developer
    //   .chrome({
    //     namespace: 'tabs',
    //     type: 'create',
    //     args: [
    //       {
    //         reUse: true,
    //         url: url,
    //       },
    //     ],
    //   })
    //   .then(function (res) {
    //     if (res.success) {
    //       window.close()
    //     }
    //   })
  }

  return (
    <>
      <SettingSection>
        <BasicSettingLine label={'存储空间'} path={'/setting/data'} />

        <BasicSettingLine
          label={'画笔设置'}
          path={isFirefox ? '' : '/setting/light'}
          onClick={isFirefox ? gotoSetting : undefined}
        />

        <BasicSettingLine label={'快捷键'} path={'/setting/shortcut'} />
      </SettingSection>

      <SettingSection className={'mt-6'}>
        <BasicSettingLine
          label={'插件版本'}
          subLabel={<span>{whoAmI?.extensionPlatform}</span>}
          right={
            <span className={'text-xs'}>
              <a href="https://pagenote.cn/release" target={'_blank'}>
                {whoAmI?.version || '-'}
              </a>
            </span>
          }
        />
      </SettingSection>
    </>
  )
}
