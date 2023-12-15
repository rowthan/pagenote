import { NotionRenderer } from 'react-notion-x'
import Doc from 'layouts/Doc'
import Footer from 'components/Footer'
import { ExtendedRecordMap, SearchParams } from 'notion-types'
import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
//import Image from 'next/image'
import Link from 'next/link'
import { TDK } from 'const/tdk'
import { DEFAULT_BASE_DOC_PATH, SEO_MAP, SEO_REVERT_MAP } from 'const/notion'
import { getPathFromProperties } from 'utils/notion'
import { useRouter } from 'next/router'
import TDKHead from './TDKHead'

const Code = dynamic(() =>
  import('react-notion-x/build/third-party/code').then((m) => m.Code)
)
const Collection = dynamic(() =>
  import('react-notion-x/build/third-party/collection').then(
    (m) => m.Collection
  )
)
const Equation = dynamic(() =>
  import('react-notion-x/build/third-party/equation').then((m) => m.Equation)
)
const Pdf = dynamic(
  () => import('react-notion-x/build/third-party/pdf').then((m) => m.Pdf),
  {
    ssr: false,
  }
)
const Modal = dynamic(
  () => import('react-notion-x/build/third-party/modal').then((m) => m.Modal),
  {
    ssr: false,
  }
)

export type NotionDocProp = {
  recordMap: ExtendedRecordMap // notion 原始数据
  title: string | null // 文章标题
  path: string | null // SEO 优化映射路径
  description: string | null
  keywords: string[]
} & Partial<Parameters<typeof NotionRenderer>[0]>

export default function NotionDoc(props: NotionDocProp) {
  const { recordMap, pageTitle, title, description, keywords } = props || {}
  const [darkMode, setDark] = useState<boolean>(false)
  const router = useRouter()

  function refreshDarkMode() {
    const darkMode =
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    setDark(darkMode)
  }

    function listenDarkMode() {
      const object = window.matchMedia('(prefers-color-scheme: dark)')
      object.addEventListener('change', refreshDarkMode)
      return function () {
        object.removeEventListener('change', refreshDarkMode)
      }
    }

    async function searchInNotion(filter: SearchParams) {
      const res = await fetch(`/api/search?keyword=${filter.query}`)
      return await res.json()
    }

    useEffect(function () {
      refreshDarkMode()
      return listenDarkMode()
    }, [])

    const headTitle = title || TDK.common.title
    const headDescription = description || TDK.common.description
    const headKeywords = keywords?.toString() || TDK.common.keywords

    return (
      <Doc>
        <TDKHead
          keywords={headKeywords}
          title={headTitle}
          description={headDescription}
          url={TDK.common.origin + router.asPath}
        ></TDKHead>
        <NotionRenderer
          components={{
            //nextImage: Image,
            nextLink: Link,
            Code,
            Collection,
            Equation,
            Modal,
            Pdf,
          }}
          pageTitle={pageTitle}
          fullPage={true}
          darkMode={darkMode}
          footer={<Footer />}
          searchNotion={searchInNotion}
          rootPageId={SEO_REVERT_MAP['/']}
          mapPageUrl={(pageID: string) => {
            if (SEO_MAP[pageID] as string) {
              return SEO_MAP[pageID]
            }
            const path = getPathFromProperties(recordMap.block[pageID]?.value)
            return path || `/${DEFAULT_BASE_DOC_PATH}/${pageID}`
          }}
          {...props}
        />
      </Doc>
    )
}
