import '../styles/globals.css'
import 'tailwindcss/tailwind.css'

// 页面全局配置
function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}

export default MyApp
