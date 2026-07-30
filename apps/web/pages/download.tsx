import { FiArrowUpRight, FiCheck, FiDownload } from 'react-icons/fi'
import MarketingLayout from '../components/MarketingLayout'
import { INSTALL_TARGETS, InstallStore } from '../const/install'
import styles from '../styles/marketing.module.scss'

const stores: InstallStore[] = ['chrome', 'edge', 'firefox']

export default function DownloadPage() {
  return <MarketingLayout title="安装 PAGENOTE" canonicalPath="/download" description="安装 PAGENOTE 浏览器扩展，在网页、图片和 PDF 中高亮、批注并整理阅读资料。">
    <section className={styles.pageHero}><span className={styles.kicker}>GET PAGENOTE</span><h1>从第一条高亮<br /><em>开始你的资料库。</em></h1><p>选择你的浏览器安装 PAGENOTE。无需登录即可开始使用。</p></section>
    <section className={styles.storeGrid}>{stores.map((key) => { const store = INSTALL_TARGETS[key]; return <a key={key} className={styles.storeCard} href={store.url} target="_blank" rel="noreferrer"><div className={styles.storeIcon}><FiDownload /></div><div><small>{store.name}</small><h2>{store.label}</h2><span><FiArrowUpRight /> 前往官方扩展商店</span></div></a> })}<a className={styles.storeCard} href="https://www.crxsoso.com/webstore/detail/hpekbddiphlmlfjebppjhemobaopekmp" target="_blank" rel="noreferrer"><div className={styles.storeIcon}><FiDownload /></div><div><small>其他浏览器</small><h2>其他浏览器下载</h2><span><FiArrowUpRight /> 前往下载页面</span></div></a></section>
    <section className={styles.note}><FiCheck /><p>安装后，打开任意网页或 PDF，选中一段内容即可创建第一条高亮。PAGENOTE 的核心笔记数据默认保存在当前浏览器。</p></section>
    <section className={styles.downloadHelp}><h2>还不确定从哪里开始？</h2><p>先阅读快速开始指南，了解高亮、批注、截图、标签和备份。</p><a href="/docs/getting-started">查看快速开始 <FiArrowUpRight /></a></section>
  </MarketingLayout>
}
