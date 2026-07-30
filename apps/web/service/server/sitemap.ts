import cachedDocs from '../../.cache/docs.json'
import { SEO_MAP } from '../../const/notion'
import { STATIC_SITEMAP_ENTRIES, SitemapEntry } from '../../const/sitemap'
import { getOfficialNotion } from './notion'
import { normalizeSiteUrl, renderSitemapXml } from './sitemap-core'

type NotionPage = {
  object?: string
  last_edited_time?: string
  properties?: Record<
    string,
    {
      type?: string
      url?: string | null
    }
  >
}

type CachedDoc = {
  path?: string | null
}

export type SitemapSource = 'notion' | 'cache'

function getNotionPagePath(page: NotionPage) {
  const pathProperty = Object.entries(page.properties || {}).find(
    ([name]) => name.toLowerCase() === 'path'
  )?.[1]

  return pathProperty?.type === 'url' ? pathProperty.url : null
}

async function getNotionEntries(): Promise<SitemapEntry[] | null> {
  if (!process.env.NOTION_TOKEN) return null

  const notion = getOfficialNotion()
  if (!notion) return null

  const entries: SitemapEntry[] = []
  let cursor: string | undefined

  try {
    do {
      const result = await notion.search({
        filter: {
          property: 'object',
          value: 'page',
        },
        sort: {
          timestamp: 'last_edited_time',
          direction: 'descending',
        },
        page_size: 100,
        start_cursor: cursor,
      })

      for (const resultItem of result.results) {
        const page = resultItem as unknown as NotionPage
        const path = getNotionPagePath(page)

        if (page.object === 'page' && path) {
          entries.push({
            path,
            lastModified: page.last_edited_time,
            changeFrequency: 'weekly',
            priority: 0.6,
          })
        }
      }

      cursor = result.has_more ? result.next_cursor || undefined : undefined
    } while (cursor)

    return entries
  } catch (error) {
    console.error('[sitemap] Unable to read Notion pages, using cache.', error)
    return null
  }
}

function getCachedEntries(): SitemapEntry[] {
  return (cachedDocs as CachedDoc[])
    .filter((doc): doc is { path: string } => Boolean(doc.path))
    .map(({ path }) => ({
      path,
      changeFrequency: 'weekly',
      priority: 0.6,
    }))
}

function getMappedEntries(): SitemapEntry[] {
  return Object.values(SEO_MAP).map((path) => ({
    path,
    changeFrequency: 'weekly',
    priority: 0.6,
  }))
}

export async function generateSitemap() {
  const notionEntries = await getNotionEntries()
  const source: SitemapSource = notionEntries ? 'notion' : 'cache'
  const contentEntries = notionEntries ?? getCachedEntries()
  const entries = [
    ...STATIC_SITEMAP_ENTRIES,
    ...getMappedEntries(),
    ...contentEntries,
  ]
  const siteUrl = normalizeSiteUrl(
    process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL
  )

  return {
    ...renderSitemapXml(entries, siteUrl),
    source,
  }
}
