import Head from 'next/head'
import Link from 'next/link'
import { FiArrowRight, FiCheck, FiCommand, FiTag } from 'react-icons/fi'
import styles from '../styles/welcome.module.scss'

const steps = [
  { number: '01', title: '打开一篇网页', description: '文章、资料、教程或 PDF，都可以成为你的下一条笔记。' },
  { number: '02', title: '选中内容并标记', description: '选中一句话，点击选区旁的 PAGENOTE 按钮，立即留下高亮。' },
  { number: '03', title: '写下想法，随时找回', description: '补一条批注或标签，再从浏览器工具栏的 PAGENOTE 图标找回它。' },
]

export default function WelcomePage() {
  return <>
    <Head>
      <title>欢迎使用 PAGENOTE｜30 秒留下第一条重点</title>
      <meta name="description" content="PAGENOTE 新用户快速上手：在网页上标记、批注和剪藏重要内容。" />
      <meta name="keywords" content="PAGENOTE,网页标记,网页剪藏,浏览器插件,新手引导" />
      <meta property="og:title" content="欢迎使用 PAGENOTE" />
      <meta property="og:description" content="30 秒留下第一条重点。打开网页、选中内容、顺手留下来。" />
      <meta property="og:url" content="https://pagenote.cn/welcome" />
      <link rel="canonical" href="https://pagenote.cn/welcome" />
    </Head>
    <main className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.brand} aria-label="PAGENOTE 首页"><img src="/brand/pagenote-icon.png" alt="" /><span>PAGENOTE</span></Link>
        <div className={styles.headerRight}><span className={styles.installed}><FiCheck aria-hidden="true" /> 已安装</span><Link href="/docs/getting-started" className={styles.docsLink}>查看文档 <FiArrowRight aria-hidden="true" /></Link></div>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <span className={styles.eyebrow}>WELCOME TO PAGENOTE</span>
          <h1>30 秒，留下<br /><em>第一条重点。</em></h1>
          <p className={styles.lead}>PAGENOTE 是一个小而美的网页标记、剪藏工具。看到重要内容，选中它，顺手留下来。</p>
          <a className={styles.startButton} href="#start">开始第一次标记 <FiArrowRight aria-hidden="true" /></a>
          <p className={styles.hint}>现在打开任意网页，按下面三步试试看。</p>
        </div>
        <div className={styles.heroVisual}><div className={styles.visualLabel}><span /> 选中重点，就能留下</div><img src="/product/highlight-anywhere.png" alt="在网页中选中文字后创建高亮" /></div>
      </section>

      <section id="start" className={styles.stepsSection}>
        <div className={styles.sectionHeading}><span className={styles.eyebrow}>HOW IT WORKS</span><h2>只需要三步。</h2><p>不用整理复杂的文件夹，也不用离开正在阅读的页面。</p></div>
        <div className={styles.steps}>{steps.map((step) => <article key={step.number} className={styles.step}><span className={styles.stepNumber}>{step.number}</span><h3>{step.title}</h3><p>{step.description}</p></article>)}</div>
      </section>

      <section className={styles.trySection}>
        <div className={styles.tryCopy}><span className={styles.eyebrow}>YOUR FIRST NOTE</span><h2>先留下一个<br /><em>值得回看的瞬间。</em></h2><p>PAGENOTE 会把高亮和上下文一起保存。下次回来，你不必重新翻遍整篇文章。</p><div className={styles.featureList}><span><FiCheck aria-hidden="true" /> 高亮与原文上下文一起保存</span><span><FiTag aria-hidden="true" /> 用批注和标签补充自己的想法</span></div></div>
        <div className={styles.tryVisual}><img src="/product/notes-in-context.png" alt="PAGENOTE 在原文上下文中保存批注" /></div>
      </section>

      <section className={styles.shortcuts} aria-label="常用快捷键"><div><FiCommand aria-hidden="true" /><span><kbd>Alt</kbd> + <kbd>P</kbd></span><small>打开 PAGENOTE</small></div><div><FiCommand aria-hidden="true" /><span><kbd>Alt</kbd> + <kbd>D</kbd></span><small>保存离线网页</small></div></section>
      <footer className={styles.footer}><div><strong>已经准备好了。</strong><span>去打开一篇网页，留下你的第一条重点。</span></div><Link href="/docs/getting-started" className={styles.footerButton}>查看完整指南 <FiArrowRight aria-hidden="true" /></Link></footer>
    </main>
  </>
}
