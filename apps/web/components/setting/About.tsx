import React from 'react'
import BasicSettingLine, { SettingSection } from './BasicSettingLine'
import SettingDetail from './SettingDetail'
import useWhoAmi from "../../hooks/useWhoAmi";
import DeviceInfo from "../account/DeviceInfo";
import useStorage from "../../hooks/table/useStorage";
import {Collection} from "../../const/collection";
import {getMb} from "../../utils/size";

export default function About() {
    const [whoAmI] = useWhoAmi()
    const [pageStorage] = useStorage(Collection.webpage)

    return (
      <div className={'relative'}>
          <SettingSection>
              <BasicSettingLine
                  label={'名称'}
                  path={''}
                  right={<>
                  {whoAmI?.did}
                  </>}
              />
              <BasicSettingLine
                  label={'PAGENOTE 版本'}
                  path={''}
                  right={<>
                      <DeviceInfo/>/<a href={whoAmI?.extensionStoreUrl}>{whoAmI?.extensionPlatform}</a>
                  </>}
              />
              <BasicSettingLine
                  label={'浏览器信息'}
                  path={''}
                  right={<div>{whoAmI?.browserType}-{whoAmI?.browserVersion}</div>}
              />

              <BasicSettingLine
                  label={'语言'}
                  path={''}
                  right={<div>{whoAmI?.language}</div>}
              />
              <BasicSettingLine
                  label={'总容量'}
                  path={''}
                  right={<div>{getMb(pageStorage.quota)}</div>}
              />
              <BasicSettingLine
                  label={'可用容量'}
                  path={''}
                  right={<div>{getMb(pageStorage.quota - pageStorage.totalUsage)}</div>}
              />
          </SettingSection>

          <SettingSection className={'mt-8'}>
              <BasicSettingLine label={'作者'} right={<a href="https://pagenote.cn/author">一用书生</a>}/>
          </SettingSection>
      </div>
  )
}
