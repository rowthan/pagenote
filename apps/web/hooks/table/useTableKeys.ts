import extApi from '@pagenote/shared/lib/pagenote-api'
import useSWR from 'swr'
import { Collection, dbTableMap } from '../../const/collection'

export default function useTableKeys<T>(
    collection: Collection,
    key: string
) {
    const {
        data = [],
        isLoading,
        mutate,
    } = useSWR<string[]>(function () {
        return `/keys/${collection}/${key}`
    }, fetchData)

    function fetchData() {
        return extApi.table
            .keys({
                ...dbTableMap[collection],
                params: {
                    key: key,
                },
            })
            .then(function (res) {
                return ( res.data || []) as string[]
            })
    }

    return {
        data,
        isLoading,
        mutate,
    }
}
