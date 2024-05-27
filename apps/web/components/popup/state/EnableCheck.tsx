import useCurrentTab from 'hooks/useCurrentTab'
import useTabPagenoteState from 'hooks/useTabPagenoteState'
import { Bookmark } from 'components/popup/Bookmark'
import PageMemo from '../PageMemo'
import Tagfy from '../../tag/Tagfy'

export default function EnableCheck() {
  const [tabState, mutate, isLoading] = useTabPagenoteState()
  const { tab } = useCurrentTab()

  return (
    <div className={'mx-auto '}>
      <div className={'p-3'}>
        <Bookmark />
        <PageMemo url={tabState?.pageUrl || tab?.url || ''} />
        <div className={'my-4'}>
          <Tagfy pageKey={tabState?.pageUrl || tab?.url || ''} />
        </div>
      </div>

    </div>
  )
}
