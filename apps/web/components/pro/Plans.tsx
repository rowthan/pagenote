import React, { type ReactNode, useEffect, useMemo, useState } from 'react'
import useUserInfo, { fetchUserInfo } from 'hooks/useUserInfo'
import { createOrder } from 'service'
import Tip from './Tip'

export type RightsConfig = {
  rights: {
    label: string
    allowFor: number[]
    visibleFor: number[]
  }[]
  payments: { id: string; label: string; url: string }[]
  types: {
    title: string
    description: string
    price: number
    duration: string
    unit?: string
    bg: string
    role: number
    deduct: boolean
    final?: boolean
  }[]
}

interface Props {
  children?: ReactNode
  config: RightsConfig
}

export default function Plans(props: Props) {
  const { children, config: cfg } = props
  const [userInfo] = useUserInfo()
  const [selectedTypeIndex, setSelectedTypeIndex] = useState<number | null>(null)
  const [activeIndex, setActiveIndex] = useState(1)
  let current = 0
  if (userInfo) {
    const pro = userInfo?.profile?.role || 0
    if (pro > 9) {
      current = 2
    } else if (pro > 1) {
      current = 0
    }
  }
  useEffect(
    function () {
      fetchUserInfo(true, 1000 * 30)
      if (selectedTypeIndex !== null) {
        const t = cfg?.types?.[selectedTypeIndex]
        if (t) createOrder(t.price)
      }
    },
    [selectedTypeIndex, cfg]
  )

  const open = selectedTypeIndex !== null
  const selectedType =
    selectedTypeIndex !== null ? cfg?.types?.[selectedTypeIndex] : null

  function getVisibleRightsForRole(role: number) {
    return (cfg?.rights || []).filter(
      (r) => Array.isArray(r.visibleFor) && r.visibleFor.includes(role)
    )
  }

  function canUseRight(r: RightsConfig['rights'][number], role: number) {
    return Array.isArray(r.allowFor) && r.allowFor.includes(role)
  }

  const types = useMemo(() => cfg?.types || [], [cfg])
  const payments = useMemo(() => cfg?.payments || [], [cfg])

  return (
    <div className="">
      <div className={'block md:hidden'}>
        <div className="tabs m-auto my-2 justify-center">
          {types.map((item, index) => (
            <div
              key={index}
              onClick={() => {
                setActiveIndex(index)
              }}
              className={`tab tab-bordered ${
                activeIndex === index ? 'tab-active' : ''
              }`}
              dangerouslySetInnerHTML={{ __html: item.title }}
            ></div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {types.map((item, index) => {
          const role = item.role
          const rights = getVisibleRightsForRole(role)
          const disabled = current >= role
          const canUpgrade = current < role
          let buttonLabel =
            current === role ? `当前身份` : canUpgrade ? '加入此身份' : '已高于此身份'
          if (canUpgrade) {
            const pay = item.deduct
              ? Math.min(item.price, userInfo?.leftPermanent || item.price)
              : item.price
            buttonLabel += ` ￥${pay}`
          }

          return (
          <div
            key={index}
            className={`hidden md:block ${
              activeIndex === index ? '!block' : ''
            }`}
          >
            <div className="relative !bg-opacity-0 bg-blue-500 bg-green-500 bg-indigo-500 shadow-md rounded-sm border border-gray-200">
              <div
                className={`absolute top-0 left-0 right-0 h-0.5 bg-${item.bg}-500`}
                aria-hidden="true"
              ></div>
              <div className="px-5 pt-5 pb-6 border-b border-gray-200">
                <header className="flex items-center mb-2">
                  <div
                    className={`w-6 h-6 rounded-full flex-shrink-0 bg-${item.bg}-500 bg-gradient-to-tr from-${item.bg}-500 to-${item.bg}-300 mr-3`}
                  >
                    <svg className="w-6 h-6 fill-white" viewBox="0 0 24 24">
                      <path d="M12 17a.833.833 0 01-.833-.833 3.333 3.333 0 00-3.334-3.334.833.833 0 110-1.666 3.333 3.333 0 003.334-3.334.833.833 0 111.666 0 3.333 3.333 0 003.334 3.334.833.833 0 110 1.666 3.333 3.333 0 00-3.334 3.334c0 .46-.373.833-.833.833z" />
                    </svg>
                  </div>
                  <h3
                    className="text-lg font-semibold"
                    dangerouslySetInnerHTML={{ __html: item.title }}
                  ></h3>
                </header>
                <div
                  className="text-sm mb-2 h-10"
                  dangerouslySetInnerHTML={{ __html: item.description }}
                ></div>
                <div className="font-bold mb-4">
                  <span className="text-2xl">￥</span>
                  <span className="text-3xl" x-text="annual ? '14' : '19'">
                    {item.price}
                    {item.unit || '元'}
                  </span>
                  <span className=" font-medium text-sm">/{item.duration}</span>
                </div>
                <button
                  className={`font-medium text-sm inline-flex items-center justify-center px-3 py-2 border border-gray-200 rounded leading-5 shadow-sm transition ease-in-out focus:outline-none  w-full hover:scale-105 duration-300
                    ${
                      `hover:border-gray-300 focus-visible:ring-2  bg-${item.bg}-500 hover:bg-${item.bg}-600`
                    }`}
                  onClick={() => {
                    setSelectedTypeIndex(index)
                    fetchUserInfo(true, 1000 * 60 * 5)
                  }}
                >
                  {disabled && (
                    <svg
                      className="w-3 h-3 flex-shrink-0 fill-current mr-2"
                      viewBox="0 0 12 12"
                    >
                      <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                    </svg>
                  )}
                  <span>{buttonLabel}</span>
                </button>
              </div>
              <div className="px-5 pt-4 pb-5">
                {/*<div className="text-xs font-semibold uppercase mb-4">*/}
                {/*  权益列表（<key-word>只增不减</key-word>）*/}
                {/*</div>*/}
                <ul>
                  {rights.map((r, ridx) => {
                    const allowed = canUseRight(r, role)
                    const label = r.label
                    return (
                      <li key={ridx} className="flex items-center py-1">
                        <aside className={'mr-2'}>
                          {allowed ? (
                            <svg
                              className="w-3 h-3 flex-shrink-0 fill-current text-green-500 "
                              viewBox="0 0 12 12"
                            >
                              <path d="M10.28 1.28L3.989 7.575 1.695 5.28A1 1 0 00.28 6.695l3 3a1 1 0 001.414 0l7-7A1 1 0 0010.28 1.28z" />
                            </svg>
                          ) : (
                            <svg
                              viewBox="0 0 1024 1024"
                              version="1.1"
                              xmlns="http://www.w3.org/2000/svg"
                              p-id="6455"
                              width="12"
                              height="12"
                            >
                              <path
                                d="M910.336 186.368l-72.704-72.704L512 439.808 186.368 113.664 113.664 186.368 439.808 512l-326.144 325.632 72.704 72.704L512 584.192l325.632 326.144 72.704-72.704L584.192 512l326.144-325.632z"
                                fill="#d81e06"
                                p-id="6456"
                              ></path>
                            </svg>
                          )}
                        </aside>
                        <div className="text-sm">{label}</div>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </div>
          </div>
          )
        })}
      </div>
      {children}
      {open && (
        <div className={`modal modal-open`}>
          <Tip
            price={selectedType?.price || 0}
            payments={payments}
            onClose={() => {
              setSelectedTypeIndex(null)
            }}
          >
            <div className={'text-sm'}>
              此方案需要支付：¥
              {Math.min(selectedType?.price || 0, userInfo?.leftPermanent || 130)}
            </div>
          </Tip>
        </div>
      )}
    </div>
  )
}

Plans.defaultProps = {}
