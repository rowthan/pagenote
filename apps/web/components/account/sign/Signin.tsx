import useVersionValid from 'hooks/useVersionValid'
import AuthBottoms from '../AuthBottoms'
import SignForm from './SignForm'

export default function SigninPart() {
  const { valid } = useVersionValid('0.26.4')

    return (
      <div className={'max-w-lg m-1'}>
        <h2 className="text-2xl font-bold text-color-100">为插件绑定账号</h2>
        <sub>
          tips: 本地数据
          <a className={'link'} href="https://pagenote.cn/no-cloud">
            不会上传服务器
          </a>
          ，故你无法通过登录同一个账号同步笔记。
          <br />
          绑定账号仅用于身份识别、
          <a className={'link'} href="https://pagenote.cn/pro-plan">
            VIP权益
          </a>
          确认。
        </sub>
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
              <p className="text-center text-sm">通过第三方授权绑定</p>
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
