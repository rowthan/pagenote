import { type ReactNode, useEffect } from 'react'
import useWhoAmi from '../hooks/useWhoAmi'

interface Props {
  children?: ReactNode
}

export default function Redirect(props: Props) {
  const { children } = props
  const [whoAmI] = useWhoAmi()

  useEffect(
    function () {
        window.location.href = '/ext/setting'+window.location.hash
    },
    [whoAmI]
  )

  return <div className="">{children}</div>
}
