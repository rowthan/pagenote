import extApi from '@pagenote/shared/lib/pagenote-api'
import useCurrentTab from 'hooks/useCurrentTab'
import {
  checkIsBrowserAppStore,
  checkIsBrowserBasicUrl,
  checkIsLocalFile,
  checkIsPdf,
  checkIsReadMode,
} from 'utils/check'
import { refreshTab } from 'utils/popup'
import WarnSvg from 'assets/svg/warn.svg'
import useTabPagenoteState from 'hooks/useTabPagenoteState'
import WindowTabs from '../WindowTabs'
import ActionButton from '../../button/ActionButton'
import { LuCopyCheck } from 'react-icons/lu'
import { Bookmark } from 'components/popup/Bookmark'
import PageMemo from '../PageMemo'
import Tagfy from '../../tag/Tagfy'
import Tab = chrome.tabs.Tab

export default function EnableCheck() {
  const [tabState, mutate, isLoading] = useTabPagenoteState()
  const { tab } = useCurrentTab()

  function enableCopy() {
    if (tabState?.enabledCopy) {
      return
    }
    extApi.commonAction
      .injectCodeToPage({
        scripts: ['/lib/enable_copy.js'],
        tabId: tab?.id,
        css: [],
        allFrames: false,
      })
      .then(function (res) {
        mutate()
      })
  }

  return (
    <div className={'mx-auto '}>
      <div className={'p-3'}>
        <Bookmark />
        <PageMemo url={tabState?.pageUrl || tab?.url || ''} />

        <div className={'my-4'}>
          <Tagfy pageKey={tabState?.pageUrl || tab?.url || ''} />
        </div>
      </div>

      <div className={'absolute flex gap-3 bottom-2 left-2 w-full'}>
        <ActionButton
          active={tabState?.enabledCopy}
          onClick={enableCopy}
          tip={'允许复制'}
          keyboard={'enable_copy'}
          className={''}
        >
          <LuCopyCheck />
        </ActionButton>
      </div>
    </div>
  )
}

function Waring(props: { tab?: Tab }) {
  const { tab } = props
  const isHtmlFile = checkIsLocalFile(tab?.url)
  const isBrowserUrl = checkIsBrowserBasicUrl(tab?.url)
  const isAppstoreUrl = checkIsBrowserAppStore(tab?.url)
  const isPdfUrl = checkIsPdf(tab?.url || '')

  const unSupportUrl = isBrowserUrl || isAppstoreUrl || isPdfUrl
  if (unSupportUrl) {
    return (
      <div>
        <h3>点击切换标签页</h3>
        <WindowTabs />
        <div className={'text-gray-400'}>
          <key-word>无法在此网页上使用</key-word>
          运行 PAGENOTE，请切换至其他标签页使用标记功能。
        </div>
      </div>
    )
  }

  const isReadMode = checkIsReadMode(tab?.url)
  if (isReadMode) {
    return (
      <div>
        <WindowTabs />
        <div className={'text-gray-400'}>
          不可在阅读模式下工作。
          <div className={'text-sm'}>
            请切换至其他标签页，或退出阅读模式后使用 PAGENOTE。
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="alert alert-warning shadow-lg my-4">
      <div>
        <WarnSvg className="text-warning fill-current flex-shrink-0 h-6 w-6" />
        <div>
          <div className={'text-lg'}>此标签页无法与PAGENOTE联通</div>

          {isHtmlFile ? (
            <div className={'text-sm'}>
              请授权
              <a
                href="https://page-note.notion.site/ce1300d2471b4391946bd1a7c281758f#1a1a1746bae74d6b8f21f9d8b5a77434"
                className={'link'}
                target={'_blank'}
                rel="noreferrer"
              >
                「允许访问文件网址」
              </a>
              后刷新重新尝试。
            </div>
          ) : (
            <div className={'text-sm'}>
              {isBrowserUrl ? (
                <div className={'text-red-500'}>
                  浏览器插件无法在此类页面上使用：
                  <div className={'text-xs break-all'}>{tab?.url}</div>
                </div>
              ) : (
                <div>
                  <a
                    className="link"
                    onClick={() => {
                      refreshTab(tab)
                    }}
                  >
                    请刷新页面
                  </a>{' '}
                  后重试
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
