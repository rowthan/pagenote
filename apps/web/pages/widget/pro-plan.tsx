import Plans from '../../components/pro/Plans'
import React from 'react'
import { PlanInfo } from '../../typing'

export const getStaticProps = async function () {
  const data = await fetch(
    `${process.env.API_HOST}/api/graph/book?query=query{plans{dataJson}}`,
      {
        headers: {
          'x-pagenote-priority': '1.1'
        }
      }
  ).then(async function (response) {
    const res = await response.json()
    const dataJson = res.data?.plans?.dataJson
    if (dataJson) {
      const plans: PlanInfo[] = JSON.parse(dataJson)
      return plans
    }
  }).catch(function () {
    return [{
      title: '终身VIP',
      description: '没有时限的VIP用户。',
      price: 125,
      duration: '终身',
      unit: '元(累计)',
      bg: 'indigo',
      role: 2,
      deduct: true,
      final: true,
      rights: [{
        label: '解锁所有功能',
      }],
      payments: [{
        id: 'alipay',
        label: '支付宝',
        url: "https://pagenote-public.oss-cn-beijing.aliyuncs.com/_static/alipay.png",
      },{
        id:'wechat',
        label: '微信',
        url: "https://pagenote-public.oss-cn-beijing.aliyuncs.com/0000/wechat_pay.jpg?x-oss-process=style/q75",
      }]
    },]
  })

  console.log('fetch prices in static props')
  return {
    props: {
      plans: data || [],
    },
  }
}

export default function ProPlan(props: { plans: PlanInfo[] }) {
  const { plans } = props
  return (
    <div className={'m-auto px-6 max-w-7xl pt-2'}>
      <Plans plans={plans || []}>
        <div className="p-2 text-muted-foreground">
          <ul>
            <li>
              VIP可优先使用部分功能，普通用户会滞后一段时间，限制会逐步放开。
            </li>
            <li>
              如果你是学生或老师，使用
              <key-word>教育邮箱</key-word>
              注册后，也可解锁功能 1个月。关注
              <key-word preview="1">微信公众号</key-word>
              ，也可领取VIP。
            </li>
          </ul>
        </div>
      </Plans>
    </div>
  )
}
