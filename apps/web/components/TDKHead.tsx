import { TDK } from '../const/tdk'
import Head from 'next/head'
import { ReactElement } from 'react'

interface Props {
  title?: string | null
  description?: string | null
  keywords?: string | null
  url?: string | null
  image?: string | null
  children?: ReactElement
}

export default function TDKHead(props: Props) {
  const { children, title, description, keywords, url, image } = props

  let headTitle = title || TDK.common.title
  const headDescription = description || TDK.common.description
  const headKeywords = keywords?.toString() || TDK.common.keywords

  headTitle = /pagenote|PAGENOTE/.test(headTitle)
    ? headTitle
    : headTitle + '·PAGENOTE'
  return (
    <Head>
      <title>{headTitle}</title>
      <meta name="description" content={headDescription}></meta>
      <meta name="keywords" content={headKeywords}></meta>
      <meta property="og:title" content={headTitle}></meta>
      <meta property="og:description" content={headDescription} />
      <meta property="og:url" content={url || TDK.common.origin} />
      <meta property="og:image" content="/images/og.svg" />
      {children}
    </Head>
  )
}

TDKHead.defaultProps = {}
