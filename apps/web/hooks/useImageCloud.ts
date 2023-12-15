import useSWR from 'swr'

type IConfig =
  | {
      connected?: boolean
    }
  | undefined
export default function useImageCloud(type: string): [IConfig] {
  const { data } = useSWR<IConfig>('/image-cloud/' + type, fetchCloudImage)

  function fetchCloudImage() {
    return Promise.resolve({
      connected: true,
    })
  }

  return [data]
}
