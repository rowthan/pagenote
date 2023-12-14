import TipInfoSvg from 'assets/svg/info.svg'

export default function TipInfo(props: { tip: string; className?: string }) {
  const { tip, className = 'tooltip-right' } = props
  return (
    <span className={`tooltip ${className} align-bottom`} data-tip={tip}>
      <TipInfoSvg className={'fill-current'} />
    </span>
  )
}
