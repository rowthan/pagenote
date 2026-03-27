import Plans from '../../components/pro/Plans'
import React from 'react'

export default function ProPlan() {
  return (
    <div className={'m-auto px-6 max-w-7xl pt-2'}>
      <Plans config={{ rights: [], payments: [], types: [] }}>
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
