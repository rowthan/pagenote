import extApi from '@pagenote/shared/lib/pagenote-api'
import useSWR from 'swr'
import dayjs from 'dayjs'

export interface StatInfo {
  lightsCnt: number
  pagesCnt: number
  snapshotsCnt: number
  clipboardCnt: number
  todayNewLights: number
}

export default function useDataStat(): [StatInfo | undefined, () => void] {
  const { data } = useSWR<StatInfo>('/data', fetchInfo)

  async function fetchInfo(): Promise<StatInfo> {
    const lights = await extApi.lightpage.queryLights({
      projection: {
        key: 1,
      },
    })

    const todayLights = await extApi.lightpage.queryLights({
      query: {
        createAt: {
          $gt: new Date(dayjs().format('YYYY-MM-DD')).getTime(),
        },
      },
      projection: {
        key: 1,
      },
    })

    const pages = await extApi.lightpage.queryPages({
      projection: {
        key: 1,
      },
    })

    const snapshots = await extApi.lightpage.querySnapshots({
      projection: {
        key: 1,
      },
    })

    const clipboards = await extApi.table.count({
      db: 'boxroom',
      table: 'clipboard',
      params: {},
    })

    return {
      lightsCnt: lights.data.total,
      pagesCnt: pages.data.total,
      snapshotsCnt: snapshots.data.total,
      todayNewLights: todayLights.data.total,
      clipboardCnt: clipboards.data,
    }
  }

  return [data, fetchInfo]
}
