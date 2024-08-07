import React, { type ReactNode } from 'react'
import useStorage from 'hooks/table/useStorage'
import { getMb } from 'utils/size'
import BasicSettingLine, {BasicSettingDescription, SettingSection} from '../../setting/BasicSettingLine'
import Loading from 'components/loading/Loading'
import { basePath } from 'const/env'
import classNames from 'classnames'
import { Collection } from 'const/collection'
import CheckVersion from "../../check/CheckVersion";

interface Props {
  children?: ReactNode
}

export default function StorageInfo(props: Props) {
  const [pageStorage, loadingPage] = useStorage(Collection.webpage)
  const [lightStorage, loadingLight] = useStorage(Collection.light)
  const [snapshotStorage, loadingSnapshot] = useStorage(Collection.snapshot)
  const [htmlStorage, loadingHtml] = useStorage(Collection.html)
  const [noteStorage] = useStorage(Collection.note)

  const loading = loadingHtml || loadingLight || loadingSnapshot || loadingPage;

  const total =
    pageStorage?.usage +
    lightStorage?.usage +
    snapshotStorage?.usage +
    htmlStorage?.usage +
    1024
  const quota = pageStorage.quota || lightStorage.quota || snapshotStorage.quota || htmlStorage.quota || 0

  const list = [
    {
      name: '网页',
      usage: pageStorage.usage,
      bg: '#ff3a51',
      link: `/pagenote.html`,
    },
    {
      name: '标记',
      usage: lightStorage.usage,
      bg: '#f17c3b',
      link: `/pagenote.html`,
    },
    {
      name: '截图',
      usage: snapshotStorage.usage,
      bg: '#f6d647',
      link: `${basePath}/ext/gallery.html`,
    },
    {
      name: '存档html',
      usage: htmlStorage.usage,
      bg: '#4467a8',
      link: `${basePath}/ext/offline.html`,
    },
    {
      name: '备忘录',
      usage: noteStorage.usage,
      bg: '#b47d41',
    },
  ]

  const used = Math.floor(total / quota * 100)
  return (
    <>
      <SettingSection>
        <BasicSettingLine
            label={
              <span>
          <span>本机存储分析</span>
        </span>
            }
            right={
              <>
                <span> {getMb(total)}</span>
                <CheckVersion requireVersion={'0.29.11'} fallback={<></>}>
                  <div className={'text-sm text-color-400'}>
                    /{getMb(quota)} 已使用
                    <>
                      {
                          quota > 1 && total > 1 &&
                          <span>({used}%)</span>
                      }
                    </>
                  </div>
                </CheckVersion>
              </>
            }
        >
          <div className={'mt-2'}>
            <div className={'flex w-full '}>
              {list.map((item) => (
                  <div
                      className={
                        'h-3 min-w-[1px] tooltip tooltip-top first:rounded-l last:rounded-r'
                      }
                      key={item.name}
                      data-tip={`${getMb(item.usage || 0)}`}
                      style={{
                        width: `${(item.usage / total) * 100}%`,
                        backgroundColor: item.bg,
                      }}
                  ></div>
              ))}
            </div>
            <div className={'flex mt-2 text-color-400'}>
              {loading ? (
                  <div>
                    <Loading>正在统计中</Loading>
                  </div>
              ) : (
                  list.map((item) => (
                      <div
                          className={'text-xs inline-flex items-center mr-4'}
                          key={item.name}
                      >
                        <div
                            className={'w-2 h-2 rounded-full mr-1'}
                            style={{
                              backgroundColor: item.bg,
                            }}
                        ></div>
                        <a
                            href={item.link}
                            className={classNames({
                              'hover:underline': !!item.link,
                            })}
                            target={'_blank'}
                        >
                          {item.name}
                        </a>
                      </div>
                  ))
              )}
            </div>
          </div>
        </BasicSettingLine>
        <BasicSettingLine label={'导入导出'} path={'/data/backup'} />
      </SettingSection>
      {
          used > 80 && quota > 1000 &&
          <BasicSettingDescription>
            <span className={'text-destructive'}>
              存储空间不足，请清理电脑磁盘空间
            </span>
          </BasicSettingDescription>
      }
    </>
  )
}

StorageInfo.defaultProps = {}
