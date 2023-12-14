import extApi from '@pagenote/shared/lib/pagenote-api'
import useSWR from 'swr'
import { OssCloudConfig } from '../utils/upload'

interface OssConfig {
  key: OssCloudConfig
  cloud_space: string
}

type OssType = 'public' | 'private'

export function fetchUploadToken(type: OssType) {
  return extApi.network
    .pagenote(
      {
        url: '/api/graph/profile',
        method: 'GET',
        data: {
          query: `query{ossKey(spaceType:"${type}"){AccessKeyId,AccessKeySecret,SecurityToken,CloudSpace,bucket,region}}`,
        },
      },
      {
        cacheControl: {
          maxAgeMillisecond: 60 * 1000 * 10,
        },
      }
    )
    .then(function (res) {
      const data = res?.data?.json?.data?.ossKey
      if (!data) {
        return null
      }

      return {
        key: {
          region: data.region,
          accessKeyId: data.AccessKeyId,
          accessKeySecret: data.AccessKeySecret,
          stsToken: data.SecurityToken,
          bucket: data.bucket,
        },
        cloud_space: data.CloudSpace,
      }
    })
}

export default function useOssKey(
  type: OssType
): [OssConfig | undefined | null, boolean, boolean] {
  const { data, isLoading, mutate } = useSWR<OssConfig | null | undefined>(
    '/oss-key/official/' + type,
    () => {
      return fetchUploadToken(type)
    }
  )

  const connected = !!data?.cloud_space

  return [data, isLoading, connected]
}
