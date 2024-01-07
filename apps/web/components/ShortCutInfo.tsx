import useShortcut from '../hooks/useShortcut'
import extApi from '@pagenote/shared/lib/pagenote-api'
import useWhoAmi from '../hooks/useWhoAmi'
import BasicSettingLine from './setting/BasicSettingLine'

const shortcutTip: Record<string, string> = {
  _execute_browser_action: '激活扩展/弹窗',
}
export default function ShortCutInfo() {
  const [commands = []] = useShortcut()
  const [whoAmI] = useWhoAmi()
  // const { data } = useSettings()
  // const brush = data?.brushes || []

  // const shortcuts = brush.map(function (item) {
  //   return {
  //     color: item.bg,
  //     shortcut: item.shortcut,
  //   }
  // })

  function openShortCutSetting() {
    const link = whoAmI?.extensionShortcutUrl || whoAmI?.extensionDetailUrl

    extApi.developer.chrome({
      namespace: 'tabs',
      type: 'create',
      args: [
        {
          url: link,
        },
      ],
    })
  }

  return (
    <>
      <div>
        {commands.map((command) => (
          <BasicSettingLine
            key={command.name}
            label={
              command.description ||
              shortcutTip[command.name || ''] ||
              command.name ||
              '-'
            }
            right={<kbd>{command.shortcut}</kbd>}
          ></BasicSettingLine>
        ))}
        <BasicSettingLine
          label={
            <button
                onClick={openShortCutSetting}
                className={'text-blue-500'}
            >
              修改快捷键
            </button>
          }
          right={<div></div>}
        ></BasicSettingLine>
      </div>
    </>
  )
}
