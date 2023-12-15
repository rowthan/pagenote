import useSWR from 'swr'
import extApi from '@pagenote/shared/lib/pagenote-api'
import { useEffect } from 'react'

function fetchStatus(tabId?: number) {
  // @ts-ignore
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
}
export default function useTabPagenoteState(
  tabId?: number
): [TabState | undefined, () => void, boolean] {
  const { data, mutate, isLoading } = useSWR<TabState>(
    `/tab/state/${tabId}`,
    function () {
      return fetchStatus(tabId)
    }
  )

  useEffect(() => {
    if (!data) {
      setTimeout(() => {
        mutate()
      }, 3000)
    }
  }, [data])

  return [data, mutate, isLoading]
}
