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

function unwrapRecordMapBlockValue(recordMap: any, blockId: string) {
  const raw = recordMap?.block?.[blockId]
  const v = raw?.value
  if (!v) return undefined

  // notion-client / notion-types versions sometimes wrap block value as:
  // { role, value } or even { value: { role, value } }
  if (v?.properties || v?.type) return v
  if (v?.value?.properties || v?.value?.type) return v.value
  if (v?.value?.value?.properties || v?.value?.value?.type) return v.value.value
  return undefined
}

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
    console.log(`【${databaseList[i]}】从数据库中查询:`,path,'结果：',id)
    if(id){
      console.log('从预设数据库中查询得到ID')
      return id;
    }
  }

  // 查询所有数据源，遍历数据源
  const { results } = await officialNotion.search({
    filter: {
      property: 'object',
      value: 'data_source',
    },
    sort:{
      timestamp: "last_edited_time",
      direction: "descending",
    },
    page_size: 20,
  })
  results.forEach(function (item) {
    // @ts-ignore
    console.log('dataSource::',item.url)
  })

  for (let i = 0; i < results.length; i++) {
    // @ts-ignore
    const { id, properties } = results[i]
    if (!properties.path) {
      continue
    }
    const queryResult = await queryIdByPathInDatabase(id,path);
    if(queryResult){
      console.log('从遍历数据源中获取ID',path,id)
      return queryResult;
    }
  }
  return null
}

async function queryIdByPathInDatabase(databaseId: string, path: string) {
  const officialNotion = getOfficialNotion();
  if(!officialNotion){
    return null;
  }
  try{
    const queryResultFromDataSource = await officialNotion.dataSources.query({
      data_source_id: parsePageId(databaseId) || '',
      filter: {
        or:  [
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
        ]
      },
    })

    return queryResultFromDataSource.results[0]?.id || null;
  }catch (e) {
    console.error(e)
    console.error('error query notion id by path in database ', databaseId)
    return null
  }
}

export async function getNotionDocByIdOrPathFromServer(notionIdOrUrlPath: string) {
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
      return null;
    }
  }

  /**
   * 基于notion 查询用于渲染的结构对象详情（非官方API）
   * */
  notionId = parsePageId(notionId) || ''
  let recordMap
  try {
    recordMap = await getUnOfficialNotion().getPage(notionId)
    if (
      process.env.NODE_ENV === 'development' &&
      !process.env.NOTION_TOKEN &&
      recordMap?.collection &&
      Object.keys(recordMap.collection).length > 0
    ) {
      console.warn(
        '[notion] 页面包含数据库视图，但未设置 NOTION_TOKEN。notion-client 请求 queryCollection 时需要 token_v2，否则本地列表/表格往往为空。请在 apps/web/.env.local 中配置 NOTION_TOKEN。'
      )
    }
    console.log(notionId,'public get notion page',recordMap)
    // 这里会隐藏作者信息，无法验证
    // if(!recordMap.notion_user[WRITER_ID]){
    //   console.log(recordMap.notion_user)
    //   recordMap = null;
    // }
  } catch (e) {
    console.error(e,'fetch recordMap error')
    return null
  }
  /**
   * 为了通过获取 page 的property属性 title path description keywords
   * 非 page 类不做查询，如 collection-page-view
   * */
  let notionPage = null
  const pageBlock = unwrapRecordMapBlockValue(recordMap, notionId)
  if (recordMap && pageBlock?.type === 'page' && getOfficialNotion()) {
    notionPage = await getOfficialNotion()
        ?.pages.retrieve({
          page_id: notionId,
        })
        .catch(function (e) {
          console.warn(e, '获取文章详情失败')
        })
  }
  const properties = pageBlock?.properties
  console.log('properties',properties)
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
  if(recordMap){
    writeCacheFile(notionIdOrUrlPath, responseData)
  }

  return responseData
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const notionIdOrUrlPath = (req.query.id || '').toString()
  // 基于文章ID 或 path 查询详情
  const responseData = await getNotionDocByIdOrPathFromServer(notionIdOrUrlPath);
  if(!responseData){
    return res.status(404);
  }

  // 增加缓存相应头
  const cacheTime = 60 * 30;
  res.setHeader('Cache-Control', `max-age=${cacheTime},public`);
  res.status(200).json(responseData)
}
