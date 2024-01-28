import { type ReactNode } from 'react'
import SettingDetail from '../SettingDetail'
import useSettings from 'hooks/useSettings'
import useSettingConfig from 'hooks/table/useSettingConfig'


interface Props {
  children?: ReactNode
}

export default function Shortcut(props: Props) {
  const { children } = props
  const [config,update]= useSettingConfig('workflows_config');
  const [workflows]= useSettingConfig('workflows');


  return (
    <SettingDetail label={'数据流'}>
      <div>

      </div>
    </SettingDetail>
  )
}

Shortcut.defaultProps = {}
