import Tab = chrome.tabs.Tab
import extApi from '@pagenote/shared/lib/pagenote-api'
import { isExt } from '../const/env'

export function refreshTab(tab?: Tab) {
  function callback() {
    setTimeout(function () {
      window.location.reload()
    }, 1000)
  }
  if (tab?.id) {
    if (isExt && chrome?.tabs) {
      chrome?.tabs?.reload(tab?.id, {}, callback)
    } else {
      extApi.developer
        .chrome({
          namespace: 'tabs',
          type: 'reload',
          method: 'reload',
          args: [tab?.id],
          arguments: [tab?.id]
        })
        .then(function () {
          callback()
        })
    }
  }
}

export function focus(tab: Tab) {
    if (isExt && chrome && chrome.tabs && tab.id) {
        chrome.tabs.update({})

        chrome.windows.update(tab.windowId, {
            focused: true
        })

        chrome.tabs.highlight({
            tabs: [tab.index],
            windowId: tab.windowId
        })
    }else{
        extApi.developer.chrome({
            namespace:'windows',
            method: 'update',
            arguments:[
                tab.windowId,
                {
                    focused: true
                }
            ]
        })

        extApi.developer.chrome({
            namespace: "tabs",
            arguments: [
                {
                    tabs: [tab.index],
                    windowId: tab.windowId
                }
            ],
            method: "highlight"
        }).then(function (res) {
            console.log(res,'higlight')
        })
    }
}


export function enablePagenote(tabId?: number) {
    return extApi.developer.requestFront({
        type: 'togglePagenote',
        params: undefined,
        // @ts-ignore
        header:{
            targetTabId: tabId
        }
    })
}

export function captureVisibleAsImage() {
    chrome.tabs.captureVisibleTab({format:'jpeg',quality:40}, function(screenshotUrl) {
        extApi.developer.requestFront({
            // @ts-ignore
            header: {

            },
            params: {
                imageStr: screenshotUrl,
                isAuto: false,
            },
            type: 'onCaptureView'
        })
    });
}
