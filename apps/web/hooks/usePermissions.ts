import useSWR from "swr";
import extApi from "@pagenote/shared/lib/pagenote-api";
import {isExt} from "../const/env";

interface Permission {origins?: string[],permissions?: string[]}

export default function usePermissions(): [Permission | undefined,()=>void] {
    const {data,mutate} = useSWR<Permission>('permissions',listPermissions)

    async function listPermissions() {
        const res = await extApi.developer.chrome({
            namespace: "permissions",
            type: "getAll"
        });
        console.log(res, 'permissions');
        return (res.data || {}) as Permission;
    }

    function requestPermission() {
        if(isExt){
            chrome.permissions.request({
                origins: ["<all_urls>"]
            },function (granted) {
                console.log('res',granted)
                mutate();
            })
        }else{
            alert('请在插件内使用该功能')
            extApi.developer.chrome({
                namespace: "permissions",
                type: "request",
                //@ts-ignore
                arguments: [
                    {
                        origins: ["<all_urls>"]
                    }
                ]
            }).then(function (res) {
                console.log(res,'----')
                mutate();
            })
        }

    }

    return [data,requestPermission]
}
