import useVersionValid from 'hooks/useVersionValid'
import AuthBottoms from '../AuthBottoms'
import SignForm from './SignForm'

export default function SigninPart() {
  const { valid } = useVersionValid('0.26.4')

    return (
      <div className={'max-w-lg m-1'}>
        <h2 className="text-2xl font-bold text-color-100">为插件绑定账号</h2>
        <SignForm
          validateType={'signin'}
          onFinished={() => {
            window.location.href = '/account'
          }}
        />

        {valid && (
          <div>
            <div className="mt-7 grid grid-cols-3 items-center text-muted-foreground">
              <hr className="border-gray-500" />
              <p className="text-center text-sm">通过第三方授权登录</p>
              <hr className="border-gray-500" />
            </div>
            <AuthBottoms />
          </div>
        )}

        <div className="text-sm mt-10">
          <a target="_blank" href="/privacy" className="link link-primary">
            隐私协议
          </a>
        </div>
      </div>
    )
}
