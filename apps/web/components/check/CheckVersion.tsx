import useWhoAmi from '../../hooks/useWhoAmi'
import React, { ReactElement, ReactNode, useEffect, useState } from 'react'
import { compare } from 'compare-versions'
import useVersionValid from 'hooks/useVersionValid'
import CheckFallback from './CheckFallback'

export default function CheckVersion({
  requireVersion,
  children,
  label,
  fallback,
}: {
  requireVersion: string
  children: ReactElement
  label?: string
  fallback?: ReactElement
}) {
  const { installed, valid } = useVersionValid(requireVersion)
  const [whoAmi] = useWhoAmi('9.9.9')

  if (!installed) {
    return fallback || <CheckFallback />
  }
  return valid
    ? children
    : fallback || (
        <div className="mx-auto mt-20 card w-96 bg-neutral text-neutral-content">
          <div className="card-body items-center text-center">
            <h2 className="card-title">
              当前PAGENOTE 版本({whoAmi?.version})过低
            </h2>
            <p>
              你需要升级至{requireVersion}才可继续访问当前
              {label && (
                <b className={'border-double border-2 border-primary'}>
                  {label}
                </b>
              )}
              功能
            </p>
            <div className="card-actions justify-end">
              <button className="btn btn-primary">
                <a href="https://pagenote.cn/release">前往升级</a>
              </button>
            </div>
          </div>
        </div>
      )
}
