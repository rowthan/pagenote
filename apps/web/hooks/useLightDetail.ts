
import useSWR from "swr";
import {Step} from "@pagenote/shared/lib/@types/data";
import extApi from "@pagenote/shared/lib/pagenote-api";

export default function useLightDetail(lightId: string) {
    const {data,isLoading,mutate} = useSWR<Partial<Step>|null>('/light/detail/'+lightId,fetchInfo);
    function fetchInfo() {
        if(!lightId){
            return Promise.resolve(null);
        }

        return extApi.light.query({
            query:{
                pageKey: lightId
            },
            pageSize: 1,
            limit: 1,
            page: 1,
        }).then(function (res) {
            return (res.data?.list || [])[0] || null
        })
    }

    return {
        data,
        isLoading,
        mutate
    }
}
