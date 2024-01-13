import extApi from "@pagenote/shared/lib/pagenote-api";
import useSWR from "swr";
import Tab = chrome.tabs.Tab;

type TabGroups = Tab[];
type WindowMap = Map<number, TabGroups>
let lastTab: undefined | Tab = undefined
export default function useCurrentTab(tabId?: number):{tab: Tab | undefined, windows: TabGroups[] | undefined} {
  const { data: tab } = useSWR<Tab | undefined>(
    `/tab/currentTab/${tabId}`,
    getTabInfo
  )
  const { data: windowTabs } = useSWR<TabGroups[]>(
    `/tab/windows/${tabId}`,
    getAllWindows,
    {
      fallbackData: [],
    }
  )

  function getTabInfo() {
    if (tabId) {
      return extApi.developer
        .chrome({
          type: 'get',
          namespace: 'tabs',
          args: [tabId],
        })
        .then(function (res) {
          return res.data as Tab
        })
    }

    return extApi.developer
      .chrome({
        type: 'query',
        namespace: 'tabs',
        args: [{ active: true, lastFocusedWindow: true }],
      })
      .then(function (res) {
        lastTab = (res.data || [])[0] || lastTab
        return lastTab
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
