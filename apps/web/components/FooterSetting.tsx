import {type ReactNode} from 'react';
import {MdOutlineLiveHelp} from "react-icons/md";
import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarSeparator,
    MenubarShortcut,
    MenubarTrigger,
} from "@/components/ui/menubar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {basePath} from "../const/env";
import { FaCheck } from "react-icons/fa6";
import useSettingConfig from "../hooks/table/useSettingConfig";

interface Props {
    children?: ReactNode;
}

export function PopSetting() {
    const [config,update] = useSettingConfig<{popMode?:'panel'|'popup'}>('extension')
    const isSidePanel = config?.popMode === 'panel';

    return (
        <div className={'flex flex-col min-w-[120px]'}>
            <button className={'flex justify-between hover:bg-accent px-2 py-1'}
                    onClick={() => {
                        update({
                            popMode: 'popup'
                        })
                    }}
            >
                <span>弹层模式</span>
                {
                    !isSidePanel && <FaCheck/>
                }
            </button>
            <button className={'flex justify-between hover:bg-accent px-2 py-1'}
                    onClick={() => {
                        update({
                            popMode: 'panel'
                        })
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
    return (
        <div className="fixed shadow bottom-0 border-t-muted w-full flex justify-between p-2 px-6 bg-base-100">
            <div>
                <a href="https://pagenote.cn/help" target={'_blank'}>
                    <MdOutlineLiveHelp className={'fill-current text-xl'}/>
                </a>
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

