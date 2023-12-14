import Profle from 'components/account/Profile'
import BasicLayout from 'layouts/BasicLayout'

export default function Account() {
  return (
    <BasicLayout
      nav={false}
      title={'用户信息'}
      description={'我的PAGENOTE用户信息'}
    >
      <Profle />
    </BasicLayout>
  )
}
