import React, { type ReactNode, useEffect, useState } from 'react'
import useUserInfo, { fetchUserInfo } from 'hooks/useUserInfo'
import { createOrder } from 'service'
import PlanCard from './PlanCard'
import Tip from './Tip'
import { PlanInfo } from '../../typing'

interface Props {
  children?: ReactNode
  plans: PlanInfo[]
}

export default function Plans(props: Props) {
  const { children, plans } = props
  const [userInfo] = useUserInfo()
  const [plan, setPlan] = useState<PlanInfo | null>(null)
  const [activeIndex, setActiveIndex] = useState(1)
  let current = 0
  if (userInfo) {
    const pro = userInfo?.profile?.role || 0
    if (pro > 9) {
      current = 2
    } else if (pro > 1) {
      current = 1
    }
  }
  useEffect(
    function () {
      fetchUserInfo(true, 1000 * 30)
      if (plan) {
        createOrder(plan?.price)
      }
    },
    [plan]
  )

  const open = plan !== null
  return (
    <div className="">
      <div className={'block md:hidden'}>
        <div className="tabs m-auto my-2 justify-center">
          {plans.map((item, index) => (
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
        {plans.map((item, index) => (
          <div
            key={index}
            className={`hidden md:block ${
              activeIndex === index ? '!block' : ''
            }`}
          >
            <PlanCard info={item} current={current} onClick={setPlan} />
          </div>
        ))}
      </div>
      {children}
      {open && (
        <div className={`modal modal-open`}>
          <Tip
            plan={plan}
            onClose={() => {
              setPlan(null)
            }}
          >
            <div className={'text-sm'}>
              此方案需要支付：¥
              {Math.min(plan.price, userInfo?.leftPermanent || 130)}
            </div>
          </Tip>
        </div>
      )}
    </div>
  )
}

Plans.defaultProps = {}
