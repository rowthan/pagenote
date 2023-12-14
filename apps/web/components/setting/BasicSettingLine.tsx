import React, { ReactElement, ReactNode, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SettingMoreSvg from '../../assets/svg/right-more.svg'
import classNames from 'classnames'
import Loading from '../loading/Loading'

export function SettingSection(props: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={classNames('border-card bg-card rounded-lg', props.className)}
    >
      {props.children}
    </div>
  )
}
export default function BasicSettingLine(props: {
  label: string | ReactElement
  subLabel?: string | ReactElement
  path?: string
  right?: ReactNode
  children?: ReactElement
  loading?: boolean
  onClick?: () => void
  className?: string
}) {
  const {
    className,
    label,
    path,
    right,
    onClick,
    subLabel,
    children,
    loading,
    ...left
  } = props
  const [expand, setExpand] = useState(false)
  const navigate = useNavigate()

  const Right = loading ? (
    <Loading />
  ) : (
    right || (
      <button
        className={
          'rounded-full hover:border hover:bg-base-300 w-6 h-6 flex items-center justify-center'
        }
      >
        <SettingMoreSvg className={'fill-current '} />
      </button>
    )
  )

  function onClickRoot() {
    if (path) {
      navigate(path)
    }
    onClick && onClick()
  }

  return (
    <div
      onClick={onClickRoot}
      className={classNames(
        'block px-5 py-3 min-h-12  bg-card border-b last:border-none border-base-200 hover:bg-accent last:rounded-b-lg first:rounded-t-lg overflow-hidden',
        {
          'cursor-pointer': !!path,
        },
        className
      )}
      {...left}
    >
      <div className={'flex items-center justify-between'}>
        <div className={'text-sm'}>
          <div className={' leading-12 '}>{label}</div>
          <div className={'text-xs text-muted-foreground'}>{subLabel}</div>
        </div>
        {Right}
      </div>
      <div className={''}>{children}</div>
    </div>
  )
}
