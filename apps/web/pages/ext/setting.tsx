import SettingIndex from 'components/setting/Setting'
import { HashRouter as Router, Route, Routes } from 'react-router-dom'
import React from 'react'
import RedirectToExt from '../../components/RedirectToExt'
import { useMountedState } from 'react-use'
import ExtLayout from "../../layouts/ExtLayout";



export default function Setting() {
  const mounted = useMountedState()

  return (
    <ExtLayout title={'设置· PAGENOTE 个性化'}>
      <RedirectToExt>
        <div className={'popup sm:p-4 p-1 min-h-fill relative'}>
          {mounted() && (
            <Router>
              <Routes>
                {/*<Route path="/" element={<SettingIndex />} />*/}
                  <Route path="/*" element={<SettingIndex />} />
              </Routes>
            </Router>
          )}
        </div>
      </RedirectToExt>
    </ExtLayout>
  )
}
