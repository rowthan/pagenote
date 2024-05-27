import useSWR from 'swr'
import extApi from '@pagenote/shared/lib/pagenote-api'
import { useEffect } from 'react'
import useCurrentTab from "./useCurrentTab";
import {checkInExtensionContext} from "../utils/chrome";

function fetchStatus(tabId?: number) {
  console.log('fetch tab status',tabId)
  if(!tabId){
    return Promise.reject('tab id is undefined')
  }
  // 当标签页无法访问时，如 chrome://newtab，会导致错误日志
  return extApi.developer
    .requestFront({
      type: 'fetchStatus',
      params: undefined,
      header: {
        targetTabId: tabId,
      },
    })
    .then(function (res) {
      return res.data as TabState
    })
}

type TabState = {
  connected: false
  active: false
  enabledCopy: false
  keywords?: string[]
  description?: string
  pageUrl?: string
  pageKey?: string
}
export default function useTabPagenoteState(): [TabState | undefined, () => void, boolean] {
  const {tab} = useCurrentTab();
  const { data, mutate, isLoading } = useSWR<TabState>(
    function () {
      if(!tab?.id){
        throw Error('tab id is undefined')
      }
      return `/tab/state/${tab?.id}${tab.url}${tab.title}`
    },
    function () {
      return fetchStatus(tab?.id)
    }
  )

  useEffect(() => {
    if(checkInExtensionContext()){
      chrome.tabs.onActivated.addListener(function () {
        mutate();
      })
    }
  }, []);

  useEffect(() => {
    if (!data) {
      setTimeout(() => {
        mutate()
      }, 3000)
    }
  }, [data])

  return [data, mutate, isLoading]
}
