import React from 'react'
import BiliSvg from 'assets/svg/bilibili.svg'
import WechatSvg from 'assets/svg/wechat.svg'
import GithubSvg from 'assets/svg/github.svg'
import EmailSvg from 'assets/svg/email.svg'
import DeviceInfo from './account/DeviceInfo'
import Image from 'next/image'
import Link from 'next/link'

export default function Footer() {
  return (
    <>
      <footer
          className="footer gap-y-1 px-4 py-4 border-t bg-accent text-base-content border-base-300 flex md:justify-center">
        <div className="items-center grid-flow-col">
          <Link href="/">
            <h2>PAGENOTE</h2>
          </Link>
          <Link href="/">
            <img
                src="/images/light-64.png"
                width={24}
                height={24}
                alt={'pagenote'}
            />
          </Link>
          <a className="hidden md:block">小而美的网页标记工具.</a>
          <DeviceInfo />
        </div>
        <div className="md:place-self-center md:justify-self-end">
          <div className="grid grid-flow-col gap-4">
            <div className="dropdown dropdown-hover dropdown-top">
              <label tabIndex={0} className="">
                <WechatSvg width={24} height={24} />
              </label>
              <div
                tabIndex={0}
                className="dropdown-content p-2 shadow bg-base-100 rounded-box w-52"
              >
                <Image
                  width={210}
                  height={210}
                  src="/images/wechat.jpg"
                  alt="微信公众号：pagenote"
                />
              </div>
            </div>
            <a
              href="https://space.bilibili.com/2089824747"
              aria-label={'哔哩哔哩 一用书生'}
            >
              <BiliSvg width={24} height={24} />
            </a>
            <a
              href="https://github.com/rowthan/developer.pagenote.cn"
              aria-label={'GitHub rowthan'}
            >
              <GithubSvg width={24} height={24} />
            </a>
            <a
              href="mailto:pagenote@126.com"
              aria-label={'邮箱联系我： pagneote@126.com'}
            >
              <EmailSvg width={24} height={24} />
            </a>
          </div>
        </div>
      </footer>
    </>
  )
}
