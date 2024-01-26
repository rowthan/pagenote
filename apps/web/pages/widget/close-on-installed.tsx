import { type ReactNode, useEffect } from 'react'
import useVersionValid from 'hooks/useVersionValid'
import extApi from '@pagenote/shared/lib/pagenote-api'
import useCurrentTab from 'hooks/useCurrentTab'
import { useRouter } from 'next/router'
import useWhoAmi from 'hooks/useWhoAmi'

interface Props {
  children?: ReactNode
}

export default function CloseOnInstalled(props: Props) {
  const { children } = props
  const router = useRouter()
  const [whoAmI] = useWhoAmi();
  const { valid } = useVersionValid(
    router.query?.version?.toString() || '0.28.10'
  )
  const { tab } = useCurrentTab();

  useEffect(function(){
    if(whoAmI && whoAmI.extensionPlatform === "360"){
      extApi.developer.chrome({
        "namespace":"tabs",
        type: "create",
        args: [{
          url: "https://pagenote.cn/360"
        }]
      })
    }
  },[whoAmI])

  useEffect(
    function () {
      const closeMe = valid && tab?.id
      if (closeMe) {
        extApi.developer.chrome({
          namespace: 'tabs',
          type: 'remove',
          args: [tab?.id],
        })
      }
    },
    [valid, tab]
  )

  return <div className="">{children}</div>
}
