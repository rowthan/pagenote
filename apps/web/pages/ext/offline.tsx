import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import extApi from '@pagenote/shared/lib/pagenote-api'
import Head from 'next/head'

import dayjs from 'dayjs'
import TipInfo from 'components/TipInfo'
import useWhoAmi from 'hooks/useWhoAmi'
import { basePath } from 'const/env'
import { appendCss, appendScript } from 'utils/document'
import RedirectToExt from 'components/RedirectToExt'
import { contentToFile } from '@pagenote/shared/lib/utils/document'
import { html } from '@pagenote/shared/lib/extApi'
import OfflineHTML = html.OfflineHTML
import useTableQuery from '../../hooks/table/useTableQuery'
import { Collection } from '../../const/collection'
import Achieve from "./achieve";

function runScript(root?: Document | null) {
  if (!root) {
    return
  }
  const scripts = root.querySelectorAll('script')
  console.log(scripts, 'scripts')
  scripts.forEach(function (script) {
    console.log(script.outerHTML)
    const newScript = root.createElement('script')
    newScript.src = script.src
    newScript.type = script.type || 'application/javascript'
    newScript.innerHTML = script.innerHTML
    newScript.dataset.run = '1'
    script.replaceWith(newScript)
  })
}

export default function Offline() {
  const { query } = useRouter()
  const [resource, setResource] = useState<Partial<OfflineHTML> | undefined>()
  const { data: relatedResource } = useTableQuery<OfflineHTML>(
    Collection.html,
    {
      query: {
        relatedPageUrl: resource?.relatedPageUrl,
      },
      limit: 9999,
      projection: {
        createAt: 1,
        resourceId: 1,
      },
    }
  )
  const [whoAmI] = useWhoAmi()
  const [loaded, setLoaded] = useState(false)

  function fetchResource() {
    const id = query.id as string
    const url = query.url as string
    if (!id || !whoAmI?.origin || loaded) {
      return
    }
    const queries = []
    if (id) {
      queries.push({
        resourceId: id,
      })
    }
    if (url) {
      queries.push({
        relatedPageUrl: url,
      })
    }
    extApi.table
      .query({
        table: 'html',
        db: 'resource',
        params: {
          query: {
            //@ts-ignore
            $or: queries,
          },
          limit: 1,
        },
      })
      .then(function (res) {
        const resource = (res.data?.list[0] as Partial<OfflineHTML>) || null
        setResource(resource)
        if (resource) {
          // setHTML(resource.data)
          // return;
          // 1.iframe 隔离的方式
          const originUrl = resource.relatedPageUrl || resource.originUrl || ''
          const iframe = document.createElement('iframe')
          // TODO 植入 service worker 来控制网络请求的跨域问题
          iframe.srcdoc =
            '<!DOCTYPE html><html><head></head><body></body></html>'
          iframe.src = originUrl
          iframe.setAttribute('data-pagenote', 'html')
          iframe.style.width = '100%'
          iframe.style.height = '100%'
          iframe.style.backgroundColor = '#ffffff'
          const current = document.querySelector('iframe[data-pagenote]')
          if (current) {
            document.documentElement.removeChild(current)
          }
          document.documentElement.appendChild(iframe)
          iframe?.contentDocument?.write(resource.data || '')

          appendCss(
            [
              `${whoAmI?.origin}/lib/pagenote/5.5.3/pagenote.css`,
              `${whoAmI?.origin}/rollup/pagenote_kit.css`,
            ],
            iframe.contentDocument?.documentElement
          )

          appendScript(
            [
              `${whoAmI?.origin}/lib/whatsElement.iife.js`,
              `${whoAmI?.origin}/lib/pagenote/5.5.3/pagenote.js`,
              `${whoAmI?.origin}/rollup/pagenote_kit.js`,
            ],
            iframe.contentDocument?.documentElement
          )

          setLoaded(true)

          // 2.最原始的植入方式
          //@ts-ignore
          // document.documentElement.innerHTML = resource.data
        }
      })
  }

  function onChangeResourceId(id: string) {
    window.location.href = `${basePath}/ext/offline.html?id=${id}`
  }

  function removeResource() {
    extApi.table
      .remove({
        table: 'html',
        db: 'resource',
        params: [resource?.resourceId || ''],
      })
      .then(function () {
        window.close()
      })
  }

  function downloadHtml() {
    if (resource?.data) {
      contentToFile(resource?.data || '', `${resource?.name || ''}.html`)
    }
  }

  useEffect(
    function () {
      fetchResource();
    },
    [query, whoAmI]
  )

  const withoutId = !query.id && !query.url

  return (
    <RedirectToExt>
      <>
        <Head>
          <script src="/rollup/open_api_bridge.js"></script>
          <title>【pagenote存档网页】{resource?.name}</title>
        </Head>

        {withoutId ? (
            <Achieve />
        ) : resource ? (
          <div className="alert alert-info shadow-lg">
            <div className={'select-none'}>
              <TipInfo tip={'断网也可以访问，永久保存'} />
              <div>
                你正在访问网页（
                <a
                  className={
                    'link link-error max-w-lg overflow-hidden overflow-ellipsis inline-block align-bottom whitespace-nowrap'
                  }
                  href={resource?.originUrl}
                  target={'_blank'}
                >
                  {resource?.originUrl}
                </a>
                ）的离线快照版本。
              </div>
              <div className={'ml-2'}>
                <a href={'https://pagenote.cn/feedback'} target={'_blank'}>
                  <button
                    className={'tooltip tooltip-left btn btn-sm btn-outline'}
                    data-tip={'离线版与在线版内容不一致？'}
                  >
                    反馈
                  </button>
                </a>
              </div>
            </div>
            <div>
              <select
                value={resource?.resourceId}
                onChange={(e) => {
                  onChangeResourceId(e.target.value)
                }}
                className="select select-ghost w-52 max-w-xs"
              >
                {relatedResource.map((item, index) => {
                  const value = dayjs(item?.createAt).format(
                    'YYYY/MM/DD HH:mm:ss'
                  )
                  return (
                    <option
                      key={index}
                      className="step step-primary"
                      value={item.resourceId}
                      data-content={
                        item.resourceId === resource?.resourceId
                          ? '✓'
                          : index + 1
                      }
                    >
                      {value}
                      {/*<span*/}
                      {/*    data-tip={`记录于${dayjs(item.createAt).format('YYYY/MM/DD HH:mm:ss')}`}*/}
                      {/*    className={`tooltip tooltip-bottom badge badge-sm  ${item.resourceId === resource?.resourceId ? 'badge-primary' : 'badge-outline'}`}>*/}
                      {/*    */}
                      {/*</span>*/}
                    </option>
                  )
                })}
              </select>

              {/* The button to open modal */}
              <label htmlFor="remove-modal" className="btn btn-error btn-sm">
                删除此版本
              </label>
              <button
                onClick={downloadHtml}
                className="btn btn-primary btn-sm ml-2"
              >
                下载为HTML文件
              </button>

              {/* Put this part before </body> tag */}
              <input
                type="checkbox"
                id="remove-modal"
                className="modal-toggle"
              />
              <label htmlFor="remove-modal" className="modal cursor-pointer">
                <label
                  className="modal-box relative text-foreground"
                  htmlFor=""
                >
                  <h3 className="text-lg font-bold">删除后不可恢复!</h3>
                  <p className="py-4">
                    仅删除当前离线网页。仍可以在原始网页中查看、管理笔记。
                  </p>
                  <div className="modal-action">
                    <button onClick={removeResource} className="btn btn-error">
                      确认删除!
                    </button>
                  </div>
                </label>
              </label>
            </div>
          </div>
        ) : (
          <div className="alert alert-error shadow-lg">
            没有找到离线网页数据，请检查。
            <a
              className={'btn btn-primary'}
              href={`${basePath}/ext/offline.html`}
            >
              重新选择
            </a>
          </div>
        )}
      </>
    </RedirectToExt>
  )
}
