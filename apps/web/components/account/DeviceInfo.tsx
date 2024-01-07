import useWhoAmi from 'hooks/useWhoAmi'
import extApi from '@pagenote/shared/lib/pagenote-api'

export default function DeviceInfo() {
  const [whoAmI] = useWhoAmi('')
  if (!whoAmI?.version) {
    return null
  }

  function onClick() {
    const version = whoAmI?.mainVersion || ''
    extApi.commonAction.openTab({
      tab: {},
      reUse: true,
      url: 'https://pagenote.cn/release/'+version,
    })
  }

  return (
      <a onClick={onClick} className={'hover:underline text-xs cursor-pointer'}>
        {whoAmI.version}
      </a>
  )
}
