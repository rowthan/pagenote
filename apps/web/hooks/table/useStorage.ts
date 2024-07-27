import useSWR from 'swr'
import extApi from '@pagenote/shared/lib/pagenote-api'
import { Collection, dbTableMap } from '../../const/collection'
import { TableStat } from '@pagenote/shared/lib/extApi'

export default function useStorage(
  collection: Collection
): [TableStat, boolean] {
  const { data = { usage: 0, quota: 0, size: 0, totalUsage:  0 }, isLoading } =
    //   @ts-ignore
    useSWR<TableStat>('/storage/info/' + collection, fetchData, {
      fallback: {
        usage: 0,
        quota: 0,
        size: 0,
        totalUsage: 0
      },
    })

  function fetchData() {
    return extApi.table
      .stat({
        ...dbTableMap[collection],
        params: undefined,
      })
      .then(function (res) {
        return res.data || { usage: 0, totalUsage: 0 }
      })
  }

  return [data, isLoading]
}
