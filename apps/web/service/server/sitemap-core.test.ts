import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import {
  normalizeSiteUrl,
  normalizeSitemapEntries,
  normalizeSitemapPath,
  renderSitemapXml,
} from './sitemap-core'

describe('sitemap generation', () => {
  it('normalizes the configured site origin', () => {
    assert.equal(
      normalizeSiteUrl('https://example.com/some/path'),
      'https://example.com'
    )
    assert.equal(normalizeSiteUrl('javascript:alert(1)'), 'https://pagenote.cn')
  })

  it('only accepts public, same-origin paths', () => {
    assert.equal(normalizeSitemapPath('/docs/start/'), '/docs/start')
    assert.equal(
      normalizeSitemapPath('https://pagenote.cn/release?from=test#top'),
      '/release'
    )
    assert.equal(normalizeSitemapPath('https://example.com/page'), null)
    assert.equal(normalizeSitemapPath('/api/docs'), null)
    assert.equal(normalizeSitemapPath('/manage/page'), null)
    assert.equal(normalizeSitemapPath('/uninstall'), null)
    assert.equal(normalizeSitemapPath('../privacy'), null)
  })

  it('deduplicates paths and keeps the strongest metadata', () => {
    const entries = normalizeSitemapEntries([
      {
        path: '/release',
        lastModified: '2025-01-01',
        changeFrequency: 'monthly',
        priority: 0.8,
      },
      {
        path: '/release/',
        lastModified: '2026-01-01',
        changeFrequency: 'daily',
        priority: 0.6,
      },
    ])

    assert.deepEqual(entries, [
      {
        path: '/release',
        lastModified: '2026-01-01T00:00:00.000Z',
        changeFrequency: 'monthly',
        priority: 0.8,
      },
    ])
  })

  it('renders valid XML without inventing last-modified dates', () => {
    const { count, xml } = renderSitemapXml(
      [
        { path: '/', priority: 1 },
        {
          path: '/search & learn',
          lastModified: '2026-03-04T05:06:07Z',
          changeFrequency: 'weekly',
        },
      ],
      'https://example.com'
    )

    assert.equal(count, 2)
    assert.match(xml, /<loc>https:\/\/example\.com\/<\/loc>/)
    assert.match(
      xml,
      /<loc>https:\/\/example\.com\/search%20&amp;%20learn<\/loc>/
    )
    assert.match(xml, /<lastmod>2026-03-04T05:06:07.000Z<\/lastmod>/)
    assert.equal((xml.match(/<lastmod>/g) || []).length, 1)
  })
})
