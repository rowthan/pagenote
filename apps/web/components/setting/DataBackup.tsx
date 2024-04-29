import React from 'react'
import BasicSettingLine, {SettingSection} from './BasicSettingLine'
import SettingDetail from './SettingDetail'
import ExtensionData from '../backup/extension/ExtensionData'
import { get } from 'lodash'
import useUserConfig from '../../hooks/useUserConfig'
import useOssKey from '../../hooks/useOssKey'
import { Routes} from "react-router-dom";

export default function DataBackup() {
  const [cloudConfig, setCloudConfig] = useUserConfig('cloud')
  const enabled = !!get(cloudConfig, 'enable')
  const [oss, loading, connected] = useOssKey('private')

  return (
      <>
          <Routes>

          </Routes>
          <SettingDetail label={'数据存储'}>
              <div className={' min-w-80'}>
                  <ExtensionData />
                  <SettingSection>
                      <BasicSettingLine
                          label={<span>图片优化</span>}
                          subLabel={<span>可减少本机图片空间占用</span>}
                          right={
                              <div className={'flex items-center text-color-400'}>
                                  <div className={'text-xs'}>
                                      {enabled ? (connected ? '开启' : '关闭') : '禁用'}
                                  </div>
                              </div>
                          }
                          path={'/data/image-cloud'}
                      />
                  </SettingSection>
                  {/*<BasicSettingLine*/}
                  {/*  label={*/}
                  {/*    <span>*/}
                  {/*      云端数据库*/}
                  {/*      <TipInfo tip={'将数据存储在云端，多设备可以同步数据。'} />*/}
                  {/*    </span>*/}
                  {/*  }*/}
                  {/*  right={<div className={'text-xs'}>敬请期待...</div>}*/}
                  {/*/>*/}

                  {/*<BasicSettingLine subLabel={'备份数据至第三方存储平台'} label={*/}
                  {/*    <span>*/}
                  {/*        时间机器*/}
                  {/*    </span>*/}
                  {/*} right={*/}
                  {/*    <div className={'text-xs'}>*/}
                  {/*        敬请期待...*/}
                  {/*    </div>*/}
                  {/*}/>*/}
              </div>
          </SettingDetail>
      </>
  )
}
