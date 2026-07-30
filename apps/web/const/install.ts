export type InstallStore = 'chrome' | 'edge' | 'firefox'

export const INSTALL_TARGETS: Record<InstallStore, {
  label: string
  name: string
  url: string
}> = {
  chrome: {
    label: '安装到 Chrome',
    name: 'Chrome',
    url: 'https://chromewebstore.google.com/detail/pagenote/hpekbddiphlmlfjebppjhemobaopekmp',
  },
  edge: {
    label: '安装到 Edge',
    name: 'Edge',
    url: 'https://microsoftedge.microsoft.com/addons/detail/ablhdlecfphodoohfacojdngdfkgneaa',
  },
  firefox: {
    label: '安装到 Firefox',
    name: 'Firefox',
    url: 'https://addons.mozilla.org/zh-CN/firefox/addon/pagenote/',
  },
}

export function detectInstallStore(userAgent = ''): InstallStore | undefined {
  const ua = userAgent.toLowerCase()
  if (ua.includes('edg/')) return 'edge'
  if (ua.includes('firefox/')) return 'firefox'
  if (ua.includes('chrome/') || ua.includes('chromium/')) return 'chrome'
  return undefined
}
