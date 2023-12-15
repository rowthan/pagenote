import { type ReactNode } from 'react'
import useTableQuery from '../../hooks/table/useTableQuery'
import { SnapshotResource } from '@pagenote/shared/lib/@types/data'
import useTabPagenoteData from '../../hooks/useTabPagenoteData'
import { TbCapture } from 'react-icons/tb'
import { RiDownloadCloudLine } from 'react-icons/ri'
import classNames from 'classnames'
import DisableButton from './state/DisableButton'
import { Collection } from '../../const/collection'

interface Props {
  children?: ReactNode
  url: string
}

function SectionItem(props: { children: ReactNode; className?: string }) {
  return (
    <div
      className={classNames(
        'w-full outline inline-flex items-center px-2 text-sm first:rounded-bl-lg last:rounded-br-lg',
        props.className
      )}
    >
      {props.children}
    </div>
  )
}

export default function Summary(props: Props) {
  const { url } = props
  const [webpage] = useTabPagenoteData()
  const { data: snapshots = [], mutate: refresh } =
    useTableQuery<SnapshotResource>(Collection.snapshot, {
      limit: 100,
      query: {
        $or: [
          {
            pageKey: url || ' ',
          },
          {
            pageUrl: url || ' ',
          },
        ],
      },
      sort: {
        createAt: -1,
      },
    })

  return (
    <div className="flex w-full gap-[3px] repeat-3 justify-between rounded">
      <SectionItem className={'border-amber-300 text-amber-300'}>
        高亮 {webpage?.plainData?.steps?.length || 0} 处
        <DisableButton />
      </SectionItem>
      <SectionItem className={'border-blue-400 text-blue-400'}>
        <TbCapture /> 截图 {snapshots.length || 0} 处
      </SectionItem>
      <SectionItem className={'border-green-400 text-green-400'}>
        <RiDownloadCloudLine />
        存档 {webpage?.plainData?.steps?.length || 0} 处
      </SectionItem>
    </div>
  )
}

Summary.defaultProps = {}
