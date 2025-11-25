import NotionDoc, { NotionDocProp } from 'components/notion/NotionDoc'
import {
  computeStaticPaths,
  getNotionDocDetail,
} from '../../service/server/doc'
import NotFound from 'components/error/NotFound'
import Footer from 'components/Footer'

export async function getStaticPaths() {
  const pages = await computeStaticPaths()
  console.log(pages,'static paths')
  return pages
}

export async function getStaticProps(props: { params: { paths: string[] } }) {
  const { params } = props
  let id = `/${params.paths.join('/')}`
  return await getNotionDocDetail(id)
}

export default function Page(props: NotionDocProp) {
  const { recordMap, title, path, keywords, description } = props || {}
  if (!recordMap) {
    return (
      <div className={'h-screen'}>
        <NotFound />
        <Footer />
      </div>
    )
  }
  return (
    <NotionDoc
      recordMap={recordMap}
      title={title}
      path={path}
      keywords={keywords}
      description={description}
    />
  )
}
