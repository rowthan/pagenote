import { Html, Head, Main, NextScript } from 'next/document'
// 运行在服务端
export default function Document() {
  return (
    <Html lang="zh">
      <Head>
        <link rel="icon" href="/brand/pagenote-icon.png" type="image/png" />
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
        <meta property="og:image" content="/product/promo-marquee.png" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
