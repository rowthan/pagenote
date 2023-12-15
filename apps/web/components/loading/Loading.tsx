import { type ReactNode } from 'react'
import LoadingSvg from 'assets/svg/loading.svg'

interface Props {
  children?: ReactNode
  className?: string
}

export default function Loading(props: Props) {
  const { className, children } = props
  return (
    <div className={'text-xs text-color-200 flex'}>
      <LoadingSvg
        className={`animate-spin fill-current text-color-100 mr-2 ${className}`}
      />
      {children}
    </div>
  )
}

Loading.defaultProps = {}
