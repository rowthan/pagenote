// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { get } from 'lodash'
import { getOfficialNotion } from 'service/server/notion'
import { getCacheContent, writeCacheFile } from 'service/server/cache'

function fetchAllDocs() {
  return getOfficialNotion()
    ?.search({
      filter: {
        property: 'object',
        value: 'page',
      },
      sort: {
        timestamp: 'last_edited_time',
        direction: 'descending',
      },
    })
    .then(function (result) {
      return result
    })
    .catch(function () {
      return null
    })
}

/**
 * 获取所有文档列表
 * */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const result = await fetchAllDocs()
  if (!result || !result.results) {
    return res.status(200).json(null)
  }
  const responseData = result?.results
    .map(function (item) {
      const path = get(item, 'properties.path.url')
      return {
        id: item.id,
        title: get(item, 'properties.title.title.0.plain_text') || null,
        path: path,
        // ...item,
      }
    })
    .sort(function (pre, next) {
      return pre.title ? -1 : 1
    })

  /**只有本地运行才有 fs 的写入能力；线上服务器不具备写文件能力*/
  writeCacheFile('docs', responseData)

  res.status(200).json(responseData)
}
