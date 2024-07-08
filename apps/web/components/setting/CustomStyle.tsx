import React from 'react'
import BasicSettingLine, {SettingArea, SettingSection} from './BasicSettingLine'
import SettingDetail from './SettingDetail'
import { BiSolidFileCss } from "react-icons/bi";
import CustomStyleForm from "../form/CustomStyleForm";

export default function CustomStyle() {
  return (
      <div className={'relative'}>
          <SettingArea title={'自定义样式'}
                       icon={<BiSolidFileCss />}
                       description={<div>
                           修改 PAGENOTE 的样式，如解决与其他插件的冲突，修改按钮相对位置等。支持 css 语法。
                       </div>}>
          </SettingArea>

          <div className={'mt-6'}>
              <CustomStyleForm />
          </div>
      </div>
  )
}
