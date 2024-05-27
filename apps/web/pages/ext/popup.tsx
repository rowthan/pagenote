import React, { lazy, Suspense, useEffect, useState } from 'react'
import { HashRouter as Router, Route, Routes } from 'react-router-dom'
import NavTabs from 'components/popup/NavTabs'
import { useMountedState } from 'react-use'
import ExtLayout from "../../layouts/ExtLayout";
import classNames from "classnames";

const ClipboardList = lazy(() => import('components/manage/ClipboardList'))
const Search = lazy(() => import('components/popup/Search'))
const Setting = lazy(() => import('components/setting/Setting'))
const CurrentTab = lazy(() => import('components/popup/state/EnableCheck'))

const CACHE_SEARCH_KEY = 'popup_search'

export default function PopupPage(props:{className: string}) {
  const [keyword, setKeyword] = useState<string>('')
  const mounted = useMountedState()

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

  return (
    <ExtLayout>
      <div className={classNames('popup rounded-lg transform translate-x-0',props.className)}>
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
                        <Setting />
                    </Suspense>
                  }
                />
              </Routes>
            </div>
          </Router>
        )}
      </div>
    </ExtLayout>
  )
}
