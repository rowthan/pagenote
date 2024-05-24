import { type ReactNode, useState } from 'react'
import SettingDetail from '../../setting/SettingDetail'
import BasicSettingLine, {SettingSection} from '../../setting/BasicSettingLine'
import TipInfo from '../../TipInfo'
import useSettingConfig from '../../../hooks/table/useSettingConfig'
import { get } from 'lodash'
import CloudStatus from './CloudStatus'
import classNames from 'classnames'
import useUserInfo from '../../../hooks/useUserInfo'
import useOssKey from '../../../hooks/useOssKey'
import { Switch } from "@/components/ui/switch"
import useStat from "../../../hooks/useStat";
import CloudStat from "../../stat/CloudStat";

interface Props {
  children?: ReactNode
}

export default function ImageCloud(props: Props) {
  const [cloudConfig, setCloudConfig] = useSettingConfig('cloud')
  const [oss, loading, connected] = useOssKey('private')
  const enabled = !!get(cloudConfig, 'enable')
  return (
    <SettingDetail
      label={
        <div className={'flex items-center'}>
          <span>图床</span>
        </div>
      }
    >
      <div className={'px-1 pb-2'}>
        <div>
          <SettingSection>
            <BasicSettingLine
              label={'启用图片优化（图床）'}
              right={
                <input
                  type="checkbox"
                  className="toggle toggle-info "
                  checked={enabled}
                  onChange={(e) => {
                    setCloudConfig({
                      enable: e.target.checked,
                    })
                  }}
                />
              }
            />
          </SettingSection>
          <div className={'mt-1 mx-5 text-xs text-muted-foreground mb-6'}>
            {enabled
              ? '将快照图片上传至云端，生成图片链接。任何获得该链接的用户，都可以在互联网访问该资源。'
              : '优化本机图片存储'}
          </div>

          {enabled && (
            <div>
              <div className={'mt-2 mx-5 text-xs text-muted-foreground mb-1'}>
                图床服务商
              </div>
              <SettingSection>
                {/*<BasicSettingLine*/}
                {/*  label={*/}
                {/*    <span>*/}
                {/*      <span>私人云</span>*/}
                {/*      <TipInfo*/}
                {/*        tip={*/}
                {/*          '由你指定数据云存储空间，最大程度的保证你的数据安全。'*/}
                {/*        }*/}
                {/*      />*/}
                {/*    </span>*/}
                {/*  }*/}
                {/*  right={*/}
                {/*    <div>*/}
                {/*      <CloudStatus cloudServer={'customAliOss'} />*/}
                {/*    </div>*/}
                {/*  }*/}
                {/*/>*/}
                <BasicSettingLine
                  label={
                    <span>
                      PAGENOTE 云
                      <TipInfo tip={'VIP 可用。由PAGENOTE官方提供此服务。'} />
                    </span>
                  }
                  loading={loading}
                  right={
                    <CloudStat types={['oss']} space={'private'} />
                  }
                />
              </SettingSection>
              <div className={'p-5 flex flex-row-reverse'}>
                <a
                  href="https://pagenote.cn/privacy#51a07bcd45dc4e03be0b8301bf5a7bed"
                  target={'_blank'}
                  className={'text-xs link'}
                >
                  隐私保护须知
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </SettingDetail>
  )
}

ImageCloud.defaultProps = {}
