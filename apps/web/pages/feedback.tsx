import MarketingLayout from '../components/MarketingLayout'
import styles from '../styles/marketing.module.scss'

export default function FeedbackPage() {
  return <MarketingLayout title="反馈问题" canonicalPath="/feedback" description="向 PAGENOTE 提交使用反馈、问题和功能建议。">
    <section className={styles.feedbackPage}>
      <div className={styles.feedbackIntro}><span className={styles.kicker}>FEEDBACK</span><h1>遇到问题，<br /><em>告诉我们。</em></h1><p>无论是使用问题、功能建议，还是某个让你困惑的细节，都欢迎告诉 PAGENOTE。</p></div>
      <div className={styles.feedbackFrame}><iframe title="PAGENOTE 问题反馈" src="https://tally.so/embed/Y5KPKN?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1" loading="lazy" /></div>
    </section>
  </MarketingLayout>
}
