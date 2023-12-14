import extApi from "@pagenote/shared/lib/pagenote-api";
import useSWR from "swr";

type InviteInfo = {
    inviteCode?: string
    inviteBrief?: string

    invitedList?: {}[]
}


export function fetchInfo() {
    return extApi.network.pagenote({
        url: '/api/',
        method: "GET"
    }).then(function (res) {
        return res.data.json
    })
}

export default function useUserInfo():[InviteInfo|undefined,()=>void] {
    const {data,mutate} = useSWR<InviteInfo|undefined>('/invite',fetchInfo);

    return [data,mutate]
}
