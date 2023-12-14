import {useEffect, useState} from "react";
import {developer} from "@pagenote/shared/lib/extApi";
import extApi from "@pagenote/shared/lib/pagenote-api";
import {onVisibilityChange} from "@pagenote/shared/lib/utils/document";
import dayjs from "dayjs";
import CheckVersion from "../check/CheckVersion";
import LogInfo = developer.LogInfo;
import LogLevel = developer.LogLevel;
import {toast} from "../../utils/toast";
import {Pagination} from "@pagenote/shared/lib/@types/database";

const COLOR_MAP: Record<LogLevel, string> = {
    debug: "text-gray-500",
    error: "text-red-500",
    info: "text-gray-500",
    warn: "text-amber-500"
}

const ALL_LOG_LEVEL = [LogLevel.INFO, LogLevel.DEBUG, LogLevel.WARN, LogLevel.ERROR]
export default function Logs(props: { levels?: LogLevel[], initPageSize?: number }) {
    const {levels = ALL_LOG_LEVEL, initPageSize = 100} = props
    const [logs, setLogs] = useState<Partial<LogInfo>[]>([]);
    const [loading, setLoading] = useState(false)
    const [pagination, setPagination] = useState<{ pageSize: number, page: number, totalPages: number }>({
        pageSize: initPageSize,
        page: 0,
        totalPages: 0
    })

    const {page, pageSize, totalPages} = pagination;

    useEffect(function () {
        loadLogs();
        return onVisibilityChange(function () {
            loadLogs()
        })
    }, [page])

    function loadLogs() {
        if (loading) {
            return
        }
        setLoading(true)
        extApi.developer.logs({
            query: {
                // @ts-ignore
                level: {
                    $in: levels
                }
            },
            pageSize: pageSize,
            page: page,
            sort: {
                id: -1
            }
        }).then(function (res) {
            if (res?.success) {
                setLogs(res.data.list)
                setPagination({
                    page: res.data.page,
                    pageSize: res.data.pageSize,
                    totalPages: res.data.totalPages,
                })
            }
        }).finally(function () {
            setLoading(false)
        })
    }

    function downloadLogs() {
        extApi.developer.downloadLog({}).then(function (res) {
            if (res?.success) {
                toast('已下载，文件' + res.data.filename)
            }
        })
    }

    function changePagination(page: number) {
        setPagination({
            ...pagination,
            page: page,
        })
    }


    return (
        <div className='max-w-full max-h-full overflow-y-auto'>
            <CheckVersion requireVersion={'0.24.0'}>
                <div className={'max-h-screen'}>
                    <div className="mockup-code	overflow-auto bg-gray-800 text-gray-100	 ">
                        {
                            logs.length ?
                                <div>
                                    {
                                        logs.map(function (item) {
                                            return (
                                                <pre key={item.id} data-prefix=">"
                                                     className={`${COLOR_MAP[item.level as LogLevel]} max-w-full break-all whitespace-pre-line`}>
                                                <time>{dayjs(item.createAt).format('YYYY-MM-DD HH:mm:ss')}</time>
                                                <span
                                                    className={'mx-2 badge badge-sm badge-outline w-40'}>{item.namespace}</span>
                                                <code
                                                    className='ml-4 break-words '>{item.message || item.stack?.substring(0, 40)}</code>
                                            </pre>
                                            )
                                        })
                                    }
                                    <pre data-prefix=">" className="text-success">
                                <code>
                                    <CheckVersion requireVersion={'0.24.0'} label={'下载日志'}><button
                                        onClick={downloadLogs}
                                        className={'btn btn-link'}>下载完整日志</button></CheckVersion>
                                </code>
                                        {pageSize < 100 && <a className={'link text-sm'} href="/log">查看更多</a>}
                            </pre>
                                </div>
                                :
                                <pre data-prefix="$" className="text-warning"><code>暂无日志</code></pre>
                        }
                    </div>
                    <div className={'sticky bottom-0 h-10'}>
                        <div className="btn-group absolute right-10">
                            <button className="btn btn-xs rounded" onClick={() => {
                                changePagination(page - 1)
                            }} disabled={page === 0}>«
                            </button>
                            <button className="btn btn-xs rounded">{page + 1}</button>
                            <button className="btn btn-xs rounded" onClick={() => {
                                changePagination(page + 1)
                            }} disabled={page >= totalPages}>»
                            </button>
                        </div>
                    </div>
                </div>
            </CheckVersion>
        </div>
    )
}

function Levels() {
    const levels = [LogLevel.INFO, LogLevel.DEBUG, LogLevel.WARN, LogLevel.ERROR]
    return (
        <div>
            {
                levels.map((level) => (
                    <div key={level} className="form-control w-20">
                        <label className="label cursor-pointer">
                            <span className="label-text">debug</span>
                            <input type="checkbox" checked={levels.includes(level)}
                                   className={`checkbox bg-red-500 ${COLOR_MAP[level]}`}/>
                        </label>
                    </div>
                ))
            }
        </div>
    )
}
