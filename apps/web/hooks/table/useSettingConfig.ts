import extApi from '@pagenote/shared/lib/pagenote-api'
import useSWR from 'swr'
import { config } from '@pagenote/shared'
import { configArrayToObject, objectToConfigArray } from '@pagenote/shared/lib/pagenote-config/utils'

export default function useSettingConfig(
  rootKey: string,
) {
  const {
    data = [],
    mutate,
  } = useSWR<config.ConfigObject>(function () {
    return `/collection/${rootKey}`
  }, fetchData)

  function fetchData() {
    return extApi.table
      .query({
        db:"setting",
        table:"config",
        params: {
            query:{
                rootKey: rootKey
            }
        },
      })
      .then(function (res) {
        const configList = (res.data?.list || []) as config.ConfigItem[];
        const object = configArrayToObject(configList);
        return object;
      })
  }

  function updateData(object: config.ConfigObject){
    const configList = objectToConfigArray(object);
    return extApi.table.put({
        db:"setting",
        table:"config",
        params: configList,
    }).then(function(){
        mutate();
    })
  }

  return [data,updateData]
}
