import { type ReactNode, useEffect } from 'react'
import useWhoAmi from 'hooks/useWhoAmi'
import useCurrentTab from '../../hooks/useCurrentTab'
import extApi from '@pagenote/shared/lib/pagenote-api'

interface Props {
  children?: ReactNode
}

export default function Rate(props: Props) {
  const { children } = props
  const [whoAmI] = useWhoAmi()
  const { tab } = useCurrentTab()
  useEffect(
    function () {
      console.log(tab, whoAmI)
      if (whoAmI?.extensionStoreUrl) {
        const args = [
          tab?.id,
          {
            url: whoAmI.extensionStoreUrl,
          },
        ]
        extApi.developer.chrome({
          namespace: 'tabs',
          type: 'update',
          method: 'update',
          args: args,
          arguments: args,
        })
      }
    },
    [tab, whoAmI]
  )
  return <div className="">{children}</div>
}
