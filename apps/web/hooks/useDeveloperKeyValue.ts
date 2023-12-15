import extApi from "@pagenote/shared/lib/pagenote-api";
import useSWR from "swr";


export default function useDeveloperKeyValue<T>(key: string = 'tab_capture'): [T | undefined] {
    const {data} = useSWR<T>(function () {
        // if(!key){
        //     throw Error('key is required')
        // }
        return '/developer/data/' + key
    }, fetchData)

    function fetchData() {
        return extApi.commonAction.getPersistentValue(key || '').then(function (res) {
            console.log(res, 'key', key)
            return res.data;
        })
    }

    return [data]
}
