import React from 'react'
import BasicSettingLine, { SettingSection } from './BasicSettingLine'
import useSettingConfig from "../../hooks/table/useSettingConfig";
import {Switch} from "../../@/components/ui/switch";

export default function Advance() {
    const [config,update] = useSettingConfig<{
        webSignature?: boolean,
    }>('extension','config');

    const enabled = config?.webSignature;

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
              <BasicSettingLine
                  label={'网页指纹（Beta）'}
                  subLabel={'对网页生成指纹，不同URL指向同一网页的依据'}
                  right={
                      <Switch checked={enabled} onCheckedChange={(checked)=>{
                          update({
                              webSignature: checked,
                          })
                      }} />
                  }
              />
          </SettingSection>
      </div>
  )
}