import dayjs from 'dayjs'
import extApi from '@pagenote/shared/lib/pagenote-api'
import { unionFetch } from '../utils/fetch'
import { fetchUserInfo } from '../hooks/useUserInfo'

export function createOrder(price?: number) {
  return extApi.network.pagenote({
    url: '/api/graph/site',
    data: {
      mutation: `mutation{active(id:"createOrder",remark:"${price}"){id}}`,
    },
    method: 'POST',
  })
}

export function bindTransition(record: string, amount: number) {
  const recordId = record || dayjs().format('YYYYMMDD_HH')
  fetchUserInfo(true, 1000 * 180)
  return extApi.network.pagenote({
    url: '/api/graph/book',
    data: {
      mutation: `mutation params($transition:TransitionRecord!){bindTransition(transition:$transition){status}}`,
      variables:{
          transition:{
              recordId:recordId,
              amount:amount,
              remark:"custom",
              payTime: `${Date.now()}`
          }
      }
    },
    method: 'POST',
  })
}

export type UpdateProfile = {
  avatar?: string
  nickname?: string
}

export function updateProfile(updateInfo: UpdateProfile) {
    return unionFetch<{
        updateProfile: {
            avatar: string,
            nickname: string
        }
    }>(
        {
            url: '/api/graph/user',
            data: {
                mutation: `mutation makeUpdateConfig($avatar: String, $nickname: String) {updateProfile(avatar:$avatar,nickname:$nickname){avatar,nickname}}`,
                variables: updateInfo,
            },
            method: 'POST',
        },
        {
            timeout: 10 * 1000,
        }
    )
}

const CACHE_DURATION = 60 * 1000 * 10

export function fetchVersions() {
  return extApi.network
    .pagenote(
      {
        url: '/api/graph/site',
        data: {
          query: `query{versions(released:true){released,version,release_time,platform,tags,description,changelog}}`,
        },
        method: 'POST',
      },
      {
        cacheControl: {
          // @ts-ignore
          maxAge: 3600 * 2,
          maxAgeMillisecond: CACHE_DURATION,
        },
      }
    )
    .then(function (res) {
      return res?.data?.json?.data?.versions || []
    })
}

export function fetchVersionDetail(version: string) {
  return extApi.network
    .pagenote(
      {
        url: '/api/graph/site',
        data: {
          query: `query{versionDetail(version:"${version}"){_markdown,version,release_time,platform,tags,description,changelog}}`,
        },
        method: 'POST',
      },
      {
        cacheControl: {
          // @ts-ignore
          maxAge: 3600,
          maxAgeMillisecond: CACHE_DURATION,
        },
      }
    )
    .then(function (res) {
      return res?.data?.json?.data?.versionDetail || null
    })
}

export function getWordInfo(word: string) {
  return fetch(
    `/api/graph/profile?` +
      new URLSearchParams({
        query: `{keyword(keyword:"${word}"){markdown}}`,
      })
  ).then(async function (res) {
    const data = await res.json()
    const keyword = data?.data?.keyword
    if (keyword.json) {
      keyword.json = JSON.parse(keyword.json)
    }
    return keyword
  })
}
