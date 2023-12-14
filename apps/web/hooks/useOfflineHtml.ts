import useSWR from 'swr'
import extApi from '@pagenote/shared/lib/pagenote-api'
import { TableSchemaBasicFields } from '@pagenote/shared/lib/extApi'

export default function useOfflineHtml() {
  // TODO key 发生变化后， 缓存仍然存在，没有被销毁，有内存泄漏的问题
  // 没有共享的场景，不需要 swr
  const { data } = useSWR<
    Record<string, TableSchemaBasicFields & { name?: string }[]>
  >('/offline/', fetchInfo)

  function fetchInfo() {
    return extApi.table
      .group(
        {
          db: 'resource',
          table: 'html',
          params: {
            groupBy: 'relatedPageUrl',
            projection: {
              url: 1,
              name: 1,
              resourceId: 1,
            },
          },
        },
        {
          cacheControl: {
            maxAgeMillisecond: 10 * 1000,
          },
        }
      )
      .then(function (res) {
        return res.data
      })
  }

  return [data]
}
