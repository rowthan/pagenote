import extApi from "@pagenote/shared/lib/pagenote-api";
import {useEffect, useState} from "react";
import Tab = chrome.tabs.Tab;
import {Step} from "@pagenote/shared/lib/@types/data";

export default function PopupLights(props:{tab: Tab}) {
    const {tab} = props;
    const [lights, setLights] = useState<Partial<Step>[]>([])

    function fetchWebpage() {
        if (!tab?.url) {
            return
        }
        extApi.lightpage.queryLights({
            query: {
                url: tab?.url
            }
        }).then(function (res) {
            if (res.success) {
                setLights(res.data.list)
            }
        })
    }


    useEffect(function () {
        fetchWebpage()
    }, [tab,fetchWebpage])

    return(
        <div>

        </div>
    )
}
