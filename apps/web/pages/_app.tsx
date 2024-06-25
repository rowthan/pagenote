import '../styles/globals.scss'
import '../styles/ext.scss'
import type { AppProps } from 'next/app'
// import { Analytics } from '@vercel/analytics/react'
// import { SpeedInsights } from '@vercel/speed-insights/next'
import Script from 'next/script'
import { basePath, isDev, isExt } from 'const/env'
import Head from 'next/head'
import { TDK } from 'const/tdk'
import {StrictMode, useEffect} from 'react'
import { getSessionStorageBridge} from "@pagenote/bridge";
import {Toaster} from "@/components/ui/toaster";

// 运行在客户端
function ClientApp({ Component, pageProps }: AppProps) {
    useEffect(() => {
        const sessionBridge = getSessionStorageBridge('document',{
            asServer: true,
            listenKey: "worker-message",
            timeout: 1000
        })

        return sessionBridge.addListener('out_of_date',function (data) {
            if(data.url!==window.self.location.href){
                return
            }
            // console.log('需要刷新:',window.self.location.href)
            // toast({
            //     title: "网页有更新",
            //     description: "正在访问的网页有更新版本，请点击刷新按钮",
            //     action: (
            //         <ToastAction altText="reload page" onClick={reload}>刷新网页</ToastAction>
            //     ),
            // })
        })
    }, []);
  return (
    <StrictMode>
      <Head>
        <title>{TDK.common.title}</title>
      </Head>
      {/*{!isExt && !isDev && <SpeedInsights />}*/}
      {/*{!isExt && !isDev && <Analytics />}*/}
      <Component {...pageProps} />
      <Script src={`${basePath}/components.js`} />
      <Script src={`${basePath}/lib/aliyun-oss-sdk.min.js`} />
      {!isExt && <Script src={`/worker-register.js`} />}
      <Toaster />
    </StrictMode>
  )
}

export default ClientApp
