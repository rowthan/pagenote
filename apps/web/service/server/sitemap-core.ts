import { SITEMAP_BLOCKED_PREFIXES, SitemapEntry } from '../../const/sitemap'

const DEFAULT_SITE_URL = 'https://pagenote.cn'
const MAX_SITEMAP_URLS = 50_000

export type NormalizedSitemapEntry = {
  path: string
  lastModified?: string
  changeFrequency?: SitemapEntry['changeFrequency']
  priority?: number
}

function escapeXml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

function normalizeLastModified(value?: string | Date) {
  if (!value) return undefined

  const date = value instanceof Date ? value : new Date(value)
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString()
}

function isBlockedPath(pathname: string) {
  return SITEMAP_BLOCKED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  )
}

export function normalizeSiteUrl(value?: string) {
  try {
    const url = new URL(value || DEFAULT_SITE_URL)
    if (!['http:', 'https:'].includes(url.protocol)) return DEFAULT_SITE_URL

    return url.origin
  } catch {
    return DEFAULT_SITE_URL
  }
}

export function normalizeSitemapPath(
  value: string,
  siteUrl = DEFAULT_SITE_URL
) {
  const candidate = value?.trim()
  if (!candidate || /(?:^|\/)\.{1,2}(?:\/|$)/.test(candidate)) return null

  try {
    const origin = normalizeSiteUrl(siteUrl)
    const url = new URL(candidate, `${origin}/`)

    if (url.origin !== origin) return null

    const pathname =
      url.pathname === '/'
        ? '/'
        : url.pathname.replace(/\/{2,}/g, '/').replace(/\/$/, '')

    return isBlockedPath(pathname) ? null : pathname
  } catch {
    return null
  }
}

function mergeEntries(
  current: NormalizedSitemapEntry,
  incoming: NormalizedSitemapEntry
) {
  const latestLastModified = [current.lastModified, incoming.lastModified]
    .filter((value): value is string => Boolean(value))
    .sort()
    .at(-1)
  const priorities = [current.priority, incoming.priority].filter(
    (value): value is number => value !== undefined
  )

  return {
    ...incoming,
    ...current,
    lastModified: latestLastModified,
    priority: priorities.length ? Math.max(...priorities) : undefined,
  }
}

export function normalizeSitemapEntries(
  entries: SitemapEntry[],
  siteUrl = DEFAULT_SITE_URL
) {
  const normalized = new Map<string, NormalizedSitemapEntry>()

  for (const entry of entries) {
    const path = normalizeSitemapPath(entry.path, siteUrl)
    if (!path) continue

    const nextEntry: NormalizedSitemapEntry = {
      path,
      lastModified: normalizeLastModified(entry.lastModified),
      changeFrequency: entry.changeFrequency,
      priority:
        entry.priority === undefined
          ? undefined
          : Math.min(1, Math.max(0, entry.priority)),
    }
    const currentEntry = normalized.get(path)

    normalized.set(
      path,
      currentEntry ? mergeEntries(currentEntry, nextEntry) : nextEntry
    )
  }

  return [...normalized.values()]
    .sort((left, right) => {
      if (left.path === '/') return -1
      if (right.path === '/') return 1
      return left.path.localeCompare(right.path)
    })
    .slice(0, MAX_SITEMAP_URLS)
}

export function renderSitemapXml(
  entries: SitemapEntry[],
  siteUrl = DEFAULT_SITE_URL
) {
  const origin = normalizeSiteUrl(siteUrl)
  const normalizedEntries = normalizeSitemapEntries(entries, origin)
  const urls = normalizedEntries
    .map((entry) => {
      const fields = [`    <loc>${escapeXml(`${origin}${entry.path}`)}</loc>`]

      if (entry.lastModified) {
        fields.push(`    <lastmod>${entry.lastModified}</lastmod>`)
      }
      if (entry.changeFrequency) {
        fields.push(`    <changefreq>${entry.changeFrequency}</changefreq>`)
      }
      if (entry.priority !== undefined) {
        fields.push(`    <priority>${entry.priority.toFixed(1)}</priority>`)
      }

      return `  <url>\n${fields.join('\n')}\n  </url>`
    })
    .join('\n')

  return {
    count: normalizedEntries.length,
    xml: [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
      urls,
      '</urlset>',
      '',
    ].join('\n'),
  }
}
