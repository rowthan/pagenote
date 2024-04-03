import { user } from '@pagenote/shared/lib/extApi'
import extApi from '@pagenote/shared/lib/pagenote-api'
import useSWR from 'swr'
import Tab = chrome.tabs.Tab;
type WhoAmI = user.WhoAmI & {
  sender?: {
    tab: Tab
  }
}

export default function useWhoAmi(
  initVersion: string = '0.0.0'
): [WhoAmI | undefined | null, boolean] {
  const { data, isLoading, mutate } = useSWR<WhoAmI>('/whoAmI', fetchInfo, {
    fallbackData: {
      version: initVersion,
    },
  })

  function fetchInfo() {
    return extApi.user.getWhoAmI().then(function (res) {
      return res.data || {}
    })
  }

  return [data, isLoading]
}
