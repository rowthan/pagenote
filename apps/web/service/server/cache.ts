import fs from 'fs'
import * as path from 'path'

export function writeCacheFile(id: string, content: Object) {
  const filePath = path.join(process.cwd(), '.cache', `${id}.json`)
  const directoryPath = path.dirname(filePath)

  if (process.env.NODE_ENV === 'development') {
    fs.mkdir(directoryPath, { recursive: true }, function () {
      fs.writeFile(
        filePath,
        JSON.stringify(content),
        {
          encoding: 'utf8',
        },
        function (res) {
          console.log('cached success:', filePath)
        }
      )
    })
  }
}

/**
 * isFallback： 不启用缓存的情况下，notion 相应失败的兜底处理
 * */
export function getCacheContent(id: string, forceEnableCache = false) {
  const cacheFileName = path.join(process.cwd(), '.cache', `${id}.json`)
  if (process.env.ENABLE_CACHE || forceEnableCache) {
    const exists = fs.existsSync(cacheFileName)
    console.log(cacheFileName, 'check local cache: ', exists)
    if (exists) {
      const cacheData = fs.readFileSync(cacheFileName, {
        encoding: 'utf-8',
      })
      if (cacheData) {
        console.log('response with cache:', cacheFileName)
        return cacheData ? JSON.parse(cacheData) : null
      }
    }
  }
}
