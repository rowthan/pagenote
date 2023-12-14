import useWhoAmi from 'hooks/useWhoAmi'
import extApi from '@pagenote/shared/lib/pagenote-api'

export default function DeviceInfo() {
  const [whoAmI] = useWhoAmi()
  if (!whoAmI?.version) {
    return null
  }

  function onClick() {
    extApi.commonAction.openTab({
      tab: {},
      reUse: true,
      url: 'https://pagenote.cn/release',
    })
  }

  return (
    <div>
      <button onClick={onClick} className={'badge badge-outline badge-sm'}>
        {whoAmI.version}
      </button>
    </div>
  )
}
