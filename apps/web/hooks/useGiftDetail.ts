import useSWR from 'swr'
import { fetchGiftItem, GiftDetail, receiveGiftItem } from '../service/gift'

export function fetchData(id: string) {
  return fetchGiftItem(id).then(function (res) {
    return res?.data?.gift || null
  })
}

export default function useGiftDetail(id: string) {
  const data = useSWR<GiftDetail | null>(
    '/gift/' + id,
    () => {
      if (!id) {
        return Promise.resolve(null)
      }
      return fetchData(id)
    },
    {
      fallbackData: null,
    }
  )

  function receiveGift(userInfo: { email?: string }) {
    return receiveGiftItem(
      {
        giftId: id,
        email: userInfo?.email || '',
      },
    ).then(function (res) {
      // @ts-ignore
      data.mutate({
        ...(data.data || {}),
        received: res?.data?.gotGift?.received === true,
      })
      return res
    })
  }

  return {
    ...data,
    receiveGift: receiveGift,
  }
}
