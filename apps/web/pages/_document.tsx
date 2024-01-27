import { Html, Head, Main, NextScript } from 'next/document'
import {basePath} from "../const/env";
// 运行在服务端
export default function Document() {
  return (
    <Html lang="zh">
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@100;400;700&display=swap"
          rel="stylesheet"
        />
        <link
          rel="shortcut icon"
          href="https://pagenote.cn/favicon.ico"
          type="image/x-icon"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin={'anonymous'}
        />
        <meta name="color-scheme" content="dark light" />
        {/*<link rel="manifest" href="/manifest.json" />*/}
        <meta name="theme-color" content="#4e88e5" />
        <meta
          name="theme-color"
          media="(prefers-color-scheme: light)"
          content="#4e88e5"
        />
        <meta
          name="theme-color"
          media="(prefers-color-scheme: dark)"
          content="#4e88e5"
        />
        <meta property="og:image" content="/images/og.svg" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
