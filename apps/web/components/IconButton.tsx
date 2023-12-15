import { ReactNode } from 'react'

export default function IconButton(props: {
  disabled?: boolean
  children: ReactNode
  onClick?: () => void
  className?: string
  [key: string]: any
}) {
  const { onClick, children, disabled, className, ...left } = props
  return (
    <button
      {...left}
      disabled={disabled}
      onClick={onClick}
      className={`disabled:opacity-50 disabled:cursor-not-allowed p-1 bg-white rounded hover:bg-gray-200 shadow ${className}`}
    >
      {children}
    </button>
  )
}
