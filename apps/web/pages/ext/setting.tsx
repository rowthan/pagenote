import SettingIndex from 'components/setting/Setting'
import { HashRouter as Router, Route, Routes } from 'react-router-dom'
import React from 'react'
import BasicLayout from 'layouts/BasicLayout'
import RedirectToExt from '../../components/RedirectToExt'
import { useMountedState } from 'react-use'
import ExtLayout from "../../layouts/ExtLayout";
import Footer from "../../components/Footer";



export default function Setting() {
  const mounted = useMountedState()

  return (
    <BasicLayout nav={false} footer={true} title={'设置· PAGENOTE 个性化'} full={true}>
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
    </BasicLayout>
  )
}
