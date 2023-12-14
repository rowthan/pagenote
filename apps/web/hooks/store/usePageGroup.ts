import extApi from '@pagenote/shared/lib/pagenote-api'
import { useContextSelector } from 'use-context-selector'
import { context } from '../../store/ContextProvider'
import { useEffect, useState } from 'react'
import { Query } from '@pagenote/shared/lib/@types/database'
import { WebPage } from '@pagenote/shared/lib/@types/data'

export type PageGroup = {
  groupName: string
  groupCnt?: number
  query: object
}

export default function usePageGroup() {
  const [state, setState] = useContextSelector(context, (v) => v)

  const [data, setData] = useState<PageGroup[]>([])

  const groupType = state.groupType || 'categories'

  function fetchGroup() {
    extApi.page
      .group(
        {
          groupBy: groupType,
        },
        {
          cacheControl: {
            maxAgeMillisecond: 3600 * 1000,
          },
          scheduleControl: {
            runAfterMillisecond: [0, 10 * 1000],
          },
        }
      )
      .then(async function (res8) {
        console.log(res8, 'res8')
        const data = res8.data
        const group: PageGroup[] = []

        switch (groupType) {
          case 'categories':
            for (let i in data) {
              group.push({
                groupName: i,
                query: {
                  // 直接保存筛选条件，更通用，方便加入智能分组
                  [groupType]: {
                    $in: [i],
                  },
                },
                groupCnt: data[i].length,
              })
            }
            const allQuery: Query<WebPage> = {
              categories: {
                $exists: true,
              },
            }
            const result = await extApi.page.count(allQuery, {
              cacheControl: {
                maxAgeMillisecond: 3600 * 1000,
              },
              scheduleControl: {
                runAfterMillisecond: [0, 10 * 1000],
              },
            })

            console.log(result, 'result')

            group.unshift({
              groupName: '所有',
              query: allQuery,
              groupCnt: result.data,
            })

            break
          default:
            for (let i in data) {
              group.push({
                groupName: i,
                query: {
                  // 直接保存筛选条件，更通用，方便加入智能分组
                  [groupType]: i,
                },
                groupCnt: data[i].length,
              })
            }
            break
        }

        setData(group)
        if (!state.groupFilterName) {
          setState({
            groupFilterName: group[0].groupName,
          })
        }
      })
  }

  useEffect(
    function () {
      fetchGroup()
    },
    [groupType]
  )

  return [data]
}
