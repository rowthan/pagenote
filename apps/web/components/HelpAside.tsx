import {type ReactNode} from 'react'
import {useRouter} from 'next/router'
import {basePath} from '../const/env'
import {MdOutlineLiveHelp} from "react-icons/md";
import {AiOutlineSetting} from "react-icons/ai";
import {openUrlInGroup} from "../utils/url";

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
            <aside className={'fixed right-4 bottom-6 pb-2'}>
                <div className={'flex flex-col gap-2 text-gray-500'}>
                    <a target={'_blank'}
                       onClick={() => {
                           openUrlInGroup(`https://pagenote.cn/question`)
                       }}
                       className={'cursor-pointer hover:text-blue-500'}
                       aria-label={'help'}>
                        <MdOutlineLiveHelp className={'fill-current text-xl'}/>
                    </a>
                    {
                        showSetting &&
                        <a
                            className={'cursor-pointer hover:text-blue-500'}
                            href={basePath + '/ext/setting.html'} target={'_blank'}>
                            <AiOutlineSetting className={'fill-current text-xl'}/>
                        </a>
                    }
                </div>
            </aside>
        </div>
    )
}
