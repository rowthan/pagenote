import React, {ComponentProps, FC, PropsWithChildren, ReactElement, ReactNode, useState} from 'react'
import { useNavigate } from 'react-router-dom'
import SettingMoreSvg from '../../assets/svg/right-more.svg'
import classNames from 'classnames'
import Loading from '../loading/Loading'
import {openUrlInGroup} from "../../utils/url";
import { RiLoaderLine } from "react-icons/ri";
import { Badge } from "@/components/ui/badge"

export function SettingSection(props: {
  children: ReactNode
  className?: string
  loading?: boolean
}) {
  return (
    <div
      className={classNames('relative border-card bg-card rounded-lg', props.className)}
    >
      {
          props.loading &&
          <div className={'absolute w-full h-full flex items-center justify-center bg-gray-100 bg-opacity-10'}>
            <RiLoaderLine className={'text-2xl animate-spin'}/>
          </div>
      }
      {props.children}
    </div>
  )
}

export function StatBadge(props: Props & {
  type: 'success' | 'fail'
}) {
  return(
      <div className={classNames(
          'flex items-center gap-2 text-xs',
          {
            'text-blue-500': props.type === 'success',
            'text-red-500': props.type === 'fail',
          }
      )}>
        <div className={classNames(
            'overflow-hidden rounded-full text-xs p-0.5 justify-center h-1 w-1',
            {
              'bg-blue-500': props.type === 'success',
              'bg-red-500': props.type === 'fail',
            }
        )} />
        {props.children}
      </div>
  )
}
export default function BasicSettingLine(props: {
  badge?: ReactNode
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
    badge,
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
      <div className={'flex items-center gap-2 text-sm text-muted-foreground'}>
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
        <div className={'flex items-center gap-2'}>
          {
              badge &&
              <div className={'w-6 h-6'}>
                {badge}
              </div>
          }
          <div className={'text-sm'}>
            <div className={' leading-12 '}>{label}</div>
            {
                subLabel &&
                <div className={'text-xs text-muted-foreground'}>{subLabel}</div>
            }
          </div>
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
