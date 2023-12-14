import { PropsWithChildren } from 'react'
import Head from 'next/head'
// import {useTheme} from "next-themes";
import Breadcrumbs from '../components/Breadcrumbs'
import Footer from '../components/Footer'
import ErrorBoundary from '../components/debug/ErrorBound'
import Error from 'components/debug/ErrorTip'
import HelpAside from '../components/HelpAside'
import { Toaster } from '@/components/ui/toaster'

// 给普通用户访问的页面，基础layout
export default function BasicLayout(
  props: PropsWithChildren<{
    nav?: boolean
    footer?: boolean
    title?: string
    description?: string
    full?: boolean
  }>
) {
    // const { resolvedTheme, setTheme } = useTheme();

    const {children, nav = true, footer = true, ...customMeta} = props

    const meta = {
      title: customMeta.title || '小而美的网页标记工具 PAGENOTE',
      description: customMeta.description || `一页一记 pagenote，开发者中心.`,
      type: 'website',
    }

    return (
      // @ts-ignore
      <ErrorBoundary fallback={Error}>
        <>
          <Head>
            <title>{meta.title}</title>
            <meta name="robots" content="follow, index" />
            <meta content={meta.description} name="description" />
            <meta
              name={'keywords'}
              content="pagenote,小而美,网页标记,插件,浏览器"
            />

            <meta property="og:type" content={meta.type} />
            <meta property="og:site_name" content="PAGENOTE" />
            <meta property="og:description" content={meta.description} />
            <meta property="og:title" content={meta.title} />
            <link
              rel="shortcut icon"
              href="https://pagenote.cn/favicon.ico"
              type="image/x-icon"
            />
          </Head>
          {nav && (
            <nav>
              <Breadcrumbs />
            </nav>
          )}
          <main className="mx-auto relative min-h-fill">{children}</main>
          <HelpAside />
          {footer && <Footer />}
          <Toaster />
        </>
      </ErrorBoundary>
    )
}
