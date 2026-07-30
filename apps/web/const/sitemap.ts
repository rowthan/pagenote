import { DOCS } from './docs'

export type SitemapChangeFrequency =
  | 'always'
  | 'hourly'
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'yearly'
  | 'never'

export type SitemapEntry = {
  path: string
  lastModified?: string | Date
  changeFrequency?: SitemapChangeFrequency
  priority?: number
}

const MARKETING_ROUTES: SitemapEntry[] = [
  { path: '/', changeFrequency: 'weekly', priority: 1 },
  { path: '/welcome', changeFrequency: 'yearly', priority: 0.8 },
  { path: '/download', changeFrequency: 'monthly', priority: 0.9 },
  { path: '/docs', changeFrequency: 'weekly', priority: 0.9 },
  { path: '/faq', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/privacy', changeFrequency: 'yearly', priority: 0.5 },
  { path: '/release', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/feedback', changeFrequency: 'yearly', priority: 0.4 },
]

const DOC_ROUTES: SitemapEntry[] = DOCS.map(({ slug }) => ({
  path: `/docs/${slug}`,
  changeFrequency: 'monthly',
  priority: 0.7,
}))

/**
 * Stable, public pages owned by the application.
 *
 * Notion-backed routes are discovered separately so publishing a page does not
 * require editing this list.
 */
export const STATIC_SITEMAP_ENTRIES: SitemapEntry[] = [
  ...MARKETING_ROUTES,
  ...DOC_ROUTES,
]

/**
 * Application-only routes that must never be published by a content source.
 * A prefix blocks both the route itself and its descendants.
 */
export const SITEMAP_BLOCKED_PREFIXES = [
  '/api',
  '/account',
  '/bind-vip',
  '/developer/log',
  '/doc',
  '/docs/xxx',
  '/ext',
  '/expired',
  '/file',
  '/manage',
  '/oauth',
  '/offline',
  '/pro-plan',
  '/rate',
  '/redirect',
  '/setting',
  '/signin',
  '/uninstall',
  '/vip-bind',
  '/widget',
]
