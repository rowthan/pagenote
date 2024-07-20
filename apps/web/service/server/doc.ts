import { isDev } from '../../const/env'
import { DEFAULT_BASE_DOC_PATH } from '../../const/notion'
import { getCacheContent } from './cache'

// 制定获取 notion 数据源的接口；默认请求自身服务。
const WEB_HOST = process.env.WEB_HOST

export async function getNotionDocDetail(id: string, notFound: boolean = true) {
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
        result = await(await fetch(`${WEB_HOST}/api/doc?id=${id}`)).json();
        console.log(id,'get from server ',WEB_HOST, result)
      }catch (e) {
        console.error(id,'fetch doc detail error')
      }
    }
    const forceEnableCache = !isDev && (!result || !result.recordMap);
    if(forceEnableCache){
      result = getCacheContent(id, true);
      console.log(id,'fallback get doc from local .cache')
    }
    if (result?.recordMap) {
      return {
        props: result,
        revalidate: isDev ? 60 : 2 * 60 * 60, // 单位 秒
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
  let pages: { path?: string; title?: string; id: string }[] = []
  try {
    pages =
      getCacheContent('docs') ||
      await(await fetch(`${WEB_HOST}/api/docs`)).json() ||
      getCacheContent('docs', true)
  } catch (e) {
    console.error(e, 'getStaticPaths 请检查 /api/doc')
  }

  const paths = pages
    .filter(function (item) {
      return !!item.path
    })
    .slice(0, isDev ? 5 : 10) // 最多静态化
    .map(function (item) {
      let paths = [DEFAULT_BASE_DOC_PATH, item.id] //[`/${DEFAULT_BASE_DOC_PATH}/${item.id}`]
      // 如果有自定义路径，解析后封装至数组
      if (item.path) {
        item.path = item.path[0] === '/' ? item.path : '/' + item.path
        paths = item.path.split('/').filter(function (item) {
          return !!item
        }) // .replace(/^\/.*?\//, '')
        console.log(paths, item.id, item.path)
      }
      return {
        params: {
          paths: paths,
        },
      }
    })
  console.log(paths.length, '/', pages.length, '待静态化页面数量')

  return {
    paths: paths,
    // https://nextjs.org/docs/pages/api-reference/functions/get-static-paths#fallback-true
    // fallback: true, // 立即返回，并尝试取重新生成
    // fallback: false, // 直接返回404，不会尝试重新刷新，新增的页面，需要重新部署才会生成
    fallback: 'blocking', // 阻塞响应并重新请求数据
  }
}
