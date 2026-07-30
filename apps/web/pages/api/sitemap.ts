import { NextApiRequest, NextApiResponse } from 'next'
import { generateSitemap } from '../../service/server/sitemap'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  if (!['GET', 'HEAD'].includes(req.method || '')) {
    res.setHeader('Allow', 'GET, HEAD')
    res.status(405).end()
    return
  }

  const sitemap = await generateSitemap()

  res.setHeader('Content-Type', 'application/xml; charset=utf-8')
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=3600, stale-while-revalidate=86400'
  )
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Sitemap-Entries', sitemap.count.toString())
  res.setHeader('X-Sitemap-Source', sitemap.source)

  if (req.method === 'HEAD') {
    res.status(200).end()
    return
  }

  res.status(200).send(sitemap.xml)
}
