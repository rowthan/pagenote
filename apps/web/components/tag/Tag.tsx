import * as React from 'react'
import { type ReactNode } from 'react'

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode
}

export default function Tag(props: Props) {
  const { children, ...left } = props
  return (
    <button
      {...left}
      className="px-2 py-1 bg-sky-50 rounded justify-center items-center inline-flex"
    >
      <span className="text-cyan-600 text-xs font-normal font-['Inter']">
        {children}
      </span>
    </button>
  )
}

Tag.defaultProps = {}
