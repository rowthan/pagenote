import { WebPage } from '@pagenote/shared/lib/@types/data'
import useCurrentTab from './useCurrentTab'
import useWebpage from './useWebpage'

export default function useTabPagenoteData(): [
  Partial<WebPage> | null | undefined,
  () => void
] {
  const { tab } = useCurrentTab()
  const { data, mutate } = useWebpage(tab?.url || '')

  return [data, mutate]
}
