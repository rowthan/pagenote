import Link from 'next/link'
import { DOCS } from '../../const/docs'
import DocsLayout, { DocCard } from '../../components/DocsLayout'
import styles from '../../styles/docs.module.scss'

export default function DocsIndex() {
  return <DocsLayout title="文档首页" canonicalPath="/docs"><div className={styles.docIndex}><span className={styles.sectionLabel}>PAGENOTE DOCS</span><h1>从第一条高亮开始。</h1><p>了解 PAGENOTE 的安装、网页与 PDF 高亮、批注、资料整理、备份和隐私设置。</p><div className={styles.docCards}>{DOCS.map((doc) => <DocCard key={doc.slug} doc={doc} />)}<Link href="/faq" className={styles.docCard}><strong>常见问题</strong><span>安装、浏览器、数据和 PDF 使用问题</span></Link></div></div></DocsLayout>
}
