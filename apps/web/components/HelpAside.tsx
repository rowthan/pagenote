import {type ReactNode} from 'react'
import {useRouter} from 'next/router'
import {MdOutlineLiveHelp} from "react-icons/md";
import {AiOutlineSetting} from "react-icons/ai";
import {openUrlInGroup} from "../utils/url";
import FooterSetting, {PopSetting} from "./FooterSetting";
import {Popover, PopoverContent, PopoverTrigger} from "../@/components/ui/popover";
import {LuCopyCheck} from "react-icons/lu";
import ActionButton from "./button/ActionButton";
import useTabPagenoteState from "../hooks/useTabPagenoteState";
import useCurrentTab from "../hooks/useCurrentTab";
import extApi from "@pagenote/shared/lib/pagenote-api";

interface Props {
    children?: ReactNode
}

export default function HelpAside(props: Props) {
    const {children} = props
    const {pathname} = useRouter()
    const showSetting = !pathname.includes('/setting')

    return (
        <div className="bg-accent">
            {children}
            <aside className={'fixed right-4 bottom-6 pb-2 sm:block hidden'}>
                <div className={'flex flex-col gap-2 text-gray-500'}>
                    <a target={'_blank'}
                       onClick={() => {
                           openUrlInGroup(`https://pagenote.cn/question`)
                       }}
                       className={'cursor-pointer hover:text-blue-500'}
                       aria-label={'help'}>
                        <MdOutlineLiveHelp className={'fill-current text-xl'}/>
                    </a>
                    <a href="https://pagenote.cn/setting">
                        <AiOutlineSetting className={'fill-current text-xl'}/>
                    </a>
                    {/*<Popover>*/}
                    {/*    <PopoverTrigger>*/}
                    {/*        <AiOutlineSetting className={'fill-current text-xl'}/>*/}
                    {/*    </PopoverTrigger>*/}
                    {/*    <PopoverContent className={'text-sm p-0'}>*/}
                    {/*        <PopSetting/>*/}
                    {/*    </PopoverContent>*/}
                    {/*</Popover>*/}
                </div>
            </aside>
            <div className={'sm:hidden block'}>
                <FooterSetting/>
            </div>
        </div>
    )
}
