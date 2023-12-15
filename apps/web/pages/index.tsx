import NotionDoc, { NotionDocProp } from 'components/NotionDoc'
import { getNotionDocDetail } from 'service/server/doc'
import { SEO_REVERT_MAP } from '../const/notion'

export const getStaticProps = async () => {
  return await getNotionDocDetail(SEO_REVERT_MAP['/'])
}

export default function Page(props: NotionDocProp) {
  return <NotionDoc {...props} />
}
