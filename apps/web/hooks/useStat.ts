import extApi from '@pagenote/shared/lib/pagenote-api'
import useSWR, {KeyedMutator} from 'swr'
import useSettingConfig from "./table/useSettingConfig";

const TEST_FILE_PATH = '/.temp/.connect.txt'

type Stat = {
    connected: boolean,
    error: string,
    actionUrl?: string
}

function useStat(type:'webdav'): {data:Stat | undefined, mutate:KeyedMutator<Stat>,refresh:()=>void}
function useStat(type:'oss',space: "private"|'data'): {data:Stat | undefined, mutate:KeyedMutator<Stat>,refresh:()=>void}
function useStat(type: 'oss'|'webdav',space?: "private"|'data'): {data:Stat | undefined, mutate:KeyedMutator<Stat>,refresh:()=>void} {
    const { data, isLoading, mutate } = useSWR<Stat>(function () {
        return '/stat/'+type
    }, ()=>fetchInfo())


    async function fetchInfo(cacheKey: number = 10000) {
        switch (type) {
            case "oss":
                return extApi.developer.requestBack({
                    namespace: "actions",
                    type: "callAction",
                    params: {
                        uses: 'pagenote/oss@v1',
                        with: {
                            type: space || 'data',
                            method: 'put',
                            filePath: TEST_FILE_PATH,
                            file: 'test success oss at '+new Date().toISOString(),
                        }
                    },
                },{
                    cacheControl: {
                        maxAgeMillisecond: cacheKey
                    }
                }).then(function (res) {
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
                        maxAgeMillisecond: cacheKey
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
                    error: '未知云存储类型',
                    actionUrl: 'https://pagenote.cn/help',
                }
        }
    }

    return {
        data,
        mutate,
        refresh: ()=>{
            fetchInfo(-1).then(function (res) {
                mutate(res)
            })
        }
    }
}
export default useStat
