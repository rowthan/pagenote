import Head from 'next/head'
import Link from 'next/link'
import BrowserInstallCta from './BrowserInstallCta'
import styles from '../styles/marketing.module.scss'

export default function MarketingLayout({ children, title, description }: { children: React.ReactNode; title: string; description: string }) {
  return <>
    <Head><title>{`${title} · PAGENOTE`}</title><meta name="description" content={description} /><meta property="og:image" content="/product/promo-marquee.png" /></Head>
    <div className={styles.shell}>
      <header className={styles.nav}>
        <Link href="/" className={styles.brand}><img src="/brand/pagenote-icon.png" alt="" /><strong>PAGENOTE</strong></Link>
        <nav><Link href="/">首页</Link><Link href="/docs">文档</Link><Link href="/faq">FAQ</Link><Link href="/release">更新日志</Link><Link href="/feedback">反馈</Link></nav>
        <BrowserInstallCta compact />
      </header>
      <main>{children}</main>
      <footer className={styles.footer}><Link href="/" className={styles.brand}><img src="/brand/pagenote-icon.png" alt="" /><strong>PAGENOTE</strong></Link><span>小而美的网页标记、剪藏工具。</span><Link href="/feedback">反馈</Link><Link href="/privacy">隐私政策</Link></footer>
    </div>
  </>
}
