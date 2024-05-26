import { type ReactNode } from 'react'
import SettingDetail from '../SettingDetail'


interface Props {
  children?: ReactNode
}

export default function Shortcut(props: Props) {
  const { children } = props
  // const [config,update]= useSettingConfig('workflows_config');


  return (
    <SettingDetail label={'数据流'}>
      <div>

      </div>
    </SettingDetail>
  )
}

Shortcut.defaultProps = {}
