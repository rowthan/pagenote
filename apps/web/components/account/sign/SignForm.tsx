import { useForm } from 'react-hook-form'
import { useCallback, useEffect, useState } from 'react'
import useUserInfo from '../../../hooks/useUserInfo'
import { authCodeToToken, requestValidate } from '../../../service/account'
import useVersionValid from '../../../hooks/useVersionValid'
import useWhoAmi from '../../../hooks/useWhoAmi'
import 'react-awesome-button/dist/styles.css'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/use-toast'

enum SubmitState {
  unset = 0,
  loading = 1,
  success = 2,
  error = 3,
}

interface FormData {
  emailOrUid: string
  validateText: string
  publicText: string
}

const LAST_CACHE_EMAIL_KEY = 'last_signin_email'
const TOKEN_DURATION = 60 * 1000 * 10
export default function SignForm(props: { onFinished?: () => void, validateType: 'signin' | 'bindEmail' }) {
  const [state, setState] = useState<boolean>(false)
  const [user, refresh, update] = useUserInfo()
  const [tokenInfo, setTokenInfo] = useState({
    publicText: '',
    expiredAt: Date.now() + TOKEN_DURATION,
  })
  const [tip, setTip] = useState('')
  const [whoAmI] = useWhoAmi()
  const {
    setValue,
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<FormData>()
  const { valid } = useVersionValid('0.26.4')

  function sendValidateText() {
    setTokenInfo({
      publicText: '',
      expiredAt: Date.now() + TOKEN_DURATION,
    })
    setTip('')
    setValue('validateText', '')
    let email = ''
    let uid = 0
    const data = getValues()
    if (/@/.test(data.emailOrUid)) {
      email = data.emailOrUid
    } else {
      uid = Number(data.emailOrUid)
    }
    setState(true)
    const newPublicText = `signin_request_${whoAmI?.did}`
    localStorage.setItem(LAST_CACHE_EMAIL_KEY, `${email || uid || ''}`)
    requestValidate(
      {
        uid: uid,
        email: email,
        publicText: newPublicText,
        validateType: props.validateType || 'signin'
      },
    )
      .then(function (res) {
        if (res?.success) {
          setTokenInfo({
            publicText: res.data?.requestValidate?.publicText || '',
            expiredAt: Date.now() + TOKEN_DURATION,
          })
        } else {
          console.error(res,'error')
          setTip(res?.error || '请求失败，请重试')
        }
      })
      .finally(function () {
        setState(false)
      })
  }

  function doSignin() {
    const { validateText } = getValues()
    setTip('')
    setState(true)
    authCodeToToken(
        {
          publicText: tokenInfo.publicText,
          validateText: validateText,
          validateType: props.validateType || 'signin',
          authType: 'email'
        },
    )
        .then(function (signRes) {
          const token = signRes?.data?.oauth?.pagenote_t
          console.log('登录结果', token, signRes)
          if (token) {
            update(token)
            toast({
              title: '登录成功，正在跳转中'
            });
            setTimeout(function () {
              props.onFinished && props.onFinished()
            }, 2000)
          }
          if (signRes?.error) {
            setTip(signRes.error)
          }
        })
        .finally(() => {
          setState(false)
        })
  }

  const onSubmit = useCallback(() => {
    console.log(tokenInfo, 'submit', getValues())
    if (!tokenInfo.publicText || tokenInfo.expiredAt < Date.now()) {
      sendValidateText()
    } else {
      doSignin()
    }
  }, [tokenInfo])

  useEffect(function () {
    const search = new URLSearchParams(window.location.search)
    const uid = search.get('uid')
    const lastEmail = localStorage.getItem(LAST_CACHE_EMAIL_KEY)
    setValue('emailOrUid', uid || lastEmail || '')
  }, [])

  const publicTextValid = !!(
    tokenInfo.publicText && tokenInfo.expiredAt > Date.now()
  )
  return (
    <form
      className="flex flex-col gap-4 items-center"
      onSubmit={handleSubmit(onSubmit)}
    >
      <input
        type="text"
        className="p-2 m-5 mb-1 rounded-xl border w-full"
        {...register('emailOrUid', { required: true })}
        placeholder="你的 Email 或用户 ID"
      />
      {publicTextValid && (
        <>
          <div>
            <div>
              <div>
                验证请求
                <span className={'text-xs text-gray-300'}>
                  ({tokenInfo.publicText})
                </span>
              </div>
              <div>
                <span>凭证已发送至你的邮箱，请查收</span>
                <button
                  type={'button'}
                  className={'btn btn-ghost btn-xs btn-outline ml-2'}
                  onClick={sendValidateText}
                >
                  重新发送
                </button>
              </div>
            </div>
          </div>
          <input
            autoFocus={true}
            type="text"
            className="w-full p-2 rounded-xl border"
            {...register('validateText', { required: true })}
            placeholder={`从邮箱中获取 一次性登录凭证`}
          />
        </>
      )}

      <div>
        <Button disabled={state} loading={state}>
          {publicTextValid ? '验证' : '请求'}
        </Button>
      </div>

      <div className={'text-error text-sm'}>{tip}</div>
    </form>
  )
}
