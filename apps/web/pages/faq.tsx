import { FAQS } from '../const/docs'
import DocsLayout from '../components/DocsLayout'
import styles from '../styles/docs.module.scss'

export default function FAQPage() {
  return <DocsLayout title="常见问题" canonicalPath="/faq" description="PAGENOTE 安装、浏览器、PDF、数据和隐私相关的常见问题。"><div className={styles.faqPage}><span className={styles.sectionLabel}>PAGENOTE FAQ</span><h1>常见问题。</h1><p>安装之前或使用过程中遇到疑问，可以先从这里找到答案。</p><div className={styles.faqItems}>{FAQS.map(([question, answer]) => <details key={question}><summary>{question}<span>+</span></summary><p>{answer}</p></details>)}</div></div></DocsLayout>
}
