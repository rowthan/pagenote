import Head from 'next/head'
import Link from 'next/link'
import { FiArrowRight, FiCheck, FiFileText, FiImage, FiLayers, FiMessageCircle, FiShield, FiTag } from 'react-icons/fi'
import BrowserInstallCta from '../components/BrowserInstallCta'
import styles from '../styles/home.module.scss'

const featureRows = [
  { icon: FiFileText, number: '01', title: '网页与 PDF 高亮', body: '选中内容，留下重点。高亮会和原文上下文一起保存。' },
  { icon: FiMessageCircle, number: '02', title: '原文旁添加批注', body: '把问题、解释和灵感写在它发生的地方，不打断阅读。' },
  { icon: FiImage, number: '03', title: '截图与图片标记', body: '保存图表、页面状态和视觉证据，让资料不只是一段文字。' },
  { icon: FiTag, number: '04', title: '标签与搜索', body: '按网站、时间和标签整理，在需要的时候快速找回。' },
  { icon: FiLayers, number: '05', title: '离线 HTML 存档', body: '重要网页可以留在本地，即使原页面更新或失效也能回看。' },
  { icon: FiShield, number: '06', title: '本地优先', body: '无需登录即可开始，基础笔记数据默认保存在当前浏览器。' },
]

const faqs = [
  ['需要注册账号吗？', '不需要。安装扩展后即可开始高亮、批注、截图和保存网页。'],
  ['支持哪些浏览器？', '目前支持 Chrome、Edge 和 Firefox。首页会根据当前浏览器推荐对应的安装入口。'],
  ['PAGENOTE 支持 PDF 吗？', '支持。对于可选择文字的 PDF，可以进行高亮和批注；图片型扫描 PDF 可能需要先具备文字层。'],
  ['我的笔记保存在哪里？', '基础笔记数据默认保存在当前浏览器的本地空间。卸载扩展或清理浏览器数据前，请先完成备份。'],
]

const productShots = [
  { src: '/product/highlight-anywhere.png', title: '网页与 PDF 高亮', body: '在原文中留下重点和自己的判断。' },
  { src: '/product/notes-in-context.png', title: '批注留在上下文里', body: '引用、想法和来源始终保持关联。' },
  { src: '/product/local-data-privacy.png', title: '本地优先保存', body: '无需登录即可开始，数据由你管理。' },
]

export default function Home() {
  return (
    <>
      <Head>
        <title>PAGENOTE 一页一记：小而美的网页标记、剪藏工具</title>
        <meta name="description" content="PAGENOTE 是一款小而美的网页标记、剪藏工具，支持网页、图片和 PDF 高亮、批注、截图与离线存档。免费、无需登录。" />
        <meta name="keywords" content="网页标记,网页剪藏,网页高亮,PDF批注,浏览器插件,离线存档,PAGENOTE,一页一记" />
        <meta property="og:title" content="PAGENOTE 一页一记：小而美的网页标记、剪藏工具" />
        <meta property="og:description" content="看到重点，顺手标记；遇到好内容，随手剪藏。" />
        <meta property="og:image" content="/product/promo-marquee.png" />
        <meta property="og:url" content="https://pagenote.cn/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="PAGENOTE 一页一记：小而美的网页标记、剪藏工具" />
        <meta name="twitter:description" content="看到重点，顺手标记；遇到好内容，随手剪藏。" />
        <meta name="twitter:image" content="https://pagenote.cn/product/promo-marquee.png" />
        <link rel="canonical" href="https://pagenote.cn/" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'SoftwareApplication', name: 'PAGENOTE 一页一记', applicationCategory: 'BrowserApplication', operatingSystem: 'Chrome, Edge, Firefox', description: '小而美的网页标记、剪藏工具，支持网页、图片和 PDF 高亮、批注、截图与离线存档。', url: 'https://pagenote.cn/' }) }} />
      </Head>
      <div className={styles.home}>
        <header className={styles.nav}>
          <Link href="/" className={styles.logo} aria-label="PAGENOTE 首页"><img src="/brand/pagenote-icon.png" alt="" /><strong>PAGENOTE</strong></Link>
          <nav className={styles.navLinks} aria-label="主导航">
            <a href="#how-it-works">怎么用</a>
            <Link href="/docs">文档</Link>
            <Link href="/faq">FAQ</Link>
          </nav>
          <BrowserInstallCta compact />
        </header>

        <main>
          <section className={styles.hero}>
            <div className={styles.heroCopy}>
              <div className={styles.eyebrow}><span />小而美的网页标记、剪藏工具</div>
              <h1>看到重点，<br /><em>顺手留下来。</em></h1>
              <p className={styles.heroLead}>PAGENOTE（一页一记）是一款轻巧的网页标记、剪藏工具。在网页、图片和 PDF 中高亮、批注、截图，把值得留下的内容收进自己的资料库。</p>
              <BrowserInstallCta />
              <div className={styles.trustRow}><span><FiCheck aria-hidden="true" /> 无需登录</span><span><FiCheck aria-hidden="true" /> 本地优先</span><span><FiCheck aria-hidden="true" /> 支持备份导出</span></div>
            </div>
            <figure className={styles.heroVisual}><img src="/product/promo-marquee.png" alt="PAGENOTE 网页高亮与笔记产品界面" /></figure>
          </section>

          <section className={styles.strip} aria-label="产品能力摘要">
            <span>网页</span><i /> <span>PDF</span><i /> <span>图片</span><i /> <span>标签</span><i /> <span>离线存档</span>
          </section>

          <section id="how-it-works" className={styles.workflow}>
            <div><span className={styles.sectionLabel}>HOW IT WORKS</span><h2>三步，留下<br /><em>值得剪藏的内容。</em></h2></div>
            <ol>
              <li><b>01</b><span>选中内容</span><small>在网页或 PDF 中选择你想留下的文字。</small></li>
              <li><b>02</b><span>留下想法</span><small>添加高亮、批注、标签或截图。</small></li>
              <li><b>03</b><span>随时找回</span><small>通过原文、标签和搜索重新进入上下文。</small></li>
            </ol>
          </section>

          <section id="features" className={styles.featuresSection}>
            <div className={styles.sectionIntro}><div><span className={styles.sectionLabel}>WHAT YOU CAN DO</span><h2>轻轻一点，<br /><em>标记和剪藏网页。</em></h2></div><Link href="/docs" className={styles.inlineLink}>查看使用文档 <FiArrowRight aria-hidden="true" /></Link></div>
            <div className={styles.featureGrid}>
              {featureRows.map(({ icon: Icon, number, title, body }) => <article key={title} className={styles.featureCard}><div className={styles.featureTop}><span>{number}</span><Icon aria-hidden="true" /></div><h3>{title}</h3><p>{body}</p></article>)}
            </div>
          </section>

          <section className={styles.productGallery} aria-label="PAGENOTE 产品功能截图">
            <div className={styles.galleryHeading}><span className={styles.sectionLabel}>MADE FOR READING</span><h2>每个重点，<br /><em>都保留原来的位置。</em></h2></div>
            <div className={styles.galleryGrid}>{productShots.map((shot) => <article key={shot.src} className={styles.galleryCard}><img src={shot.src} alt={shot.title} /><div><h3>{shot.title}</h3><p>{shot.body}</p></div></article>)}</div>
          </section>

          <section className={styles.localFirst}>
            <div><span className={styles.sectionLabel}>LOCAL FIRST</span><h2>你的阅读记录，<br /><em>由你自己保管。</em></h2></div>
            <div className={styles.localCopy}><p>基础笔记默认保存在当前浏览器。不要求注册账号，也不会因为没有账号而无法开始。</p><Link href="/docs/privacy" className={styles.inlineLink}>了解数据与隐私 <FiArrowRight aria-hidden="true" /></Link></div>
          </section>

          <section className={styles.faqSection} id="faq">
            <div className={styles.faqHeading}><span className={styles.sectionLabel}>FAQ</span><h2>开始之前，<br /><em>你可能想知道。</em></h2><Link href="/faq" className={styles.inlineLink}>查看全部问题 <FiArrowRight aria-hidden="true" /></Link></div>
            <div className={styles.faqList}>{faqs.map(([question, answer]) => <details key={question}><summary>{question}<span>+</span></summary><p>{answer}</p></details>)}</div>
          </section>

          <section className={styles.finalCta}><span className={styles.sectionLabel}>READY WHEN YOU ARE</span><h2>让读过的内容，<br /><em>真正留下来。</em></h2><BrowserInstallCta /></section>
        </main>

        <footer className={styles.footer}><div><Link href="/" className={styles.logo}><img src="/brand/pagenote-icon.png" alt="" /><strong>PAGENOTE</strong></Link><p>小而美的网页标记、剪藏工具。</p></div><div className={styles.footerLinks}><Link href="/docs">文档</Link><Link href="/faq">FAQ</Link><Link href="/release">更新日志</Link><Link href="/privacy">隐私</Link><Link href="/feedback">反馈</Link></div></footer>
      </div>
    </>
  )
}
