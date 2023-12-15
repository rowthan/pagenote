import useSWR, { useSWRConfig } from 'swr'
import { WebPage } from '@pagenote/shared/lib/@types/data'
import extApi from '@pagenote/shared/lib/pagenote-api'
import { getPageDetail } from '../service/ext'
import { useEffect } from 'react'

export default function useWebpage(key: string = '') {
  const { cache } = useSWRConfig()
  const swrKey = '/page/detail/' + key
  const { data, isLoading, mutate } = useSWR<Partial<WebPage> | null>(
    swrKey,
    fetchInfo
  )

  useEffect(function () {
    return function () {
      cache.delete(swrKey)
    }
  }, [])

  function fetchInfo() {
    if (!key) {
      return Promise.resolve(null)
    }
    return getPageDetail(key)
  }

  return {
    data,
    isLoading,
    mutate,
    updateServer: function (updateData: Partial<WebPage>) {
      // 缓存内立即更新，然后调用服务端更新，拉取最新
      mutate({
        ...data,
        ...updateData,
      })

      const webpage: Partial<WebPage> = {
        key: key,
        url: key,
        ...data,
        ...updateData,
      }

      extApi.table
        .put({
          db: 'lightpage',
          table: 'webpage',
          params: [webpage],
        })
        .then(function (res) {
          mutate()
        })
    },
  }
}
