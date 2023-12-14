import { Step } from '@pagenote/shared/lib/@types/data'

export default function LightText(props: { light: Step }) {
  const { light } = props
  return (
    <span
      className="inline-block"
      style={{ borderBottom: `1px solid ${light.bg}` }}
    >
      <span>{light.text}</span>
    </span>
  )
}
