import { type ReactNode } from 'react'
import SettingDetail from './SettingDetail'
import ShortCutInfo from '../ShortCutInfo'

interface Props {
  children?: ReactNode
}

export default function Shortcut(props: Props) {
  const { children } = props
  return (
    <SettingDetail label={'快捷键'}>
      <div>
        <ShortCutInfo />
      </div>
    </SettingDetail>
  )
}

Shortcut.defaultProps = {}
