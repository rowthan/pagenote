import useSWR from 'swr'
import { Step } from '@pagenote/shared/lib/@types/data'
import extApi from '@pagenote/shared/lib/pagenote-api'

export default function useLights(pageKey: string) {
  // TODO key 发生变化后， 缓存仍然存在，没有被销毁，有内存泄漏的问题
  // 没有共享的场景，不需要 swr
  const { data, isLoading, mutate } = useSWR<Partial<Step>[]>(
    '/lights/' + pageKey,
    fetchInfo
  )

  function fetchInfo() {
    if (!pageKey) {
      return Promise.resolve([])
    }

    return extApi.lightpage
      .queryLights({
        query: {
          pageKey: pageKey,
        },
        pageSize: 9999,
      })
      .then(function (res) {
        return res.data?.list || []
      })
  }

  return {
    data,
    isLoading,
    mutate,
  }
}
