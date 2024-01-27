import '../styles/globals.scss'
import '../styles/ext.scss'
import type { AppProps } from 'next/app'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import Script from 'next/script'
import { basePath, isDev, isExt } from 'const/env'
import Head from 'next/head'
import { TDK } from 'const/tdk'
import { StrictMode } from 'react'

// 运行在客户端
function ClientApp({ Component, pageProps }: AppProps) {
  return (
    <StrictMode>
      <Head>
        <title>{TDK.common.title}</title>
      </Head>
      {!isExt && !isDev && <SpeedInsights />}
      {!isExt && !isDev && <Analytics />}
      <Component {...pageProps} />
      <Script src={`${basePath}/components.js`} />
      <Script src={`${basePath}/lib/aliyun-oss-sdk.min.js`} />
      {!isExt && <Script src={`/worker-register.js`} />}
    </StrictMode>
  )
}

export default ClientApp
