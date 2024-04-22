import React, {ComponentProps, FC, PropsWithChildren, ReactElement, ReactNode, useState} from 'react'
import { useNavigate } from 'react-router-dom'
import SettingMoreSvg from '../../assets/svg/right-more.svg'
import classNames from 'classnames'
import Loading from '../loading/Loading'
import {openUrlInGroup} from "../../utils/url";

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
  // todo 优化
  const navigate = useNavigate()

  const Right = loading ? (
    <Loading />
  ) : (
      <div className={'flex items-center text-sm'}>
        {right}
        {path && <SettingMoreButton />}
      </div>
  )

  function onClickRoot() {
    if (path) {
      if(path.startsWith('http')){
        openUrlInGroup('https://pagenote.cn/pro-plan')
      }else{
        navigate(path)
      }
      // history.pushState({}, '', window.location.pathname +'#' +path)
    }
    onClick && onClick()
  }

  return (
      <div
          onClick={onClickRoot}
      className={classNames(
        'block px-4 py-3 min-h-12  bg-card border-b last:border-none border-base-200 hover:bg-accent last:rounded-b-lg first:rounded-t-lg overflow-hidden',
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

interface Props {
  children?: ReactNode
  className?: string
  onClick?: ()=>void
}


export function SettingMoreButton(props: Props) {
  const {children,...left}= props;
  return (
      <button
          {...left}
          className={
            'rounded-full hover:border hover:bg-base-300 w-6 h-6 flex items-center justify-center'
          }
      >
        {children || <SettingMoreSvg className={'fill-current '}/>}
      </button>
  )
}

export function BasicSettingTitle(props: Props) {
  return (
      <h3 className={classNames('text-sm px-4 py-1', props.className)}>
        {props.children}
      </h3>
  )
}

export function BasicSettingDescription(props: Props) {
  return(
      <div className={classNames('text-xs text-muted-foreground px-4 py-1', props.className)}>
        {props.children}
      </div>
  )
}
