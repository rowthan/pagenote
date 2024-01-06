import { Step, WebPage } from '@pagenote/shared/lib/@types/data'
import { QueryValue } from '@pagenote/shared/lib/@types/database'
import extApi from '@pagenote/shared/lib/pagenote-api'
import set from 'lodash/set'
import get from 'lodash/get'
// import { html } from '@pagenote/shared/lib/extApi'
// import OfflineHTML = html.OfflineHTML

const LIGHT_PLACE_KEY = 'plainData.steps'

function mergeWebpage(
  webpage: Partial<WebPage>[],
  lights: Partial<Step>[]
): Partial<WebPage>[] {
  const webpageMap = new Map<string, Partial<WebPage>>()
  webpage.forEach(function (item) {
    webpageMap.set(item.key as string, item)
  })
  lights.forEach(function (item) {
    const tempPage = webpageMap.get(item.pageKey as string)
    if (tempPage) {
      const currentSteps = get(tempPage, LIGHT_PLACE_KEY) || []
      currentSteps.push(item as Step)
      set(tempPage, LIGHT_PLACE_KEY, currentSteps)
    } else {
      webpageMap.set(item.pageKey || '', {
        key: item.pageKey,
        plainData: {
          steps: [item as Step],
        },
      })
    }
  })
  const result: Partial<WebPage>[] = []
  webpageMap.forEach(function (item) {
    result.push(item)
  })

  return result
}

const MAX_AGE = 3600 * 1000 // 1小时缓存有效
const RUN_AFTER = [0, 30 * 1000] // 30秒后执行
async function searchInPage(keyword: string, operation: '$or' | '$and') {
  const regex = '.*' + keyword + '.*'

  const keys: (keyof WebPage)[] = [
    'title',
    'url',
    'key',
    'categories',
    'description',
  ]
  const orFilter: {
    // eslint-disable-next-line no-unused-vars
    [key in keyof WebPage]?: QueryValue
  }[] = keys.map(function (key) {
    return {
      [key]: {
        $regex: regex,
        $options: 'ig',
      },
    }
  })

  // 异步搜索
  const result = await extApi.lightpage.queryPages(
    {
      query: {
        deleted: false,
        [operation]: orFilter,
      },
      pageSize: 1000,
      sort: {
        updateAt: -1,
      },
    },
    {
      cacheControl: {
        maxAgeMillisecond: MAX_AGE,
      },
      scheduleControl: {
        runAfterMillisecond: RUN_AFTER,
      },
    }
  )

  return result?.data?.list || []
}

async function searchInLight(keyword: string, operation: '$or' | '$and') {
  const regex = '.*' + keyword + '.*'
  const keys: (keyof Step)[] = ['text', 'tip']

  const orLightFilter: {
    // eslint-disable-next-line no-unused-vars
    [key in keyof Step]?: QueryValue
  }[] = keys.map(function (key) {
    return {
      [key]: {
        $regex: regex,
        $options: 'i',
      },
    }
  })

  const lightResult = await extApi.table.query(
    {
      db: 'lightpage',
      table: 'light',
      params: {
        //@ts-ignore
        query: {
          deleted: false,
          [operation]: orLightFilter,
        },
        pageSize: 1000,
        sort: {
          updateAt: -1,
        },
      },
    },
    {
      cacheControl: {
        maxAgeMillisecond: MAX_AGE,
      },
      scheduleControl: {
        runAfterMillisecond: RUN_AFTER,
      },
    }
  )
  return lightResult?.data?.list || []
}

// async function searchInHTML(keyword: string, operation: '$or' | '$and') {
//   const regex = '.*' + keyword + '.*'
//   const keys: (keyof OfflineHTML)[] = ['name']
//   const orHtmlFilter: {
//     [key in keyof OfflineHTML]?: QueryValue
//   }[] = keys.map(function (key) {
//     return {
//       [key]: {
//         $regex: regex,
//         $options: 'ig',
//       },
//     }
//   })
//
//   const htmlResult = await extApi.html.query(
//     {
//       query: {
//         deleted: false,
//         [operation]: orHtmlFilter,
//         contentType: ContentType.html,
//         // name:{
//         //     $regex: regex,
//         //     $options: "i"
//         // }
//       },
//       projection: {
//         data: -1,
//       },
//       sort: {
//         updateAt: -1,
//       },
//     },
//     {
//       cacheControl: {
//         maxAgeMillisecond: MAX_AGE,
//       },
//       scheduleControl: {
//         runAfterMillisecond: RUN_AFTER,
//       },
//     }
//   )
//
//   console.log(htmlResult, 'html result')
//   return htmlResult.data.list || []
//
//   // // console.log('html result', htmlResult)
// }

export async function searchInExt(
  keywords: string,
  // eslint-disable-next-line no-unused-vars
  callback: (list: Partial<WebPage>[]) => void
) {
  const words = keywords.trim().split(/\s+/)

  const dataMap: {
    light: Record<string, Partial<Step>>
    page: Record<string, Partial<WebPage>>
  } = {
    light: {},
    page: {},
  }

  const markMap: {
    light: Record<string, number[]>
    page: Record<string, number[]>
  } = {
    light: {},
    page: {},
  }

  function mark(
    type: 'light' | 'page',
    id: string,
    index: number,
    value: 0 | 0.5 | 1
  ) {
    markMap[type][id] = markMap[type][id] || new Array(words.length).fill(0)
    markMap[type][id][index] = value
  }

  const tasks = []
  for (let i = 0; i < words.length; i++) {
    const keyword = (words[i] || '').trim()
    // 异步搜索
    tasks.push(
      searchInPage(keyword, '$or').then(function (pageResult) {
        // 单个关键词，立刻返回
        if (words.length === 1) {
          callback(pageResult)
        }
        pageResult.forEach(function (item) {
          const key: string = item.key || item.url || ''
          mark('page', key, i, 1)
          dataMap.page[key] = item
        })
      })
    )

    tasks.push(
      searchInLight(keyword, '$or').then(function (lights) {
        lights.forEach(function (item) {
          const key: string = item.key || item.url || ''
          mark('light', key, i, 1)
          dataMap.light[key] = item
          if (item.pageKey) {
            mark('page', item.pageKey, i, 0.5)
          }
        })
      })
    )
  }

  await Promise.all(tasks)

  const pageList = []
  const lightList = []
  for (let pageKey in markMap.page) {
    const matched = markMap.page[pageKey].every(function (value) {
      return value && value > 0
    })
    if (matched && dataMap.page[pageKey]) {
      pageList.push(dataMap.page[pageKey])
    }
  }

  for (let lightKey in markMap.light) {
    const matched = markMap.light[lightKey].every(function (value, index) {
      if (value && value > 0) {
        return true
      }

      const pageKey = dataMap.light[lightKey].pageKey
      if (pageKey) {
        const pageMatched = markMap.page[pageKey][index] > 0
        return pageMatched
      }
    })
    if (matched && dataMap.light[lightKey]) {
      lightList.push(dataMap.light[lightKey])
    }
  }

  // 有优化空间
  const merge = mergeWebpage(pageList, lightList)

  const list = merge.sort(function (pre, next) {
    const prePageMatched = markMap.page[pre.key || '']?.reduce(function (
      pre,
      next
    ) {
      return pre + next
    })
    const nextPageMatched = markMap.page[next.key || '']?.reduce(function (
      pre,
      next
    ) {
      return pre + next
    })

    if (prePageMatched !== nextPageMatched) {
      return prePageMatched > nextPageMatched ? -1 : 1
    }

    return (pre.plainData?.steps || [])?.length >
      (next.plainData?.steps || [])?.length
      ? -1
      : 1
  })

  callback(list)

  // searchInHTML(keywords).then(function(result){
  //     result.forEach(function(){

  //     })
  // })
}

export function getPageDetail(key: string) {
  return extApi.lightpage
    .getLightPageDetail({
      key: key,
    })
    .then(function (res) {
      return res.data
    })
}
