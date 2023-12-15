import BasicLayout from '../../layouts/BasicLayout'
import ExtensionInfos from 'components/ExtensionInfos'
import Logs from '../../components/debug/Logs'
import FeedbackList from '../../components/contact/FeedbackList'
import { developer } from '@pagenote/shared/lib/extApi'
import LogLevel = developer.LogLevel

export default function Feedback() {
  return (
    <BasicLayout title={'反馈问题'} description={'联系开发者'}>
      <div className="flex w-full max-w-screen-xl	m-auto">
        <div className="flex-grow card bg-base-300 rounded-box w-1/2 p-4">
          <ExtensionInfos />
          <div className={'h-basic'}>
            <Logs initPageSize={20} levels={[LogLevel.ERROR, LogLevel.WARN]} />
          </div>
        </div>
        <div className="divider divider-horizontal"></div>
        <div className="grid flex-grow card bg-base-300 rounded-box p-4">
          <FeedbackList />
        </div>
      </div>
    </BasicLayout>
  )
}
