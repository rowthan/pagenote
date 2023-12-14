import { Collection, dbTableMap } from 'const/collection'
import useSWR from 'swr'
import extApi from '@pagenote/shared/lib/pagenote-api'

export default function useKeys<T>(collection: Collection, key: string) {
  const { data = [], mutate } = useSWR(function () {
    return `/table/keys/${collection}/${key}`
  }, fetchData)

  function fetchData() {
    return extApi.table
      .keys(
        {
          ...dbTableMap[collection],
          params: {
            //   @ts-ignore todo
            key: key,
          },
        },
        {
          cacheControl: {
            maxAgeMillisecond: 1000 * 60 * 30,
          },
        }
      )
      .then(function (res) {
        return res.data
      })
  }

  return [data as T]
}

