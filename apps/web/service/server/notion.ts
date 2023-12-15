import { Client } from '@notionhq/client'
// todo 这个包，没有跟上 notion 官方的更新，2个月后再看看
// import { NotionAPI } from 'notion-client'
import { NotionAPI } from '@texonom/nclient'

export function getOfficialNotion() {
  const token = process.env.NOTION_TOKEN || ''
  if (!token) {
    console.warn(
      'notion token unset. SEO might be disabled. config it in .env file, like: => NOTION_TOKEN=fill_you_code'
    )
    return null
  }
  return new Client({
    auth: token,
  })
}

export function getUnOfficialNotion() {
  return new NotionAPI({})
}
