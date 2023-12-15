export default function HighLightText(props: {
  keyword: string
  text?: string
  hideOnUnMatch?: boolean
}) {
  const { keyword, text = '', hideOnUnMatch = false } = props

  if (!keyword) {
    return <span>{text}</span>
  }

  const words = keyword
    .trim()
    .replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')
    .split(/\s+/)
  const regex = new RegExp(words.join('|'), 'ig')

  const div = document.createElement('div')
  div.innerHTML = text
  const plainText = div.innerText

  if (!plainText || (hideOnUnMatch && !regex.test(plainText))) {
    return null
  }

  const html = plainText.replace(regex, function (word) {
    return `<mark>${word}</mark>`
  })

  return <span dangerouslySetInnerHTML={{ __html: html }}></span>
}
