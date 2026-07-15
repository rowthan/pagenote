import BasicLayout from '../layouts/BasicLayout'
import Script from 'next/script'
import {
  useEffect,
  useMemo,
  useState,
  type MouseEvent as ReactMouseEvent,
} from 'react'
import {
  FiArrowDown,
  FiArrowRight,
  FiCheckCircle,
  FiExternalLink,
  FiHeart,
  FiHelpCircle,
  FiMessageCircle,
  FiRefreshCw,
  FiShield,
} from 'react-icons/fi'
import {
  buildTallyUrl,
  decodeUninstallContext,
  type UninstallContext,
} from '../utils/uninstall'
import {
  getInstallTarget,
  resolveReinstallDestination,
} from '../utils/reinstall'
import styles from '../styles/uninstall.module.scss'

declare global {
  interface Window {
    Tally?: { loadEmbeds: () => void }
  }
}

const DEFAULT_TALLY_UNINSTALL_FORM_ID = 'eqlypQ'

function sanitizeTallyMessage(data: unknown) {
  if (typeof data !== 'string' || !data.startsWith('{')) return null
  try {
    return JSON.parse(data) as {
      event?: string
      type?: string
      payload?: { formId?: string; page?: number }
    }
  } catch {
    return null
  }
}

export default function UninstallPage() {
  const tallyFormId = (
    process.env.NEXT_PUBLIC_TALLY_UNINSTALL_FORM_ID ||
    DEFAULT_TALLY_UNINSTALL_FORM_ID
  ).trim()
  const [context, setContext] = useState<UninstallContext | null>(null)
  const [contextReady, setContextReady] = useState(false)
  const [surveyLoaded, setSurveyLoaded] = useState(false)
  const [surveySubmitted, setSurveySubmitted] = useState(false)
  const [surveySlow, setSurveySlow] = useState(false)
  const [reinstallChecking, setReinstallChecking] = useState(false)

  const installTarget = useMemo(
    () => (contextReady ? getInstallTarget(context) : getInstallTarget(null)),
    [context, contextReady]
  )
  const tallyEmbedUrl = useMemo(
    () => (tallyFormId ? buildTallyUrl(tallyFormId, context, 'embed') : ''),
    [context, tallyFormId]
  )
  const tallyShareUrl = useMemo(
    () => (tallyFormId ? buildTallyUrl(tallyFormId, context, 'share') : ''),
    [context, tallyFormId]
  )

  useEffect(() => {
    function consumeContextFragment() {
      const parsed = decodeUninstallContext(window.location.hash)
      setContext(parsed)
      setContextReady(true)

      if (window.location.hash) {
        window.history.replaceState(null, '', window.location.pathname)
      }
    }

    consumeContextFragment()
    window.addEventListener('hashchange', consumeContextFragment)
    return () =>
      window.removeEventListener('hashchange', consumeContextFragment)
  }, [])

  useEffect(() => {
    if (!tallyFormId) return
    const timer = window.setTimeout(() => {
      if (!surveyLoaded) setSurveySlow(true)
    }, 8000)
    return () => window.clearTimeout(timer)
  }, [surveyLoaded, tallyFormId])

  useEffect(() => {
    if (!tallyFormId) return

    function onTallyMessage(message: MessageEvent) {
      try {
        const origin = new URL(message.origin)
        if (
          origin.protocol !== 'https:' ||
          !/(^|\.)tally\.so$/.test(origin.hostname)
        ) {
          return
        }
      } catch {
        return
      }

      const parsed = sanitizeTallyMessage(message.data)
      if (!parsed?.payload || parsed.payload.formId !== tallyFormId) return
      const eventName = parsed.event || parsed.type || message.data

      if (eventName.includes('Tally.FormLoaded')) {
        setSurveyLoaded(true)
        setSurveySlow(false)
      }

      if (eventName.includes('Tally.FormSubmitted')) {
        setSurveySubmitted(true)
      }
    }

    window.addEventListener('message', onTallyMessage)
    return () => window.removeEventListener('message', onTallyMessage)
  }, [tallyFormId])

  function onTallyScriptReady() {
    window.Tally?.loadEmbeds()
  }

  async function onReinstallClick(event: ReactMouseEvent<HTMLAnchorElement>) {
    if (installTarget.store === 'edge') return

    event.preventDefault()
    if (reinstallChecking) return
    setReinstallChecking(true)

    const destination = await resolveReinstallDestination(installTarget)
    window.location.assign(destination)
  }

  return (
    <BasicLayout
      nav={false}
      footer={false}
      robots="noindex, nofollow"
      title="感谢你的反馈 · PAGENOTE"
      description="告诉我们 PAGENOTE 可以做得更好的地方"
    >
      {tallyFormId && (
        <Script
          id="tally-embed"
          src="https://tally.so/widgets/embed.js"
          strategy="afterInteractive"
          onLoad={onTallyScriptReady}
          onReady={onTallyScriptReady}
          onError={() => setSurveySlow(true)}
        />
      )}

      <div className={styles.page}>
        <header className={styles.navbar}>
          <a className={styles.brand} href="/" aria-label="PAGENOTE 首页">
            <img src="/images/light-64.png" width={34} height={34} alt="" />
            <span>PAGENOTE</span>
          </a>
        </header>

        <main>
          <section className={styles.hero}>
            <div className={styles.heroGlow} aria-hidden="true" />
            <div className={styles.eyebrow}>
              <FiHeart aria-hidden="true" /> 感谢你曾经使用 PAGENOTE
            </div>
            <h1>很遗憾看到你离开</h1>
            <p className={styles.heroCopy}>
              也许我们没有解决好你的问题。留下一点真实感受，
              <br className={styles.desktopBreak} />
              会直接帮助我们决定接下来优先改进什么。
            </p>
            <div className={styles.heroActions}>
              <a
                className={styles.primaryButton}
                href={installTarget.url}
                target={
                  installTarget.url.startsWith('http') ? '_blank' : undefined
                }
                rel="noreferrer"
                aria-busy={reinstallChecking}
                aria-disabled={reinstallChecking}
                onClick={onReinstallClick}
              >
                <FiRefreshCw aria-hidden="true" />
                {reinstallChecking ? '正在检测下载入口…' : '重新安装 PAGENOTE'}
                <FiArrowRight aria-hidden="true" />
              </a>
              <a className={styles.secondaryButton} href="#survey">
                用 1 分钟告诉我们原因
                <FiArrowDown aria-hidden="true" />
              </a>
            </div>
            <p className={styles.storeHint}>
              {installTarget.store === 'edge'
                ? '将前往 Edge 扩展商店；下方问卷无需登录'
                : '将先检测 Chrome 应用商店；无法访问时提供本地下载'}
            </p>
          </section>

          <section id="survey" className={styles.surveySection}>
            <div className={styles.sectionHeading}>
              <span className={styles.step}>01</span>
              <div>
                <h2>哪一点让你决定卸载？</h2>
                <p>大约 1–2 分钟。除卸载原因外，其余问题均可跳过。</p>
              </div>
            </div>

            <div className={styles.surveyGrid}>
              <div className={styles.surveyCard}>
                {tallyFormId && contextReady ? (
                  <>
                    {!surveyLoaded && !surveySlow && (
                      <div className={styles.loadingState} role="status">
                        <span className={styles.loader} />
                        正在加载匿名问卷…
                      </div>
                    )}
                    <iframe
                      className={styles.surveyFrame}
                      data-tally-src={tallyEmbedUrl}
                      title="PAGENOTE 卸载原因问卷"
                      width="100%"
                      height="680"
                      frameBorder="0"
                      marginHeight={0}
                      marginWidth={0}
                      loading="eager"
                      onLoad={() => window.Tally?.loadEmbeds()}
                    />
                    {surveySlow && !surveyLoaded && (
                      <div className={styles.fallbackNotice} role="status">
                        <FiExternalLink aria-hidden="true" />
                        <span>问卷加载得有点慢。</span>
                        <a
                          href={tallyShareUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          在新窗口填写
                        </a>
                      </div>
                    )}
                  </>
                ) : (
                  <div className={styles.unconfiguredState}>
                    <FiMessageCircle aria-hidden="true" />
                    <h3>问卷正在准备中</h3>
                    <p>你仍然可以通过反馈页面告诉我们遇到的问题。</p>
                    <a href="/feedback">
                      前往问题反馈 <FiArrowRight aria-hidden="true" />
                    </a>
                  </div>
                )}
              </div>

              <aside className={styles.privacyCard}>
                <FiShield aria-hidden="true" />
                <h3>匿名且克制</h3>
                <p>
                  问卷不会读取你的笔记、访问过的网页或运行日志。联系方式完全选填，仅用于跟进你主动提交的问题。
                </p>
                <ul>
                  <li>
                    <FiCheckCircle /> 不要求登录
                  </li>
                  <li>
                    <FiCheckCircle /> 不收集笔记内容
                  </li>
                  <li>
                    <FiCheckCircle /> 不出售或分享反馈
                  </li>
                </ul>
              </aside>
            </div>
          </section>

          <section className={styles.returnSection}>
            <span className={styles.step}>02</span>
            <div className={styles.returnContent}>
              <p className={styles.kicker}>
                {surveySubmitted
                  ? '反馈已收到，谢谢你认真告诉我们'
                  : '如果只是暂时离开'}
              </p>
              <h2>
                {surveySubmitted
                  ? '愿意再给 PAGENOTE 一次机会吗？'
                  : '随时欢迎回来'}
              </h2>
              <p>
                我们会持续修复兼容性和体验问题。你也可以先查看帮助中心，或直接把具体问题发给我们。
              </p>
              <div className={styles.returnActions}>
                <a
                  className={styles.primaryButton}
                  href={installTarget.url}
                  target={
                    installTarget.url.startsWith('http') ? '_blank' : undefined
                  }
                  rel="noreferrer"
                  aria-busy={reinstallChecking}
                  aria-disabled={reinstallChecking}
                  onClick={onReinstallClick}
                >
                  {reinstallChecking ? '正在检测下载入口…' : '重新安装'}{' '}
                  <FiArrowRight aria-hidden="true" />
                </a>
                <a href="/help">
                  <FiHelpCircle aria-hidden="true" /> 帮助中心
                </a>
              </div>
            </div>
          </section>
        </main>

        <footer className={styles.footer}>
          <span>PAGENOTE · 小而美的网页标记工具</span>
          <span>感谢每一条真实反馈</span>
        </footer>
      </div>
    </BasicLayout>
  )
}
