import { useRouter } from 'next/router'
import { useEffect } from 'react'
import Head from 'next/head'
import { getNotionDocDetail } from '../service/server/doc'
import { SEO_REVERT_MAP } from '../const/notion'
import NotionDoc, { NotionDocProp } from '../components/NotionDoc'

const redirectMap: Record<string, string> = {
  '/log': '/developer/log',
  '/projects': '/developer/project',
  '/feedback': '/contact/feedback',
  '/debug': '',
  '/demo': '/developer/demo',
  '/trash': '/manage/trash',
  '/page': '/manage/page',
  '/light': '/manage/light',
  '/manage/pages': '/manage/page',
  '/setting': '/ext/setting',
  '/pagenote': '/ext/manage',
  '/signup': '/signin',
  '/me': '/pagenote',
  '/webpage': '/pagenote',
  '/post': '/sitemap',
  '/data': '/ext/setting#/setting/data',
}

export const getStaticProps = async () => {
  return await getNotionDocDetail(SEO_REVERT_MAP['/404'], false)
}

export default function Custom404(props: NotionDocProp) {
  const router = useRouter()

  useEffect(
    function () {
      const redirectUrl = redirectMap[router.asPath]
      if (redirectUrl) {
        router.replace(redirectUrl)
      } else {
        if (router.asPath.indexOf('.html') > -1) {
          const path = router.asPath.replace('.html', '')
          router.replace(path)
        }
      }
    },
    [router.asPath]
  )

  return (
    <div>
      <Head>
        <title>闯入了一片无人之境-404</title>
      </Head>
      <NotionDoc {...props} />
    </div>
  )
}
