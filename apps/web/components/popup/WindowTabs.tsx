import Tab = chrome.tabs.Tab;
import useCurrentTab from "hooks/useCurrentTab";
import LightedTab from "./LightedTab";
import {useMemo} from "react";

type TabGroups = Tab[];

function Window(props: { tabs: TabGroups, currentTab?: Tab }) {
    const {tabs,currentTab} = props;


    const isCurrentWindow = tabs[0].windowId === currentTab?.windowId
    return (
        <div className={'border mb-4 p-1 rounded'}>
            <div className={` grid grid-cols-10 gap-1 justify-center ${isCurrentWindow?'active':''}`}>
                {
                    useMemo(()=>(
                        tabs.map((item) => {
                            const isCurrentTab = item.id===currentTab?.id
                            return(
                                <LightedTab key={item.id} tab={item} isCurrent={isCurrentTab} />
                            )
                        })
                    ),[tabs,currentTab])
                }
            </div>
        </div>
    )
}

export default function WindowTabs() {
    const {tab, windows=[]} = useCurrentTab();

    return (
        <div className={''}>
            {
                useMemo(()=>(
                    windows.map(function (item, index) {
                        return (
                            <Window tabs={item} key={index} currentTab={tab}/>
                        )
                    })
                ),[tab,windows])
            }
        </div>
    )
}
