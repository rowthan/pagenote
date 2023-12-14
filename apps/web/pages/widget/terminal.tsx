import { type ReactNode } from 'react'

interface Props {
  children?: ReactNode
}

export default function terminal(props: Props) {
  const { children } = props
  return <div className="">{children}</div>
}

terminal.defaultProps = {}
