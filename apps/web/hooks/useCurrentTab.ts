import extApi from "@pagenote/shared/lib/pagenote-api";
import useSWR from "swr";
import Tab = chrome.tabs.Tab;
import {useEffect} from "react";
import {callChrome} from "../utils/chrome";

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

          chrome.webNavigation && chrome.webNavigation.onCommitted.addListener(function () {
              mutate();
          })
      }
  },[])

  async function getTabInfo() {
    let currentTabId: number| string | undefined;


    /**基于URL指定tabid，适用于 popup/sidepanel 无上下文的场景*/
    if(!currentTabId){
        const search = new URLSearchParams(window.location.search);
        currentTabId = search.get('tabId')?.toString()
    }

      /**基于 API 响应 tabid,不适用于 popup/sidepanel 无上下文的场景*/
      if(!currentTabId){
          const result = await extApi.user.getWhoAmI();
          // @ts-ignore;
          const tab = result.data?.sender?.tab as Tab;
          currentTabId = tab?.id;
      }

    /**兜底方案，通过查询当前窗口*/
    if(!currentTabId){
      const res = await extApi.developer
          .chrome({
            method: 'query',
            namespace: 'tabs',
            arguments: [{ active: true, lastFocusedWindow: true }],
          });
      lastTab = (res.data || [])[0] || lastTab
      currentTabId = lastTab?.id;
    }

    const tabId = isNaN(Number(currentTabId)) ? currentTabId : Number(currentTabId)


    if(chrome && chrome.tabs){
        return chrome.tabs.get(tabId as number).then(function(res){
            return res;
        })
    }else{
        return callChrome<Tab>({
                method: 'get',
                namespace: 'tabs',
                arguments: [tabId],
            })
            .then(function (res) {
                return res
            })
    }
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
