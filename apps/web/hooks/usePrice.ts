import { useEffect, useState } from 'react'
import extApi from '@pagenote/shared/lib/pagenote-api'
import { PlanInfo } from '../typing'
import { unionFetch } from '../utils/fetch'

export default function usePrice() {
  const [data, setData] = useState<PlanInfo[]>(function () {
    const plans: PlanInfo[] = [
      {
        title: '终身VIP',
        description: '没有时限的VIP用户。',
        price: 125,
        duration: '终身',
        unit: '元(累计)',
        bg: 'indigo',
        role: 2,
        deduct: true,
        final: true,
        rights: [],
        payments: [],
      },
    ]
    return plans
  })

  useEffect(function () {
    unionFetch<{
      plans: { dataJson: string }
    }>(
      {
        url: '/api/graph/book',
        method: 'GET',
        data: {
          query: `query{plans{dataJson}}`,
        },
      },
      {
        cacheControl: {
          maxAgeMillisecond: 60 * 60 * 24 * 1000,
        },
      }
    ).then(function (res) {
      const dataJson = res?.data?.plans?.dataJson
      if (dataJson) {
        const plans: PlanInfo[] = JSON.parse(dataJson)
        setData(plans)
      }
    })
  }, [])

  return [data]
}
