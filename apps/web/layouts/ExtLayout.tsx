import { PropsWithChildren } from 'react'
import Head from 'next/head'
import ErrorBoundary from '../components/debug/ErrorBound'
import Error from 'components/debug/ErrorTip'
import HelpAside from '../components/HelpAside'

export default function ExtLayout(
  props: PropsWithChildren<{
    title?: string
    description?: string
  }>
) {
    const {children, ...customMeta} = props

    const meta = {
        title: customMeta.title || '小而美的网页标记工具 PAGENOTE',
        description: customMeta.description || `一页一记 pagenote.`,
        type: 'website',
    }

    return (
        // @ts-ignore
        <ErrorBoundary fallback={Error}>
            <>
                <Head>
                    <title>{meta.title}</title>
                    <meta name="robots" content="follow, index"/>
                    <meta content={meta.description} name="description"/>
                    <meta property="og:type" content={meta.type}/>
                    <meta property="og:site_name" content="PAGENOTE"/>
                    <meta property="og:description" content={meta.description}/>
                    <meta property="og:title" content={meta.title}/>
                    <link
                        rel="shortcut icon"
                        href="https://pagenote.cn/favicon.ico"
                        type="image/x-icon"
                    />
                </Head>
                {children}
                <HelpAside/>
            </>
        </ErrorBoundary>
    )
}
