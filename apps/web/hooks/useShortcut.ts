import extApi from "@pagenote/shared/lib/pagenote-api";
import useSWR from "swr";

import Command = chrome.commands.Command;


export default function useShortcut():[Command[]|undefined,Record<string, Command>] {
    const {data=[],isLoading} = useSWR<Command[]>('/shortcut',fetchInfo,{
        fallbackData:[]
    });

    function fetchInfo() {
        return extApi.developer.chrome({
            namespace:"commands",
            type: 'getAll',
            args:[]
        }).then(function (res) {
            return res.data
        })
    }

    const map: Record<string, Command> = {};
    data.forEach(function (item) {
        map[item.name || ''] = item;
    });

    return [data,map]
}
