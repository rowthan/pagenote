import { useEffect, useState } from 'react'

interface Props {
  src?: string
  fallback?: string
  alt?: string

  [key: string]: unknown
}

const DEFAULT_IMG = 'https://pagenote.cn/images/light-128.png'
export default function ImgFallback(props: Props) {
  const { src, fallback } = props
  const [imgSrc, setImgSrc] = useState(function () {
    return src || DEFAULT_IMG
  })
  const [loading, setLoading] = useState(true)

  function onLoadError() {
    if (fallback) {
      setImgSrc(fallback || DEFAULT_IMG)
    }
    setLoading(false)
  }

  function onLoad() {
    setLoading(false)
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      {...props}
      alt={props.alt || (loading ? '加载中' : '')}
      onError={onLoadError}
      onLoad={onLoad}
      onLoadedData={onLoad}
      onAbort={onLoad}
      className={`${props.className} ${loading ? 'loading-block' : ''}`}
      src={imgSrc}
    />
  )
}

ImgFallback.defaultProps = {
  fallback: DEFAULT_IMG,
}
