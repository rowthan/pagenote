import useShortcut from '../hooks/useShortcut'
import extApi from '@pagenote/shared/lib/pagenote-api'
import useWhoAmi from '../hooks/useWhoAmi'
import BasicSettingLine, {BasicSettingTitle, SettingMoreButton, SettingSection} from './setting/BasicSettingLine'
import {Button} from "../@/components/ui/button";
import {openUrlInGroup} from "../utils/url";

const shortcutTip: Record<string, string> = {
  _execute_browser_action: '激活扩展/弹窗',
  _execute_action: '激活扩展/弹窗',
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
    const link = whoAmI?.extensionShortcutUrl || whoAmI?.extensionDetailUrl || 'https://pagenote.cn/shortcuts'
    openUrlInGroup(link)
  }

  return (
    <>
        <BasicSettingTitle>
            系统快捷键
        </BasicSettingTitle>
      <SettingSection>
        {commands.map((command) => (
          <BasicSettingLine
            key={command.name}
            label={
              command.description ||
              shortcutTip[command.name || ''] ||
              command.name ||
              '-'
            }
            right={
                (
                    <div className={'flex'} onClick={openShortCutSetting}>
                        <SettingMoreButton>{command.shortcut ?
                            <kbd>{command.shortcut}</kbd>
                            : '-'
                        }</SettingMoreButton>
                    </div>
                )
            }
          ></BasicSettingLine>
        ))}
      </SettingSection>

      <BasicSettingTitle className={'mt-10'}>
          <a className={'link'} onClick={()=>{openUrlInGroup(`${whoAmI?.origin}/pagenote.html#setting`)}}>插件快捷键</a>
      </BasicSettingTitle>
    </>
  )
}
