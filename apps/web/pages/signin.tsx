import BasicLayout from '../layouts/BasicLayout'
import useUserInfo from '../hooks/useUserInfo'
import AuthList from '../components/account/AuthList'
import SigninPart from '../components/account/sign/Signin'
import useWhoAmi from '../hooks/useWhoAmi'

function Signin() {
  const [user] = useUserInfo()
  const [whoAmI] = useWhoAmi()

  const signed = !!user?.profile?.nickname

  if (signed) {
    return (
      <div className={'m-auto pt-20 max-w-lg'}>
        <AuthList />
      </div>
    )
  }

  return (
    <section className="border-red-500  min-h-fill flex items-center justify-center">
      <div className="md:border p-5 m-2  rounded-2xl shadow-lg min-w-[300px] max-w-3xl items-center">
        <div className=" px-5">
          {whoAmI?.extensionPlatform ? (
            <SigninPart />
          ) : (
            <div>
              请
              <a className={'underline'} href="https://pagenote.cn/release">
                安装 PAGENOTE 插件
              </a>
              后再访问本页面绑定账号
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
export default function SigninPage() {
  return (
    <BasicLayout
      nav={false}
      title={'登录 PAGENOTE'}
      description={'登录 PAGENOTE 账号'}
    >
      <div className={'m-auto'}>
        <Signin />
      </div>
    </BasicLayout>
  )
}
