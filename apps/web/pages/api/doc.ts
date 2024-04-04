// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'
import {get} from 'lodash'
import {parsePageId} from 'notion-utils'
import {
  getOfficialNotion,
  getUnOfficialNotion,
} from '../../service/server/notion'
import { writeCacheFile } from '../../service/server/cache'
import {databaseList, SEO_REVERT_MAP} from '../../const/notion'


/**
 * SEO 优化处理：
 * 根据 path ，搜索对应的文档
 * */
async function fetchDocByPath(path: string): Promise<string | null> {
  const officialNotion = getOfficialNotion()
  if (!officialNotion) {
    console.error('未初始化 Notion 客户端')
    return null
  }
  for(let i=0; i<databaseList.length; i++){
    const id = await queryIdByPathInDatabase(databaseList[i],path);
    if(id){
      return id;
    }
  }

  const { results } = await officialNotion.search({
    filter: {
      property: 'object',
      value: 'database',
    },
    sort:{
      timestamp: "last_edited_time",
      direction: "descending",
    },
    page_size: 20,
  })
  console.log(results.length,'database')
  results.forEach(function (item) {
    // @ts-ignore
    console.log('database::',item.url)
  })

  for (let i = 0; i < results.length; i++) {
    // @ts-ignore
    const { id, properties } = results[i]
    if (!properties.path) {
      continue
    }
    const queryResult = await queryIdByPathInDatabase(id,path);
    return queryResult;
  }

  return null
}

async function queryIdByPathInDatabase(databaseId: string, path: string) {
  const officialNotion = getOfficialNotion();
  if(!officialNotion){
    return null;
  }
  try{
    const queryResult = await officialNotion.databases.query({
      database_id: databaseId,
      filter: {
        or: [
          {
            property: 'path',
            type: 'url',
            url: {
              equals: path,
            },
          },
          {
            property: 'path',
            type: 'url',
            url: {
              equals: '/' + path,
            },
          },
          {
            property: 'path',
            type: 'url',
            url: {
              equals: path.replace(/^\//, ''),
            },
          },
        ],
      },
      page_size: 1,
    })
    if (queryResult.results && queryResult.results[0]) {
      return queryResult.results[0].id || null;
    }
  }catch (e) {
    console.error(e)
    console.error('error query notion id by path in database ', databaseId)
    return null
  }

  return null;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const notionIdOrUrlPath = (req.query.id || '').toString()
  // 基于文章ID 或 path 查询详情
  let notionId = notionIdOrUrlPath
  /**
   * 如果是 URL path，需要查询对应的 notion id
   * */
  if (!/^(\w|\d){8}/.test(notionIdOrUrlPath) || notionIdOrUrlPath.length < 20) {
    notionId =
      SEO_REVERT_MAP[notionIdOrUrlPath] ||
      (await fetchDocByPath(notionIdOrUrlPath)) ||
      ''
    if (!notionId) {
      console.error(notionIdOrUrlPath, 'no page')
      // throw Error('找不到 notion 页面')
      return res.status(404).json(null)
    }
  }

  /**
   * 基于notion 查询用于渲染的结构对象详情（非官方API）
   * */
  notionId = parsePageId(notionId)
  let recordMap
  try {
    recordMap = await getUnOfficialNotion().getPage(notionId)
  } catch (e) {
    console.error(e,'fetch recordMap error')
    return res.status(200).json(null)
  }
  /**
   * 为了通过获取 page 的property属性 title path description keywords
   * 非 page 类不做查询，如 collection-page-view
   * */
  let notionPage = null
  if (recordMap.block[notionId]?.value.type === 'page' && getOfficialNotion()) {
    notionPage = await getOfficialNotion()
      ?.pages.retrieve({
        page_id: notionId,
      })
      .catch(function (e) {
        console.warn(e, '获取文章详情失败')
      })
  }
  const properties = recordMap?.block[notionId]?.value?.properties
  const title = get(properties, 'title.0.0') || null
  // const description = get(properties, 'description.0.0') || null;
  // console.log(notionPage.properties,'notionPage')
  const path = get(notionPage, 'properties.path.url') || null
  const description =
    get(notionPage, 'properties.description.rich_text[0].plain_text') || null
  const keywords = (
    get(notionPage, 'properties.keywords.multi_select') || []
  ).map(function (item) {
    //@ts-ignore
    return item.name || ''
  })

  /**格式化相应对象*/
  const responseData = {
    recordMap: recordMap,
    title: title,
    path: path,
    description: description,
    keywords: keywords,
  }

  /**只有本地运行才有 fs 的写入能力；线上服务器不具备写文件能力*/
  writeCacheFile(notionIdOrUrlPath, responseData)

  res.status(200).json(responseData)
}
