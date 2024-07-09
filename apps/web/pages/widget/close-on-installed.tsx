import { type ReactNode, useEffect } from 'react'
import useVersionValid from 'hooks/useVersionValid'
import extApi from '@pagenote/shared/lib/pagenote-api'
import useCurrentTab from 'hooks/useCurrentTab'
import { useRouter } from 'next/router'
import useWhoAmi from 'hooks/useWhoAmi'
import useFrequency from "hooks/useFrequency";
import {onVisibilityChange} from "@pagenote/shared/lib/utils/document";

interface Props {
  children?: ReactNode
}

export default function CloseOnInstalled(props: Props) {
  const { children } = props
  const router = useRouter()
  const [whoAmI] = useWhoAmi();
  // 版本控制
  const { valid } = useVersionValid('0.29.5')
  const {exceeded} = useFrequency('close-on-installed', 28);
  const { tab } = useCurrentTab();

  useEffect(function(){
    // 360 平台插件过期，公告提示
    if(whoAmI && whoAmI.extensionPlatform === "360" && !valid){
      extApi.developer.chrome({
        "namespace":"tabs",
        type: "create",
        method: 'create',
        arguments: [{
          url: "https://pagenote.cn/360"
        }],
        args: [{
          url: "https://pagenote.cn/360"
        }]
      })
    }
  },[whoAmI])

  function checkClose() {
    // const isPagenoteWeb = tab?.url?.includes('pagenote.cn');
    /**插件满足条件，且当前页面有tabId，自动关闭*/
    const closeMe = valid && tab?.id
    /**频控周期内，自动关闭*/
    if ((closeMe || exceeded)) {
      extApi.developer.chrome({
        namespace: 'tabs',
        type: 'remove',
        method: 'remove',
        args: [tab?.id],
        arguments: [tab?.id]
      })
    }
  }

  useEffect(
    function () {
      checkClose();
      return onVisibilityChange(function () {
        checkClose();
      })
    },
    [valid,exceeded,tab,router]
  )

  return <div className="">{children}</div>
}
