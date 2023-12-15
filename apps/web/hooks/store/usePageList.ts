import extApi from "@pagenote/shared/lib/pagenote-api";
import useSWR from "swr";
import {StatInfo} from "../useDataStat";
import {useContextSelector} from "use-context-selector";
import {context} from "../../store/ContextProvider";
import {useCallback, useEffect, useState} from "react";
import {WebPage} from "@pagenote/shared/lib/@types/data";



export default function usePageList(){
    const state = useContextSelector(context, v=>v[0]);

    const fetchPageList = useCallback(()=> {
        return extApi.page.query({
            query: state.webpageFilter,
            page: 0,
            pageSize: 999999,
            sort:{
                updateAt: -1
            }
        },{
            cacheControl:{
                maxAgeMillisecond: 60 * 60 * 1000,
            },
            scheduleControl:{
                runAfterMillisecond: [0,10000],
            }
        }).then(function (res8) {
            const data = res8?.data?.list ||[];
            // setData(data || []);
            return data;
        })
    },[state.webpageFilter])

    const {data=[],mutate} = useSWR<Partial<WebPage>[]>('pageList',fetchPageList);

    useEffect(function () {
        mutate();
    },[state.groupFilterName])


    return [data];
}
