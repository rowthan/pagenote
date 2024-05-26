import React from 'react'
import BasicSettingLine, {SettingSection} from './BasicSettingLine'
import SettingDetail from './SettingDetail'
import ExtensionData from '../backup/extension/ExtensionData'
import { get } from 'lodash'
import useSettingConfig from '../../hooks/table/useSettingConfig'
import useOssKey from '../../hooks/useOssKey'
import { Routes} from "react-router-dom";
import Status from "../Status";
import useStat from "../../hooks/useStat";

export default function DataBackup() {
  const [cloudConfig, setCloudConfig] = useSettingConfig('cloud')
  const enabled = !!get(cloudConfig, 'enable')
  const [oss, loading] = useStat('oss','private')

  return (
      <div className={' min-w-80'}>
          <ExtensionData/>
          <SettingSection>
              <BasicSettingLine
                  badge={<Status disabled={!enabled}>
                      <img src="//pagenote-public.oss-cn-beijing.aliyuncs.com/0000/img.jpg" alt=""/>
                  </Status>}
                  label={<span>图片优化</span>}
                  subLabel={<span>可减少本机图片空间占用</span>}
                  right={
                      <div className={'flex items-center'}>
                          {enabled ? (oss?.connected ? '已开启' : '未开启') : '禁用'}
                      </div>
                  }
                  path={'/data/image-cloud'}
              />
          </SettingSection>
      </div>
  )
}
