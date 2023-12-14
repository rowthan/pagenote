import { type ReactNode, useEffect } from 'react'
import useVersionValid from 'hooks/useVersionValid'
import extApi from '@pagenote/shared/lib/pagenote-api'
import useCurrentTab from 'hooks/useCurrentTab'
import { useRouter } from 'next/router'
import dayjs from 'dayjs'

interface Props {
  children?: ReactNode
}

const LOG_CLOSE_ON_INSTALLED = 'log_close_on_installed'
export default function CloseOnInstalled(props: Props) {
  const { children } = props
  const router = useRouter()
  const { valid } = useVersionValid(
    router.query?.version?.toString() || '0.27.0'
  )
  const { tab } = useCurrentTab()

  useEffect(
    function () {
      const flag = localStorage.getItem(LOG_CLOSE_ON_INSTALLED)
      // 一天最多只提示一次
      const today = dayjs().format('YYYY-MM-DD')
      const closeMe = flag === today || (router.query && valid && tab?.id)

      if (closeMe) {
        localStorage.setItem(LOG_CLOSE_ON_INSTALLED, today)
        extApi.developer.chrome({
          namespace: 'tabs',
          type: 'remove',
          args: [tab?.id],
        })
      }
    },
    [valid, tab, router.query]
  )
  return <div className="">{children}</div>
}
