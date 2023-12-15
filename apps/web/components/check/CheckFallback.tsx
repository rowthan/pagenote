import React, { type ReactNode } from 'react'

interface Props {
  children?: ReactNode
  requiredVersion?: string
}

export default function CheckFallback(props: Props) {
  const { children, requiredVersion } = props
  return (
    <div className="m-auto mt-20 card w-96 bg-base-100 shadow-xl">
      {/*<figure className="px-10 pt-10">*/}
      {/*    <img src="https://placeimg.com/400/225/arch" alt="Shoes" className="rounded-xl" />*/}
      {/*</figure>*/}
      <div className="card-body items-center text-center">
        <p>未检测到 PAGENOTE，或版本过低</p>
        <div className="card-actions">
          <button className="btn btn-primary">
            <a href="https://pagenote.cn/release">前往安装</a>
          </button>
        </div>
        <div className={'text-center'}>
          <a href="" className={'link link-primary'}>
            刷新重试
          </a>
        </div>
      </div>
    </div>
  )
}

CheckFallback.defaultProps = {}
