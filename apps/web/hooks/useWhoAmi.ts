import { user } from '@pagenote/shared'
import extApi from '@pagenote/shared/pagenote-api'
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
    shouldRetryOnError: true,
    errorRetryCount: 5,
    errorRetryInterval: 500, // 服务器可能延迟启动
    fallbackData: {
      version: initVersion,
    },
  })

  function fetchInfo() {
    return extApi.user.getWhoAmI(undefined,{
      timeout: 100
    }).then(function (res) {
      if(res.data === undefined){
        // 抛出异常，触发重试机制
        throw Error('')
      }
      return res.data || {}
    })
  }

  return [data, isLoading]
}
