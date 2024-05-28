import extApi from '@pagenote/shared/lib/pagenote-api'
import useSWR from 'swr'


const TEST_FILE_PATH = '/.temp/.connect.txt'

type Stat = {
    connected: boolean,
    error: string,
    actionUrl?: string
}
export default function useStat(type: 'oss'|'webdav',space?: "private"|'data'): [Stat | undefined,boolean] {
    const { data, isLoading, mutate } = useSWR<Stat>('/stat/'+type, fetchInfo)

    async function fetchInfo() {
        switch (type) {
            case "oss":
                return  extApi.developer.requestBack({
                    namespace: "actions",
                    type: "callAction",
                    params: {
                        uses: 'pagenote/oss@v1',
                        with: {
                            type: space || 'data',
                            method: 'put',
                            filePath: TEST_FILE_PATH,
                            file: 'test success oss',
                        }
                    },
                },{
                    cacheControl: {
                        maxAgeMillisecond: 2000
                    }
                }).then(function (res) {
                    console.log('oss',res)
                    return {
                        connected: Boolean(res?.data?.filePath),
                        error: res?.error || '',
                        actionUrl: String(res?.header?.cause || ''),
                    }
                })
            case "webdav":
                return extApi.developer.requestBack({
                    namespace: "actions",
                    type: "callAction",
                    params: {
                        uses: 'pagenote/webdav@v1',
                        with: {
                            method: 'put',
                            filePath: TEST_FILE_PATH,
                            details: false,
                            file: 'webdav test success at '+new Date().toISOString()
                        }
                    },
                },{
                    cacheControl: {
                        maxAgeMillisecond: 2000
                    }
                }).then(function (res) {
                    return {
                        connected: Boolean(res?.data?.filePath),
                        error: res?.error || '',
                        actionUrl: String(res?.header?.cause || ''),
                    }
                })
            default:
                return {
                    connected: false,
                    error: 'not support',
                    actionUrl: '',
                }
        }

    }

    return [data,isLoading]
}
