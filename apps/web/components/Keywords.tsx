import { ReactNode } from 'react'
import classNames from 'classnames'

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  color?: string
}

export default function Keywords(props: Props) {
  const { className, ...left } = props
  return (
    <button
      className={classNames(
        'text-xs text-blue-400 mr-2 p-1 rounded',
        className
      )}
      {...left}
    >
      {props.children}
    </button>
  )
}
