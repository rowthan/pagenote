/** Minimal web-side shape used by the offline HTML pages. */
export type OfflineHTML = {
  data: string
  deleted: boolean
  resourceId?: string
  name?: string
  description?: string
  icon?: string
  originUrl?: string
  relatedPageUrl?: string
  onlineUri?: string
  visitedAt?: number
  createAt?: string | number | Date
}
