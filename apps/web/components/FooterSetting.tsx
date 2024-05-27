import {type ReactNode} from 'react';
import {MdOutlineLiveHelp} from "react-icons/md";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {basePath} from "../const/env";
import { FaCheck } from "react-icons/fa6";
import useSettingConfig from "../hooks/table/useSettingConfig";
import {useRouter} from "next/router";
import {LuCopyCheck} from "react-icons/lu";
import ActionButton from "./button/ActionButton";
import useTabPagenoteState from "../hooks/useTabPagenoteState";
import useCurrentTab from "../hooks/useCurrentTab";
import extApi from "@pagenote/shared/lib/pagenote-api";

interface Props {
    children?: ReactNode;
}

export function PopSetting() {
    const [config,update] = useSettingConfig<{popMode?:'panel'|'popup'}>('extension')
    const isSidePanel = config?.popMode === 'panel';
    const {pathname} = useRouter();
    const isSidePanelInPath = pathname.includes('sidepanel');
    const {tab} = useCurrentTab();

    function updateMode(mode: 'popup'|'panel') {
        update({
            popMode: mode,
        }).then(function () {
            if(mode==='popup' && isSidePanelInPath){
                window.close();
            }
            if(mode==='panel' && !isSidePanelInPath){
                window.close();
                tab?.id && chrome && chrome.sidePanel && chrome.sidePanel.open({
                    tabId: tab?.id
                })
            }
        })
    }

    return (
        <div className={'flex flex-col min-w-[120px]'}>
            <button className={'flex justify-between hover:bg-accent px-2 py-1'}
                    onClick={() => {
                        updateMode('popup')
                    }}
            >
                <span>弹层模式</span>
                {
                    !isSidePanel && <FaCheck/>
                }
            </button>
            <button className={'flex justify-between hover:bg-accent px-2 py-1'}
                    onClick={() => {
                        updateMode('panel')
                    }}
            >
                侧边栏模式
                {
                    isSidePanel && <FaCheck/>
                }
            </button>
            <a href={`${basePath}/ext/setting.html`} target={'_blank'} className={'hover:bg-accent px-2 py-1'}>
                更多设置
            </a>
        </div>
    )
}

export default function FooterSetting(props: Props) {
    const [tabState, mutate, isLoading] = useTabPagenoteState()
    const { tab } = useCurrentTab()

    function enableCopy() {
        if (tabState?.enabledCopy) {
            return
        }
        extApi.commonAction
            .injectCodeToPage({
                scripts: ['/lib/enable_copy.js'],
                tabId: tab?.id,
                css: [],
                allFrames: false,
            })
            .then(function (res) {
                mutate()
            })
    }
    return (
        <div className="fixed shadow bottom-0 border-t-muted w-full flex items-center justify-between p-2 px-6 bg-base-100">
            <div className={'flex gap-2'}>
                <ActionButton
                    active={tabState?.enabledCopy}
                    onClick={enableCopy}
                    tip={'工具：接触网站赋值限制'}
                    keyboard={'enable_copy'}
                >
                    <LuCopyCheck/>
                </ActionButton>
            </div>
            <div className={'text-sm text-muted-foreground'}>
                <Popover>
                    <PopoverTrigger>常用设置</PopoverTrigger>
                    <PopoverContent className={'text-sm p-0'}>
                        <PopSetting />
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    );
}

