import { fetchUploadToken } from '../hooks/useOssKey'
import type OSS from 'ali-oss'

function getClient(config: OssCloudConfig): OSS {
  // @ts-ignore
  return new window.OSS(config)
}

export function getPublicUploadClient() {
  return fetchUploadToken('public').then(function (data) {
    if (!data) {
      return {
        client: null,
        cloud_space: '',
      }
    }
    const client = getClient(data.key)
    return {
      client: client,
      cloud_space: data.cloud_space,
    }
  })
}

export type OssCloudConfig = {
  region: string
  accessKeyId: string
  accessKeySecret: string
  bucket: string
  stsToken?: string
}

export function checkCloudPut(
  config: OssCloudConfig
): Promise<{ name?: string; content?: string }> {
  const client = getClient(config)

  const CheckFile = {
    filename: '.connect-text.txt',
    content: `hello it works. at ${new Date().toString()}`,
  }
  return client
    .put(CheckFile.filename, new Blob([CheckFile.content]))
    .then(async function (res) {
      console.log('上传检测结果')
      return {
        name: res.name,
        content: CheckFile.content,
      }
    })
    .catch(function (reason) {
      console.error(reason)
      return {}
    })
}
