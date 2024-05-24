import extApi from '@pagenote/shared/lib/pagenote-api'
import useSWR from 'swr'

interface FileItem {
    importUrl: string
    filename: string,
    size: number,
    url?: string,
}


export default function useBackupList(type: 'oss'|'webdav'): [FileItem[],boolean] {
    const { data = [], isLoading, mutate } = useSWR<FileItem[]>('/cloud/backup/list/'+type, fetchInfo)

    async function fetchInfo() {
        switch (type) {
            case "oss":
                return  extApi.developer.requestBack({
                    namespace: "actions",
                    type: "callAction",
                    params: {
                        uses: 'pagenote/oss@v1',
                        with: {
                            type: 'data',
                            method: 'list',
                            filePath: '/backup',
                        }
                    },
                }).then(function (res) {
                    return (res?.data || []).map(function (res: { filename: string }) {
                        return {
                            ...res,
                            importUrl: 'oss:'+ res.filename
                        }
                    })
                })
            case "webdav":
                return extApi.developer.requestBack({
                    namespace: "actions",
                    type: "callAction",
                    params: {
                        uses: 'pagenote/webdav@v1',
                        with: {
                            method: 'list',
                            filePath: '/pagenote/backup/',
                            details: false,
                        }
                    },
                }).then(function (res) {
                    return (res?.data || []).map(function (res: { filename: string }) {
                        console.log(res)
                        return {
                            ...res,
                            filePath: `${res.filename}`,
                            importUrl: 'webdav:'+res.filename
                        }
                    });
                })
        }

    }

    return [data,isLoading]
}
