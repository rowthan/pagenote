import { enablePagenote, focus } from '../../utils/popup'
import extApi from '@pagenote/shared/lib/pagenote-api'
import { useEffect, useState } from 'react'
import { Step } from '@pagenote/shared/lib/@types/data'
import useTabPagenoteState from 'hooks/useTabPagenoteState'
import { checkIsBrowserBasicUrl } from 'utils/check'
import Tab = chrome.tabs.Tab

export default function LightedTab(props: { tab: Tab; isCurrent: boolean }) {
  const { tab, isCurrent } = props
  const { title, favIconUrl, url, id } = tab
  const [lights, setLights] = useState<Partial<Step>[]>([])
  const [tabState, mutate, isLoading] = useTabPagenoteState(id)

  useEffect(
    function () {
      if (tabState?.connected) {
        fetchLights()
      }
    },
    [tabState]
  )

  function fetchLights() {
    extApi.lightpage
      .queryLights({
        query: {
          $or: [
            {
              url: url,
            },
            {
              pageKey: url,
            },
          ],
        },
        projection: {
          text: 1,
          bg: 1,
        },
      })
      .then(function (res) {
        if (res.success) {
          setLights(res.data.list || [])
        }
      })
  }

  function onClick() {
    return focus(tab)
    if (tabState?.active) {
      focus(tab)
    } else {
      enableInject()
    }
  }

  function enableInject() {
    enablePagenote(id).then(function () {
      mutate()
    })
  }

  let tabClass = isCurrent ? 'bg-primary' : 'bg-gray-200'
  tabClass += tabState?.active ? ' grayscale-0' : ' grayscale'
  const tip = tabState?.active ? '已启动。点击跳转' : '未启动。点击启动'
  const notSupport = checkIsBrowserBasicUrl(url) || !url
  return (
    <button
      className={`${tabClass} flex justify-center btn btn-xs items-center w-full h-full p-0.5 border-none rounded bg-no-repeat bg-contain bg-center`}
      onClick={onClick}
    >
      {notSupport ? (
        <div className={'text-xs text-center text-gray-400'}>🚫</div>
      ) : (
        <div className={'rounded bg-white border'}>
          <img
            width="20px"
            height="20px"
            className={'w-5 h-5'}
            src={favIconUrl}
          />
        </div>
      )}
    </button>
  )
}
