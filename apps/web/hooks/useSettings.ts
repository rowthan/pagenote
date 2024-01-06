import {useState} from 'react'
import  {setting} from "@pagenote/shared/lib/extApi";
import SETTING = setting.SDK_SETTING;
import extApi from "@pagenote/shared/lib/pagenote-api";
import useSWR from "swr";
import {getDefaultSdkSetting} from "@pagenote/shared/lib/pagenote-setting/uitl";

type SDK_SETTING = SETTING

export default function useSettings(): {
  data: SDK_SETTING
  update: (newSet: Partial<SDK_SETTING> | null, callback?: () => void) => void
  loading: boolean
  mutate: () => void
} {
  const [loading, setLoading] = useState<boolean>(false)
  const { data: settings = getDefaultSdkSetting(), mutate } =
    useSWR<SDK_SETTING>('/setting', fetchLocalAndServerSetting, {
      fallbackData: getDefaultSdkSetting(),
    })

  function fetchLocalAndServerSetting() {
    setLoading(true)
    return extApi.setting
      .getUserSetting()
      .then((result) => {
        setLoading(false)
        return result.data || getDefaultSdkSetting()
      })
      .catch(function () {
        return getDefaultSdkSetting()
      })
  }

  function update(newSet: null | Partial<SDK_SETTING>, callback?: () => void) {
    const callbackFun = function () {
      setLoading(false)
      typeof callback === 'function' && callback()
    }
    setLoading(true)
    const newSetting = newSet === null ? getDefaultSdkSetting() : newSet;
    extApi.setting.saveSetting(newSetting).then(function () {
      mutate()
      callbackFun()
    })
  }

  return {
    data: settings,
    update: update,
    loading: loading,
    mutate: mutate,
  }
}
