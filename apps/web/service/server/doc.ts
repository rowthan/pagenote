import {isDev} from '../../const/env'
import {databaseList, DEFAULT_BASE_DOC_PATH} from '../../const/notion'
import {getCacheContent} from './cache'
import {NotionDocProp} from "../../components/notion/NotionDoc";
import {getOfficialNotion} from "./notion";
import {GetStaticPathsResult} from "next/types";
import {getNotionDocByIdOrPathFromServer} from "../../pages/api/doc";
import {parsePageId} from "notion-utils";
export interface DocNotion {
  notFound?: boolean,
  props?: NotionDocProp,
  revalidate?: number
}
export async function getNotionDocDetail(id: string, notFound: boolean = true):Promise<DocNotion> {
  // 静态资源 .xxx 不执行查询
  if (/\.js|css|html|php|png|jpg|jsp|txt/.test(id)) {
    return {
      notFound: true,
    }
  }
  try {
    let result =  getCacheContent(id);
    if(!result){
      try{
        result = await getNotionDocByIdOrPathFromServer(id);
        console.log(id,'get from server ::', result)
      }catch (e) {
        console.error(id,'fetch doc detail error')
      }
    }
    const forceEnableCache = (!result || !result.recordMap);
    if(forceEnableCache){ // 开发环境不适用缓存
      result = getCacheContent(id, true);
      console.log(id,'fallback get doc from local .cache')
    }
    if (result?.recordMap) {
      return {
        props: result,
        revalidate: isDev ? 60 : 5 * 60, // 单位 秒
      }
    } else {
      return {
        notFound: true,
      }
    }
  } catch (e) {
    console.error('error', e)
    return {
      notFound: notFound,
      // redirect: {
      //   destination: '/500',
      //   permanent: false,
      // },
    }
  }
}

export async function computeStaticPaths() {
  const pathFromDatasource: { params: {
    paths: string[]
    } }[] = [];
  // 从数据库中获取文章列表
  for(let i=0; i<databaseList.length; i++){
    const dataSource = await getOfficialNotion()?.dataSources.query({
      data_source_id: parsePageId(databaseList[0]),
    })

    dataSource?.results.forEach(function (item) {
      const page = {
        params: {
          paths: [DEFAULT_BASE_DOC_PATH,item.id],
        }
      };
      pathFromDatasource.push(page)
    })
  }

  const result: GetStaticPathsResult = {
    paths: pathFromDatasource,
    // https://nextjs.org/docs/pages/api-reference/functions/get-static-paths#fallback-true
    // fallback: true, // 立即返回，并尝试取重新生成
    // fallback: false, // 直接返回404，不会尝试重新刷新，新增的页面，需要重新部署才会生成
    fallback: 'blocking', // 阻塞响应并重新请求数据
  }
  return result;
}
