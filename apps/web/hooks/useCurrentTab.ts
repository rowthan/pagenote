import extApi from "@pagenote/shared/lib/pagenote-api";
import useSWR from "swr";
import Tab = chrome.tabs.Tab;
import {useEffect} from "react";

type TabGroups = Tab[];
type WindowMap = Map<number, TabGroups>
let lastTab: undefined | Tab = undefined
export default function useCurrentTab():{tab: Tab | undefined, windows: TabGroups[] | undefined} {
  const { data: tab,mutate } = useSWR<Tab | undefined>(
    `/tab/currentTab/`,
    getTabInfo
  )
  const { data: windowTabs } = useSWR<TabGroups[]>(
    `/tab/windows/`,
    getAllWindows,
    {
      fallbackData: [],
    }
  )

  useEffect(function () {
      if(chrome && chrome.tabs){
          chrome.tabs.onActivated.addListener(function () {
              mutate();
          })
      }
  },[])

  async function getTabInfo() {
    let currentTabId: number|undefined;
    if(!currentTabId){
      const result = await extApi.user.getWhoAmI();
      // @ts-ignore;
      const tab = result.data?.sender?.tab as Tab;
      currentTabId = tab?.id;
    }

    if(!currentTabId){
      const res = await extApi.developer
          .chrome({
            type: 'query', method: 'query',
            namespace: 'tabs',
            args: [{ active: true, lastFocusedWindow: true }],
            arguments: [{ active: true, lastFocusedWindow: true }],
          });
      lastTab = (res.data || [])[0] || lastTab
      currentTabId = lastTab?.id;
    }

    return extApi.developer
        .chrome({
          type: 'get',
          method: 'get',
          namespace: 'tabs',
          args: [currentTabId],
          arguments: [currentTabId],
        })
        .then(function (res) {
          return res.data as Tab
        })
  }

  function getAllWindows() {
    return extApi.commonAction.queryTabs({}).then(function (res) {
      const windowMap: WindowMap = new Map<number, TabGroups>();
      (res.data || []).forEach(function (item: Tab) {
        const newTabs = (windowMap.get(item.windowId) || []).concat(item)
        windowMap.set(item.windowId, newTabs)
      })
      return Array.from(windowMap.values())
    })
  }

  return {
    tab: tab,
    windows: windowTabs,
  }
}
