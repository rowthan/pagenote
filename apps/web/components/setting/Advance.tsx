import React from 'react'
import BasicSettingLine, { SettingSection } from './BasicSettingLine'
import useSettingConfig from "../../hooks/table/useSettingConfig";
import CheckVersion from "../check/CheckVersion";

export default function Advance() {
    const [config,update] = useSettingConfig<{
        webSignature?: boolean,
    }>('extension','config');

    const enabled = config?.webSignature;

    return (
      <div className={'relative'}>
          <SettingSection>
              <CheckVersion requireVersion={'0.29.17'} fallback={<BasicSettingLine
                  label={'权限管理'}
                  path={'/advance/permission'}
              />}>
                  <></>
              </CheckVersion>

              <BasicSettingLine
                  label={'自定义样式'}
                  path={'/advance/style'}
              />
              <BasicSettingLine
                  label={'同一网页判定规则'}
                  subLabel={
                      <span>
                          {/*对网页生成指纹，不同URL*/}
                          {/*  <a href={'https://pagenote.cn/docs/web-signature'}*/}
                          {/*     className={'a'}*/}
                          {/*     target={'_blank'}>*/}
                          {/*    指向同一网页的依据</a>*/}
                      </span>
                    }
                   path={'/advance/link'}
              />
          </SettingSection>
      </div>
  )
}
