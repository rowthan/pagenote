import React from 'react'
import BiliSvg from 'assets/svg/bilibili.svg'
import WechatSvg from 'assets/svg/wechat.svg'
// import GithubSvg from 'assets/svg/github.svg'
import EmailSvg from 'assets/svg/email.svg'
import DeviceInfo from './account/DeviceInfo'
import { RiVipFill } from "react-icons/ri";
import Image from 'next/image'
import Link from 'next/link'
import {isExt} from "../const/env";

export default function Footer() {
  const homePath = isExt ? '/index.html' : '/'
  return (
    <>
      <footer
          className="footer gap-y-1 px-4 py-4 border-t bg-accent text-base-content border-base-300 flex md:justify-center">
        <div className="items-center grid-flow-col">
          <Link href={homePath}>
            <h2>PAGENOTE</h2>
          </Link>
          <Link href={homePath}>
            <img
                src="/images/light-64.png"
                width={24}
                height={24}
                alt={'pagenote'}
            />
          </Link>
          <a className="hidden md:block">小而美的网页标记工具.</a>
          <span className={'badge badge-outline badge-sm'}>
              <DeviceInfo />
          </span>
        </div>
        <div className="md:place-self-center md:justify-self-end">
          <div className="grid grid-flow-col gap-4">
            {/*<div className="dropdown dropdown-hover dropdown-top">*/}
            {/*  <label tabIndex={0} className="">*/}
            {/*    <WechatSvg width={24} height={24}/>*/}
            {/*  </label>*/}
            {/*  <div*/}
            {/*      tabIndex={0}*/}
            {/*      className="dropdown-content p-2 shadow bg-base-100 rounded-box w-52"*/}
            {/*  >*/}
            {/*    <Image*/}
            {/*        width={210}*/}
            {/*        height={210}*/}
            {/*        src="/images/wechat.jpg"*/}
            {/*        alt="微信公众号：pagenote"*/}
            {/*    />*/}
            {/*  </div>*/}
            {/*</div>*/}
            <a
                href="https://pagenote.cn/author"
                aria-label={' 联系作者'}
            >
              <WechatSvg width={24} height={24} alt={'微信公众号：pagenote'}/>
            </a>
            {/*<a*/}
            {/*    href="https://github.com/rowthan/pagenote"*/}
            {/*    aria-label={'GitHub rowthan'}*/}
            {/*>*/}
            {/*  <GithubSvg width={24} height={24}/>*/}
            {/*</a>*/}
            {/*<a*/}
            {/*    href="mailto:pagenote@126.com"*/}
            {/*    aria-label={'邮箱联系我： pagneote@126.com'}*/}
            {/*>*/}
            {/*  <EmailSvg width={24} height={24}/>*/}
            {/*</a>*/}
            <a
                href="https://pagenote.cn/pro-plan"
                aria-label={'vip'}
                className={'text-[24px] hover:text-blue-800'}
            >
              <RiVipFill/>
            </a>
          </div>
        </div>
      </footer>
    </>
  )
}
