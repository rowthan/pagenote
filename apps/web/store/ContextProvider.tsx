import { createContext } from 'use-context-selector'
import React, { Dispatch, SetStateAction, useCallback, useState } from 'react'
import { WebPage } from '@pagenote/shared/lib/@types/data'
import { Query } from '@pagenote/shared/lib/@types/database'

type State = {
  // 分组方式
  groupType?: keyof WebPage
  // 过滤器名称（用户可见）
  groupFilterName?: string
  // 过滤器（API请求）
  webpageFilter?: Query<WebPage>
  // 当前选中页面
  selectedPageKey?: string
}

const initState: State = {
  groupType: 'categories',
  groupFilterName: '',
  selectedPageKey: '',
}

export const context = createContext<[State, Dispatch<SetStateAction<State>>]>(
  null as any
)

const ContextProvider = (props: { children: React.ReactElement }) => {
  const [innerState, setInnerState] = useState(function () {
    const object = JSON.parse(
      localStorage.getItem('pageManageState') || JSON.stringify(initState)
    )
    return {
      ...initState,
      ...object,
    }
  })

  // @ts-ignore
  const updateState: Dispatch<SetStateAction<State>> = useCallback(
    function (state: State) {
      const data = {
        ...innerState,
        ...state,
      }
      setInnerState(data)
      localStorage.setItem('pageManageState', JSON.stringify(data))
    },
    [innerState]
  )

  return (
    <context.Provider value={[innerState, updateState]}>
      {props.children}
    </context.Provider>
  )
}
export default ContextProvider
