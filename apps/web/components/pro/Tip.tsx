import useUserInfo from 'hooks/useUserInfo'
import React, { useEffect, useState } from 'react'
import CloseSvg from '../../assets/svg/close.svg'
import { bindTransition } from '../../service'
import { toast } from 'utils/toast'
import CheckUser from 'components/check/CheckUser'
import { PlanInfo } from '../../typing'

export default function Tip(props: {
  onClose: () => void
  children: React.ReactNode
  plan: PlanInfo
}) {
  const { onClose, children, plan } = props
  const [paid, setPaid] = useState(false)
  const [userInfo] = useUserInfo()
  const [showButton, setShowButton] = useState(false)

  function confirmPaid() {
    if (userInfo) {
      bindTransition('', plan.price).then(function () {})
      setPaid(true)
    } else {
      window.open('https://pagenote.cn/signin.html')
      toast('请先登录后，返回此页面')
    }
  }


  useEffect(function () {
    setTimeout(function () {
      setShowButton(true)
    }, 5000)
  }, [])

  const payments = plan.payments || [
    {
      label: '支付宝',
      id: 'alipay',
      url: 'https://pagenote-public.oss-cn-beijing.aliyuncs.com/_static/alipay.png',
    },
  ]
  // @ts-ignore
  const { uid, emailMask } = userInfo?.profile || {}

  return (
    <div className="relative flex items-center justify-center via-blue-600 to-sky-600">
      <button onClick={onClose} className={'absolute right-2 top-2 z-50'}>
        <CloseSvg />
      </button>
      <div className="relative px-4 md:px-14 py-4 md:py-10 bg-gradient-to-br from-yellow-300 to-yellow-400 border-4 border-gray-900 flex items-center justify-center transform ">
        <div className="inline-block py-8 px-5 md:px-10 bg-white text-neutral  border-4 border-gray-900 text-center transform ">
          {paid ? (
            <div>
              若你已留言邮箱，无需其他操作，请稍后，我将尽快确认赞助信息，这可能需要几分钟。
              <br/>或者你可以
              <a href="/vip-bind" className={'a'}>手动提交支付凭证</a>
            </div>
          ) : (
            <div>
              <h1 className="mt-2 font-comic text-2xl md:text-4xl font-extrabold tracking-wider">
                赞助
                <span className="underline decoration-double decoration-blue-500">
                  PAGENOTE
                </span>
              </h1>

              <p className="my-2 font-medium">
                请备注你的用户ID {uid && <b>:{uid}</b>} 或邮箱
                {emailMask && <span>({emailMask})</span>}
              </p>

              <div className="carousel w-40 h-40 m-auto">
                {payments.map((item) => (
                  <div
                    key={item.id}
                    id={item.id}
                    className="carousel-item w-full"
                  >
                    <img
                      src={item.url || payments[0].url}
                      className="w-full"
                      width={160}
                      height={160}
                      alt={item.label}
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-center w-full py-2 gap-2">
                {payments.map((item) => (
                  <a href={`#${item.id}`} key={item.id} className="btn btn-xs">
                    {item.label}
                  </a>
                ))}
              </div>
              {children}
              <CheckUser
                fallback={
                  <a
                    className="btn btn-link btn-sm"
                    href="https://pagenote.cn/signin"
                    target="_blank"
                  >
                    登录后绑定支付信息
                  </a>
                }
              >
                <button
                  onClick={confirmPaid}
                  disabled={!showButton}
                  className="btn bg-red-500 hover:bg-red-600 text-white py-2 px-10 border-2 border-gray-900 mt-5 font-bold -skew-x-2"
                >
                  支付好了点这里
                </button>
              </CheckUser>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
