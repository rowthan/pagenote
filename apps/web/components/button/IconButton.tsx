import * as React from 'react'
import { type ReactNode } from 'react'
import classNames from 'classnames'

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode
}

// @ts-ignore
function IconButton(props: Props, ref) {
  const { children, className = '', ...left } = props
  return (
    <button
      {...left}
      className={classNames(
        `inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 z-10 inline-block hover:bg-muted hover:text-accent-foreground rounded-md ${className}`,
        'hover:shadow',
        'p-1'
      )}
    >
      {children}
    </button>
  )
}

export default React.forwardRef(IconButton)
