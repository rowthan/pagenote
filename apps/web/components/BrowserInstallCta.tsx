import Link from 'next/link'
import { useEffect, useState } from 'react'
import { FiArrowUpRight, FiChevronDown, FiDownload, FiGlobe } from 'react-icons/fi'
import { INSTALL_TARGETS, InstallStore, detectInstallStore } from '../const/install'
import styles from '../styles/home.module.scss'

export default function BrowserInstallCta({ compact = false }: { compact?: boolean }) {
  const [store, setStore] = useState<InstallStore | undefined>()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setStore(detectInstallStore(window.navigator.userAgent))
  }, [])

  const target = store ? INSTALL_TARGETS[store] : undefined

  return (
    <div className={`${styles.installCta} ${compact ? styles.installCtaCompact : ''}`}>
      <div className={styles.installCtaMain}>
        {target ? (
            <a className={styles.installCtaPrimary} href={target.url} target="_blank" rel="noreferrer">
            <FiDownload aria-hidden="true" />
            <span>{target.label}</span>
            <FiArrowUpRight aria-hidden="true" />
          </a>
        ) : (
          <Link className={styles.installCtaPrimary} href="/download">
            <FiDownload aria-hidden="true" />
            <span>立即安装 PAGENOTE</span>
            <FiArrowUpRight aria-hidden="true" />
          </Link>
        )}
        <button
          className={styles.installCtaToggle}
          type="button"
          aria-expanded={open}
          aria-label="选择其他浏览器"
          onClick={() => setOpen((value) => !value)}
        >
          <FiChevronDown aria-hidden="true" />
        </button>
      </div>
      <div className={styles.installCtaHint}>
        <FiGlobe aria-hidden="true" />
        {target ? `检测到你正在使用 ${target.name}` : '支持 Chrome、Edge 和 Firefox'}
      </div>
      {open && (
        <div className={styles.installCtaMenu} role="menu">
          {(Object.keys(INSTALL_TARGETS) as InstallStore[]).map((key) => {
            const item = INSTALL_TARGETS[key]
            return (
              <a key={key} href={item.url} target="_blank" rel="noreferrer" role="menuitem">
                <span>{item.name}</span>
                <FiArrowUpRight aria-hidden="true" />
              </a>
            )
          })}
          <Link href="/download" role="menuitem">查看全部安装方式</Link>
        </div>
      )}
    </div>
  )
}
