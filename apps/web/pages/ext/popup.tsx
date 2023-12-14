import BasicLayout from 'layouts/BasicLayout'
import React, { lazy, Suspense, useEffect, useState } from 'react'
import { HashRouter as Router, Route, Routes } from 'react-router-dom'
import NavTabs from 'components/popup/NavTabs'
import extApi from '@pagenote/shared/lib/pagenote-api'
import useWhoAmi from 'hooks/useWhoAmi'
import { useMountedState } from 'react-use'
import useCurrentTab from '../../hooks/useCurrentTab'

const ClipboardList = lazy(() => import('components/manage/ClipboardList'))
const Search = lazy(() => import('components/popup/Search'))
const Setting = lazy(() => import('components/setting/Setting'))
const CurrentTab = lazy(() => import('components/popup/state/EnableCheck'))

const CACHE_SEARCH_KEY = 'popup_search'

export default function PopupPage() {
  const [keyword, setKeyword] = useState<string>('')
  const [whoAmi] = useWhoAmi()
  const mounted = useMountedState()
  const { tab } = useCurrentTab()

  useEffect(function () {
    setKeyword(localStorage.getItem(CACHE_SEARCH_KEY) || '')
  }, [])

  useEffect(
    function () {
      if (keyword) {
        localStorage.setItem(CACHE_SEARCH_KEY, keyword)
      }
    },
    [keyword]
  )

  useEffect(
    function () {
      if (whoAmi?.version) {
        extApi.commonAction.setPersistentValue({
          key: 'popup_version',
          value: whoAmi?.version,
        })
      }
    },
    [whoAmi]
  )

  return (
    <BasicLayout nav={false} footer={false} full={true}>
      <div className={'popup w-basic rounded-lg transform translate-x-0'}>
        {mounted() && (
          <Router>
            <div className="sticky top-0 bg-background z-10">
              <NavTabs keyword={keyword} onChangeKeyword={setKeyword} />
            </div>
            <div
              className={
                'w-full min-h-[550px] relative overflow-hidden overflow-y-auto '
              }
            >
              <Routes>
                <Route
                  index
                  element={
                    <Suspense>
                      <CurrentTab />
                    </Suspense>
                  }
                />
                <Route
                  path="/clipboard"
                  element={
                    <Suspense>
                      <ClipboardList />
                    </Suspense>
                  }
                />
                <Route
                  path="/search"
                  element={
                    <Suspense>
                      <Search keyword={keyword} />
                    </Suspense>
                  }
                />
                <Route
                  path="/setting/*"
                  element={
                    <Suspense>
                      <Setting />
                    </Suspense>
                  }
                />
                <Route
                  path="*"
                  element={
                    <Suspense>
                      <CurrentTab />
                    </Suspense>
                  }
                />
              </Routes>
            </div>
          </Router>
        )}
      </div>
    </BasicLayout>
  )
}
