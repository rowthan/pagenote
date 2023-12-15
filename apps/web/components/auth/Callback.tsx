import React, { useEffect, useState } from 'react'
import useUserInfo from 'hooks/useUserInfo'
import { authCodeToToken } from 'service/account'
import { useRouter } from 'next/router'
import Link from 'next/link'
import useVersionValid from '../../hooks/useVersionValid'
import {AuthConfig, AuthType} from 'const/oauth'

enum STATUS {
  un_set = 0,
  exchanging = 1,
  fail = 2,
  success = 3,
}


const Callback: React.FC<{ authType: AuthType }> = (props) => {
  const { valid } = useVersionValid('0.26.4')
  const [serverUser, refresh, update] = useUserInfo()
  const [status, setStatus] = useState(STATUS.un_set)
  const [tip, setTip] = useState('')
  const router = useRouter()
  const { authType } = props
  const code = (router.query?.code || '').toString()

  function codeToToken() {
    if (!code) {
      setTip('授权失败')
      return
    }

    setStatus(STATUS.exchanging)
    authCodeToToken({
      code,
      authType,
      redirectUri: AuthConfig[authType].redirectUri(),
    })
      .then(function (res) {
        if (res.error) {
          setTip(res.error)
        }

        const token = res.data?.oauth?.pagenote_t
        if (token) {
          setStatus(STATUS.success)
          update(token)
        } else {
          setStatus(STATUS.fail)
        }
      })
      .catch(function (error) {
        setStatus(STATUS.fail)
      })
  }

  useEffect(() => {
    codeToToken()
  }, [router.query])

  useEffect(
    function () {
      switch (status) {
        case STATUS.success:
          setTimeout(function () {
            window.location.href = '/account'
          }, 1500)
          break
      }
    },
    [status]
  )

  if (!code) {
    return null
  }

  return (
    <div>
      <div className="max-w-[360px] mx-auto pt-40">
        <div className="bg-color-50 shadow-lg rounded-lg mt-9">
          <header className="text-center px-5 pb-5">
            <div className="relative inline-flex -mt-9 w-[72px] h-[72px] fill-current rounded-full border-4 border-white box-content shadow mb-3">
              <img
                width={72}
                height={72}
                src="/images/light-64.png"
                alt="pagenote"
                className={'rounded-full'}
              />
              <img
                width={36}
                height={36}
                className={'absolute -bottom-3 -right-3 bg-white rounded-full'}
                crossOrigin={'anonymous'}
                src={AuthConfig[authType]?.icon}
                alt={authType}
              />
            </div>
            <h3 className="text-xl font-bold  mb-1">
              {status === STATUS.exchanging ? (
                <div>获取授权信息中...</div>
              ) : (
                <div>授权</div>
              )}
            </h3>
            {/*<div className="text-sm font-medium ">*/}
            {/*  通过第三方授权登录，无需记住密码，这是推荐的登录方式。*/}
            {/*</div>*/}
          </header>
          <div className=" text-center px-5 py-6">
            <div className="text-sm mb-6">
              正在从 {authType} 获取基础信息，以识别你的身份。
            </div>
            {status === STATUS.fail && (
              <div className={'text-red-500'}>
                <div
                  dangerouslySetInnerHTML={{ __html: tip || '授权失败' }}
                ></div>
                <p>
                  <Link href="/signin.html" className="link">
                    返回重试
                  </Link>
                </p>
              </div>
            )}

            {status === STATUS.success && (
              <div>
                授权成功。
                <a href="/pagenote.html">返回 PAGENOTE</a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Callback
