import { config } from '@pagenote/shared/lib/extApi'
import extApi from '@pagenote/shared/lib/pagenote-api'
import useSWR from 'swr'
import {
  configArrayToObject,
  objectToConfigArray,
} from '@pagenote/shared/lib/pagenote-config/utils'
import ConfigItem = config.ConfigValue
import { get } from 'lodash'

export default function useSettingConfig<T extends ConfigItem>(
  rootKey: string = 'global'
): [T | null, (input: any) => Promise<void>] {
  const { data = null, mutate } = useSWR<T | null>(
    '/user-config/' + rootKey,
    fetchUserConfig,
    {
      fallback: {},
    }
  )

  function fetchUserConfig() {
    return extApi.table
      .query({
        db: 'setting',
        table: 'config',
        params: {
          query: {
            rootKey: rootKey,
          },
        },
      })
      .then(function (res) {
        if (res.success) {
          //@ts-ignore
          const object = configArrayToObject(res?.data?.list || [])
          return get(object, rootKey) as unknown as T
        }
        return null
      })
      .catch(function () {
        return null
      })
  }

  function update(input: T) {
    const data = {
      [rootKey]: input,
    }
    // @ts-ignore
    const objectArray = objectToConfigArray(data)
    // mutate({
    //   ...(data || {}),
    //   ...input,
    // })
    return extApi.table
      .put({
        db: 'setting',
        table: 'config',
        params: objectArray,
      })
      .then(function (res) {
        mutate()
      })
  }

  return [data, update]
}
