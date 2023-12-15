import useWhoAmi from '../hooks/useWhoAmi'
import useUserInfo from '../hooks/useUserInfo'
import useDataStat from '../hooks/useDataStat'
import CheckVersion from './check/CheckVersion'
import WhoAmIBoard from './WhoAmIBoard'
import { useState } from 'react'

export default function ExtensionInfos() {
  const [whoAmI] = useWhoAmi()
  const [user] = useUserInfo()
  const [stat] = useDataStat()
  const [showDetail, setShowDetail] = useState(false)

  return (
    <CheckVersion requireVersion={'0.24.0'}>
      <div className="stats shadow h-32">
        <div className="stat place-items-center">
          <div className="stat-title">当前版本</div>
          <div className="stat-value">
            <button
              onClick={() => {
                setShowDetail(true)
              }}
              className="tooltip"
              data-tip="点击查看详情"
            >
              {whoAmI?.version}
            </button>
          </div>
          <div className="stat-desc">{}</div>
        </div>

        <div className="stat place-items-center">
          <div className="stat-title">登录信息</div>
          <div className="stat-value text-lg">
            {user?.profile?.nickname || '未登录'}
          </div>
          <div className="stat-desc">{/*↗︎ 40 (2%)*/}</div>
        </div>

        <div className="stat place-items-center">
          <div className="stat-title">今日标记</div>
          <div className="stat-value">↗︎ {stat?.todayNewLights}</div>
          <div className="stat-desc">
            <a href="/manage/page">网页{stat?.pagesCnt}</a>;
            <a href="/manage/light">标记{stat?.lightsCnt}</a>; 截图
            {stat?.snapshotsCnt}；
            <a href="/ext/popup#/clipboard">剪切板{stat?.clipboardCnt}</a>;
            {/*↘︎ 90 (14%)*/}
          </div>
        </div>

        <div className={`modal modal-${showDetail ? 'open' : 'onClose'}`}>
          <div className="modal-box">
            <WhoAmIBoard />
            <div className="modal-action">
              <button
                className="btn"
                onClick={() => {
                  setShowDetail(false)
                }}
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      </div>
    </CheckVersion>
  )
}
