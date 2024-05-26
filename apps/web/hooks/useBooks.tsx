import extApi from '@pagenote/shared/lib/pagenote-api'
import useSWR from 'swr'
import dayjs from 'dayjs'
import useUserInfo from "./useUserInfo";

interface Book {
  endTime: number
  startTime: number
  duration: number
  remark: string
  giftDays: number
}

type BookInfo = {
  list: Book[]
  expiredAt?: Date | undefined
  expiredTip?: string
}
export default function (): [BookInfo, () => void] {
  const [userinfo] = useUserInfo()
  const {
    data = {
      list: [],
      expiredAt: undefined,
      expiredTip: '',
    },
    mutate,
  } = useSWR<BookInfo>(function () {
    if (!userinfo?.profile?.uid) {
      throw Error('wait for uid')
    }
    return '/books/' + userinfo?.profile?.uid
  }, () => fetchBookList(2 * 60 * 1000), {
    fallbackData: {
      list: [],
      expiredAt: undefined,
      expiredTip: '',
    },
  })

  function fetchBookList(cacheDuration?: number) {
    return extApi.network
      .pagenote(
          {
            url: '/api/graph/book',
            method: 'GET',
            data: {
              random: userinfo?.profile?.role,
              query: `query{books{startTime,endTime,duration,remark,giftDays}}`,
            },
          },
        {
          cacheControl: {
            maxAgeMillisecond: cacheDuration || 0,
          },
          scheduleControl: {
            runAfterMillisecond: [0, 1000 * 60],
          },
        }
      )
      .then(function (res) {
        const bookList = res.data?.json?.data.books
        if (Array.isArray(bookList)) {
          const endTime = bookList[0].endTime
          let tip = endTime ? dayjs(endTime).format('YYYY-MM-DD') : '-'
          if ((userinfo?.profile?.role || 0) > 9) {
            tip = '终身'
          }
          return {
            list: bookList,
            expiredAt: endTime ? new Date(endTime) : undefined,
            expiredTip: tip,
          }
        }
        return {
          list: [],
          expiredTip: '-',
        }
      })
  }

  return [data, fetchBookList]
}
