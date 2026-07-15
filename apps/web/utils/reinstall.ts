import { BrowserType, getBrowserTypeAndVersion } from '@pagenote/shared/utils'
import type { UninstallContext } from './uninstall'

export type SupportedInstallStore = 'chrome' | 'edge'

export type InstallTarget = {
  store: SupportedInstallStore
  name: string
  url: string
}

const INSTALL_TARGETS: Record<
  SupportedInstallStore,
  Omit<InstallTarget, 'store'>
> = {
  chrome: {
    name: 'Chrome浏览器',
    url: 'https://chromewebstore.google.com/detail/pagenote/hpekbddiphlmlfjebppjhemobaopekmp',
  },
  edge: {
    name: 'Edge浏览器',
    url: 'https://microsoftedge.microsoft.com/addons/detail/ablhdlecfphodoohfacojdngdfkgneaa',
  },
}

const CHROME_WEB_STORE_PROBE_URL =
  'https://chromewebstore.google.com/favicon.ico'

function browserToStore(browser?: string): SupportedInstallStore | undefined {
  const normalized = browser?.toLowerCase() || ''
  if (normalized.includes('edge') || normalized === 'edg') return 'edge'
  if (normalized) return 'chrome'
  return undefined
}

export function detectUninstallStore(
  context?: UninstallContext | null
): SupportedInstallStore {
  if (context?.store === 'edge') return 'edge'
  if (context?.store) return 'chrome'

  const contextBrowser = browserToStore(context?.browser)
  if (contextBrowser) return contextBrowser
  if (typeof navigator === 'undefined') return 'chrome'

  const detected = getBrowserTypeAndVersion().type
  return detected === BrowserType.Edge ? 'edge' : 'chrome'
}

export function getInstallTarget(
  context?: UninstallContext | null
): InstallTarget {
  const store = detectUninstallStore(context)
  return {
    store,
    ...INSTALL_TARGETS[store],
  }
}

export async function canReachChromeWebStore(
  fetchImpl: typeof fetch = fetch,
  timeoutMs = 2500
): Promise<boolean> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)

  try {
    await fetchImpl(CHROME_WEB_STORE_PROBE_URL, {
      method: 'GET',
      mode: 'no-cors',
      cache: 'no-store',
      credentials: 'omit',
      referrerPolicy: 'no-referrer',
      signal: controller.signal,
    })
    return true
  } catch {
    return false
  } finally {
    clearTimeout(timeout)
  }
}

export async function resolveReinstallDestination(
  target: InstallTarget,
  chromeReachabilityCheck: () => Promise<boolean> = canReachChromeWebStore
): Promise<string> {
  if (target.store === 'edge') return target.url
  return (await chromeReachabilityCheck()) ? target.url : '/download'
}
