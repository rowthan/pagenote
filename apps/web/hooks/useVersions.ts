import extApi from "@pagenote/shared/lib/pagenote-api";
import useSWR from "swr";
import useWhoAmi from "./useWhoAmi";
import { compare } from 'compare-versions';

export interface Version {
    title: string;
    version: string,
    release_time: Date,
    platform: string[],
    tags: string[],
    description: string
    changelog: string,
    _markdown?: string
}
type VersionInfo = {list: Version[],latest: string,isOut: boolean}
export default function ():[VersionInfo,()=>void] {
    const [whoAmI] = useWhoAmi();
    const {data} = useSWR<VersionInfo>('/version/',fetchVersionList,{
        fallbackData:{
            list:[],
            isOut: false,
            latest: ""
        }
    });

    function fetchVersionList() {
        return extApi.network.pagenote({
            url:'/api/graph/site',
            method:'GET',
            data:{
                query: `{versions(released:true){version_id,expect_release_time,released,version,title,release_time,platform,description,tags,changelog,expect_release_time,description}}`
            },
        },{
            cacheControl:{
                maxAgeMillisecond: 3600 * 24 * 1000
            }
        }).then(function (res) {
            return {
                list: res.data?.json?.data?.versions || [],
                isOut: false,
                latest: "",
            };
        })
    }

    const latestVersion = data?.list.find(function (item) {
        return item.platform.includes(whoAmI?.extensionPlatform || "");
    })
    return [{
        list: data?.list||[],
        latest: latestVersion?.version||"",
        isOut: compare(whoAmI?.version||'0',latestVersion?.version||"0","<")
    },fetchVersionList]

}
