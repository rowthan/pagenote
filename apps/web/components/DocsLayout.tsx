import { useMemo, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { FiArrowLeft, FiBookOpen, FiChevronRight, FiSearch } from 'react-icons/fi'
import { DOCS, DOC_SECTIONS, DocEntry } from '../const/docs'
import BrowserInstallCta from './BrowserInstallCta'
import styles from '../styles/docs.module.scss'

export default function DocsLayout({ children, activeSlug, title, description, canonicalPath = '/docs' }: { children: React.ReactNode; activeSlug?: string; title: string; description?: string; canonicalPath?: string }) {
  const [query, setQuery] = useState('')
  const filteredDocs = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    if (!normalizedQuery) return DOCS
    return DOCS.filter((doc) => `${doc.title} ${doc.description} ${doc.section}`.toLowerCase().includes(normalizedQuery))
  }, [query])

  return (
    <>
      <Head>
        <title>{`${title} · PAGENOTE 文档`}</title>
        <meta name="description" content={description || 'PAGENOTE 使用文档、功能指南和常见问题。'} />
        <link rel="canonical" href={`https://pagenote.cn${canonicalPath}`} />
      </Head>
      <div className={styles.docsShell}>
        <header className={styles.docsNav}>
          <Link href="/" className={styles.docsBrand}><img src="/brand/pagenote-icon.png" alt="" /><strong>PAGENOTE</strong><i>DOCS</i></Link>
          <nav><Link href="/">首页</Link><Link href="/faq">FAQ</Link><Link href="/release">更新日志</Link><Link href="/feedback">反馈</Link></nav>
          <BrowserInstallCta compact />
        </header>
        <div className={styles.docsLayout}>
          <aside className={styles.sidebar}>
            <Link href="/docs" className={styles.backLink}><FiArrowLeft /> 文档首页</Link>
            <label className={styles.search}><FiSearch /><input aria-label="搜索文档" placeholder="搜索文档" value={query} onChange={(event) => setQuery(event.target.value)} /></label>
            {DOC_SECTIONS.map((section) => {
              const sectionDocs = filteredDocs.filter((doc) => doc.section === section)
              if (!sectionDocs.length) return null
              return <div key={section} className={styles.sideSection}><h2>{section}</h2>{sectionDocs.map((doc) => <Link key={doc.slug} className={doc.slug === activeSlug ? styles.activeLink : ''} href={`/docs/${doc.slug}`}>{doc.title}<FiChevronRight /></Link>)}</div>
            })}
            {query.trim() && !filteredDocs.length && <p className={styles.emptySearch}>没有找到匹配的文档。</p>}
          </aside>
          <main className={styles.docMain}>{children}</main>
        </div>
      </div>
    </>
  )
}

export function DocArticle({ doc }: { doc: DocEntry }) {
  return <article className={styles.article}><div className={styles.breadcrumb}>文档 <FiChevronRight /> {doc.section}</div><h1>{doc.title}</h1><p className={styles.lead}>{doc.description}</p>{doc.content.map((item, index) => index % 2 === 0 ? <h2 key={`${item}-${index}`}>{item}</h2> : <p key={`${item}-${index}`}>{item}</p>)}<div className={styles.articleFooter}><Link href="/docs">返回文档首页</Link><span>内容会持续更新</span></div></article>
}

export function DocCard({ doc }: { doc: DocEntry }) {
  return <Link href={`/docs/${doc.slug}`} className={styles.docCard}><FiBookOpen /><div><h2>{doc.title}</h2><p>{doc.description}</p></div><FiChevronRight /></Link>
}
