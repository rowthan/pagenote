import useWhoAmi from 'hooks/useWhoAmi'
import useTableQuery from "../../hooks/table/useTableQuery";
import {Collection} from "../../const/collection";
import {compare} from "compare-versions";
import { PiArrowFatLinesUpFill } from "react-icons/pi";

export default function DeviceInfo() {
  const [whoAmI] = useWhoAmi('')
  const {data} = useTableQuery<{key: string,value: string,space: string}>(Collection.memory, {
    query:{
      key: `version.${whoAmI?.extensionPlatform}.latest`
    }
  })
  const version = data[0]?.value ||   '0.0.0';

  if (!whoAmI?.version) {
    return null
  }

  const newVersion = compare(version,whoAmI.version,'>')

  return (
      <a href={whoAmI.extensionStoreUrl||'https://pagenote.cn'} target={'_blank'} className={'hover:underline flex items-center gap-1 text-xs cursor-pointer'}>
        {whoAmI.version}
        {newVersion ? <PiArrowFatLinesUpFill className={'animation animate-bounce'} fill={'red'} /> : ''}
      </a>
  )
}
