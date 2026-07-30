import MarketingLayout from '../components/MarketingLayout'
import styles from '../styles/marketing.module.scss'

const releases = [
  { version: '1.2.0', date: '2026-07-29', title: '数据导出功能', summary: '支持将数据导出到本地和 Obsidian。', image: '/product/release-export.png' },
  { version: '1.1.42', date: '2026-07-27', title: '菜单与大纲纯净模式', summary: '支持关闭划词菜单和大纲目录，也可以将 PAGENOTE 融入豆包、ChatGPT、千问等页面原生菜单。', image: '/product/release-integration.png' },
  { version: '1.1.39', date: '2026-07-20', title: '更方便的数据备份', summary: '支持导出 Markdown，并支持选中数据后下载备份数据包。' },
]

export default function ReleasePage() {
  return <MarketingLayout title="更新日志" canonicalPath="/release" description="PAGENOTE 产品更新、功能改进和版本发布记录。">
    <section className={styles.pageHero}><span className={styles.kicker}>RELEASE NOTES</span><h1>每一次更新，<br /><em>都让阅读更顺手。</em></h1><p>记录 PAGENOTE 的功能变化、体验改进和数据能力。</p></section>
    <section className={styles.releaseList}>{releases.map((release) => <article key={release.version} className={styles.releaseCard}><div className={styles.releaseMeta}><strong>v{release.version}</strong><span>{release.date}</span></div><div><h2>{release.title}</h2><p>{release.summary}</p>{release.image && <img src={release.image} alt={release.title} />}</div></article>)}</section>
  </MarketingLayout>
}
