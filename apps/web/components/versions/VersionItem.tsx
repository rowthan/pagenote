import dayjs from "dayjs";
import {Version} from 'hooks/useVersions';
import {useEffect, useState} from 'react';
import {fetchVersionDetail} from 'service';


const BROWSER_MAP: Record<string, { icon: string, link: string }> = {
    firefox: {
        icon: "/browser/firefox.png",
        link: "https://addons.mozilla.org/zh-CN/firefox/addon/pagenote"
    },
    chrome: {
        icon: "/browser/chrome.png",
        link: "https://chrome.google.com/webstore/detail/pagenote%E4%B8%80%E9%A1%B5%E4%B8%80%E8%AE%B0/hpekbddiphlmlfjebppjhemobaopekmp?utm_source=extension"
    },
    edge: {
        icon: "/browser/edge.png",
        link: "https://microsoftedge.microsoft.com/addons/detail/ablhdlecfphodoohfacojdngdfkgneaa"
    },
    offline: {
        icon: "https://static.oschina.net/uploads/logo/chromium+engine_AIOBe.png",
        link: "https://chrome.zzzmh.cn/info/hpekbddiphlmlfjebppjhemobaopekmp"
    },
    "360": {
        icon: "https://se3.360simg.com/t018dd8a53c0e2cf61c.png",
        link: "https://ext.chrome.360.cn/webstore/search/pagenote"
    },
    "test": {
        icon: "https://pagenote.cn/favicon.ico",
        link: "https://page-note.notion.site/PAGENOTE-0764216ae635435183140adafdc3ecf4"
    }
}

export default function VersionItem(props: { version: Version, initShowAll: boolean }) {
    const [showAll, setAll] = useState(props.initShowAll);
    const [detail, setDetail] = useState(props.version);
    const [loading, setLoading] = useState(false)
    useEffect(function () {
        if (detail.version && showAll) {
            setLoading(true)
            fetchVersionDetail(detail.version).then(function (res) {
                if (res) {
                    setDetail(res as Version)
                }
                setLoading(false)
            })
        }
    }, [showAll])

    function toggle() {
        setAll(!showAll)
    }

    if (!detail?.version || !detail?.description) {
        return null
    }


    return (
        <div className="relative flex items-baseline gap-6 pb-5">
            <div className="before:absolute before:left-[5.5px] before:h-full before:w-[1px] before:bg-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12"
                     className="bi bi-circle-fill fill-gray-400" viewBox="0 0 16 16">
                    <circle cx="8" cy="8" r="8"/>
                </svg>
            </div>
            <div className="w-full p-2">
                <div className='flex items-center '>
                    <div className="text-sm mr-2">
                        <h3 className="text-lg">{detail.version} </h3>
                        <time className="text-xs">
                            {dayjs(new Date(detail.release_time)).format('YYYY-MM-DD')}
                        </time>
                    </div>
                    <div>
                        {
                            detail.platform.map((platform, index) => (
                                <a key={index} href={BROWSER_MAP[platform]?.link}>
                                    <img className='inline-block mx-1 w-6 h-6' key={index}
                                         src={BROWSER_MAP[platform]?.icon} alt={platform}/>
                                </a>
                            ))
                        }
                    </div>
                </div>
                <div
                    className={`${showAll ? "collapse-open" : "collapse-close"} collapse collapse-plus border border-base-300 bg-base-100 rounded-box`}>
                    <div onClick={toggle}
                         className="w-full cursor-pointer collapse-title text-xl font-medium whitespace-nowrap overflow-ellipsis overflow-hidden">
                        {detail.description}
                        {
                            detail?.tags.map((tag, index) => (
                                <span key={index} className={'mx-1 badge badge-outline badge-sm'}>{tag}</span>
                            ))
                        }
                    </div>
                    {
                        showAll &&
                        <div className="collapse-content">
                            {
                                detail._markdown &&
                                <mark-down css="/markdown.css">{detail._markdown}</mark-down>
                            }
                            {/*<ReactMarkdown*/}
                            {/*    className="markdown-body"*/}
                            {/*    children={(detail._markdown || "")}*/}
                            {/*    rehypePlugins={[rehypeRaw]}*/}
                            {/*    remarkPlugins={[remarkBreaks, remarkGfm]}/>*/}
                        </div>
                    }

                </div>
            </div>
        </div>
    )
}
