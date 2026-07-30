import MarketingLayout from '../components/MarketingLayout'
import styles from '../styles/marketing.module.scss'

export default function PrivacyPage() {
  return <MarketingLayout title="隐私协议" description="PAGENOTE 的隐私协议。">
    <article className={styles.policy}><span className={styles.kicker}>PRIVACY & DATA</span><h1>PAGENOTE<br /><em>隐私协议。</em></h1><p className={styles.policyLead}>请您审慎阅读本协议。若您不同意本条款，请您立即停止使用或卸载本扩展应用、网站。</p><h2>本隐私政策包括以下内容</h2><ol><li>我们如何收集您的个人信息</li><li>我们如何使用您的个人信息</li><li>我们如何共享、转让、公开披露您的个人信息</li><li>个人信息的存储</li><li>隐私政策的变更和通知</li></ol><h2>数据收集</h2><p>当您注册或登录时，我们会收集您的个人身份信息，包括邮箱、用户名等。如果您不希望我们收集以上信息，请联系客服注销账号或退出登录后继续使用。</p><h2>数据存储</h2><h3>日志相关数据</h3><p>我们将记录您在使用过程中产生的部分关键行为，例如启用、关闭扩展应用。这些记录用于帮助我们了解产品功能的使用频率，为后续改进提供参考。</p><p>与用户笔记相关的日志存储于浏览器本地。如需排查问题，需要您下载日志后发送给作者。非网页笔记相关日志，例如功能使用频率记录等，将上传至服务器侧。</p><h3>笔记相关数据</h3><p><strong>图床服务：</strong>为优化存储空间，PAGENOTE 提供图床功能，数据存储服务由阿里云 OSS 提供。图床生成的链接仅您本人可见，PAGENOTE 不会向第三方提供该链接。您需要自行保证图片链接不被泄漏，并遵守相关法律法规。</p><p>图床服务关闭前，将提前 30 天通知您，并通过 PAGENOTE 重新下载图片至本机，恢复无图床本地存储模式。</p><p><strong>应用程序数据：</strong>PAGENOTE 未提供服务器侧笔记数据存储服务。所有笔记数据均存储在您的计算机本地，随软件卸载而一并清空，无法恢复。在卸载插件之前，您应当自行备份数据。</p><h2>第三方授权</h2><p>我们提供使用 GitHub、Notion 等第三方账号授权的功能。授权后，扩展可以获取相关账号信息。如果您不希望通过本应用调用其他程序，请在第三方平台取消相关授权。</p><h2>数据转移和清除</h2><p>我们不会共享、转让、公开披露您的个人信息。如有外部使用需要，我们会在此之前再次征求您的同意。您有权要求 PAGENOTE 删除由您产生的所有数据。</p><h2>变更说明</h2><p>隐私政策发生改变时，我们会再另行通知您。</p></article>
  </MarketingLayout>
}
