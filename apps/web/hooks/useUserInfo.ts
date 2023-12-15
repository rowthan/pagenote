import {user} from '@pagenote/shared/lib/extApi'
import extApi from '@pagenote/shared/lib/pagenote-api'
import useSWR from 'swr'
import User = user.User

type UserInfo = {
    leftPermanent?: number
} & User & {
    profile: {
        role?: number
    }
}

export function fetchUserInfo(forceRefresh: boolean = false, timeout = 0) {
  return extApi.user
    .getUser(
      { refresh: forceRefresh },
      {
        scheduleControl: {
          runAfterMillisecond: [timeout],
        },
      }
    )
    .then(function (res) {
      return (res.data || null) as UserInfo
    })
}

export default function useUserInfo(): [
        UserInfo | undefined,
    () => void,
    (token: string | null) => void
] {
  const { data, mutate } = useSWR<UserInfo>('/user', () => {
    return fetchUserInfo(false)
  })

  function setToken(token: string | null) {
    // @ts-ignore
    return extApi.user.setUserToken(token).then(function (res) {
      mutate()
      fetchUserInfo(true).then(function () {
        mutate()
      })
    })
  }

  return [data, mutate, setToken]
}
