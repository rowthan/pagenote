import { unionFetch } from '../utils/fetch'
import { keys } from 'lodash'

type ReceiveGiftRequest = { email?: string; giftId: string }
export const receiveGiftItem = function (
  info: ReceiveGiftRequest,
) {
  return unionFetch<{ gotGift: { received: boolean } }>(
    {
      url: '/api/graph/book',
      method: 'POST',
      data: {
        mutation: `mutation{gotGift(giftId:"${info.giftId}",email:"${info.email}"){received}}`,
      },
    },
  )
}

export const demoGiftDetail = {
  giftId: '',
  giftName: '',
  description: '',
  qualificationDes: '',
  image: '',
  expiredAt: new Date(),
  limit: 9,
  bookDays: 1,
  paidDays: 1,
  received: false,
  score: 1,
  userGiftKey: 'bookDays',
}
export type GiftDetail = typeof demoGiftDetail

export const fetchGiftItem = function (
  giftId: ReceiveGiftRequest['giftId'],
) {
  return unionFetch<{ gift: GiftDetail }>(
    {
      url: '/api/graph/book',
      method: 'GET',
      data: {
        query: `{gift(giftId:"${giftId}"){${keys(demoGiftDetail).toString()}}}`,
      },
    },
    {
      cacheControl: {
        maxAgeMillisecond: 10 * 1000,
      },
    }
  )
}
