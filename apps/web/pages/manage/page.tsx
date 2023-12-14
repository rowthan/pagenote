import {useEffect, useState} from "react";
import {WebPage} from "@pagenote/shared/lib/@types/data";
import extApi from "@pagenote/shared/lib/pagenote-api";
import dayjs from "dayjs";
import * as React from "react";
import CheckVersion from "../../components/check/CheckVersion";
import Table from "../../components/Table";
import {Pagination, QueryValue} from "@pagenote/shared/lib/@types/database";
import {onVisibilityChange} from "@pagenote/shared/lib/utils/document";
import SearchIcon from '../../assets/svg/search.svg'
import CloseIcon from '../../assets/svg/close.svg'
import BasicLayout from "layouts/BasicLayout";

export default function Page() {
    const [list, setList] = useState<WebPage[]>([])
    const [pagination, setPagination] = useState<Pagination>({
        page: 0,
        pageSize: 10,
        total: 0,
    })
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [keywords, setKeys] = useState('')

    useEffect(function () {
        return onVisibilityChange(function () {
            loadPages();
        })
    }, [])

    useEffect(function () {
        loadPages()
    }, [pagination.page, pagination.pageSize, keywords])

    /**拉取页面数据*/
    function loadPages() {
        const regex = '.*' + keywords + '.*'

        const orFilter: {
            [key in keyof WebPage]?: QueryValue
        }[] = keywords ? ['title', 'url', 'description', 'categories'].map(function (key) {
            return {
                [key]: {
                    $regex: regex
                }
            }
        }) : []

        extApi.lightpage.queryPages({
            query: {
                deleted: false,
                $or: orFilter.length ? orFilter : undefined
            },
            pageSize: pagination.pageSize,
            page: pagination.page,
            sort: {
                updateAt: -1
            },
            projection: {
                title: 1,
                url: 1,
                key: 1,
                updateAt: 1,
                icon: 1,
                categories: 1
            }
        }).then((res) => {
            if (res.success) {
                setList((res.data.list || []) as WebPage[])
                setPagination({
                    page: res.data.page || 0,
                    total: res.data.total || 0,
                    pageSize: res.data.pageSize || 10,
                })
            }
        })
    }

    /**分页器修改*/
    function changePagination(page: number, pageSize: number) {
        setPagination({
            pageSize: pageSize,
            page: page,
            total: pagination.total
        })
    }

    /**页面详情 TODO 拉取快照、标记列表*/
    function detail(key: string) {
        extApi.lightpage.queryPages({
            query: {
                key: key
            },
            limit: 1
        }).then(function () {
            loadPages()
        })
    }

    /**批量删除*/
    function batchDelete() {
        const ids = Array.from(selectedIds);
        extApi.lightpage.updatePages(ids.map(function (item) {
            return {
                key: item,
                deleted: true,
                updateAt: Date.now(),
                expiredAt: Date.now() + 3600 * 1000 * 24 * 30
            }
        })).then(function () {
            loadPages()
            setSelectedIds(new Set())
        })
    }


    return (
        <BasicLayout>
            <CheckVersion requireVersion={'0.24.8'}>
                <div className='mx-auto'>
                    <div className='my-4 input-group'>
                        <input value={keywords} onChange={(e) => {
                            setKeys(e.target.value)
                        }} type="text" placeholder="搜索" className="input input-bordered input-sm w-full max-w-xs"/>
                        <button className='btn btn-square btn-sm' onClick={()=>{keywords?setKeys(''):null}}>
                            {
                                keywords ?
                                    <CloseIcon width={20} height={20}/> :
                                    <SearchIcon width={20} height={20}/>
                            }
                        </button>
                    </div>
                    <Table list={list}
                           pagination={pagination}
                           onPaginationChange={changePagination}
                           selectedIds={selectedIds}
                           onSelectIds={setSelectedIds}
                           primaryKey={'key'}
                           headLabels={["网页", "标签", "更新时间", "操作"]}
                           renderTDS={function (item, index) {
                               return (
                                   <>
                                       <td className='w-10'>
                                           <div className='max-w-md overflow-hidden	overflow-ellipsis truncate'>
                                               <img className='inline' width={14} height={14} src={item.icon} alt=""/>
                                               {item.title}
                                           </div>
                                           <div className='max-w-xl break-words pre-wrap overflow-hidden overflow-ellipsis truncate '>
                                               <a className='hover:text-blue-400 text-blue-200' target='_blank'
                                                  href={item.url}>
                                                   {item.url || item.key}
                                               </a>
                                           </div>
                                       </td>
                                       <td className='pre-wrap max-w-xs	break-words'>
                                           {item.categories?.map(function (item: string, index: number) {
                                               return <span key={index} className="badge badge-ghost badge-sm">{item}</span>
                                           })}
                                       </td>
                                       <td className='text-sm'>{dayjs(item.updateAt).format('YYYY-MM-DD HH:mm:ss')}</td>
                                       <td>
                                           <button disabled onClick={() => {
                                               detail(item.key)
                                           }} className="m-2 btn btn-sm btn-success">
                                               查看详情
                                           </button>
                                       </td>
                                   </>
                               )
                           }}
                           footerTD={
                               <div className='mx-2'>
                                   {
                                       selectedIds.size > 0 &&
                                       <div className="dropdown dropdown-top">
                                           <label tabIndex={0}
                                                  className="btn m-1 btn-sm"> 批量操作({selectedIds.size})</label>
                                           <ul tabIndex={0}
                                               className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                                               <li>
                                                   <button className='btn' disabled={true}>批量备份</button>
                                               </li>
                                               <li onClick={batchDelete}><a>批量删除</a></li>
                                           </ul>
                                       </div>
                                   }
                               </div>
                           }
                    />
                </div>
            </CheckVersion>
        </BasicLayout>
    )
}
