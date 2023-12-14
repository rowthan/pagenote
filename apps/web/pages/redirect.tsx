import { type ReactNode, useEffect } from 'react'
import { useRouter } from 'next/router'
import useWhoAmi from '../hooks/useWhoAmi'

interface Props {
  children?: ReactNode
}

export default function Redirect(props: Props) {
  const { children } = props
  const { query } = useRouter()
  const [whoAmI] = useWhoAmi()

  useEffect(
    function () {
      const to = query.to
      if (to) {
        const link = `${whoAmI?.origin}${to}`
        window.location.href = link
      }
    },
    [query]
  )

  return <div className="">{children}</div>
}
