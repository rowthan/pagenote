import {useEffect, useState} from "react";
import {WebPage} from "@pagenote/shared/lib/@types/data";
import extApi from "@pagenote/shared/lib/pagenote-api";
import dayjs from "dayjs";
import * as React from "react";
import CheckVersion from "../../components/check/CheckVersion";
import Table from "../../components/Table";
import {onVisibilityChange} from "@pagenote/shared/lib/utils/document";
import {Pagination} from "@pagenote/shared/lib/@types/database";
import BasicLayout from "../../layouts/BasicLayout";


export default function Trash() {
    const [list, setList] = useState<WebPage[]>([])
    const [pagination, setPagination] = useState<Pagination>({
        limit: 100,
        total: 0,
        page: 0
    })

    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    useEffect(function () {
        return onVisibilityChange(function () {
            loadTrashList();
        })
    }, [])

    useEffect(function () {
        loadTrashList()
    }, [pagination.page, pagination.limit])

    function loadTrashList() {
        extApi.lightpage.queryPages({
            query: {
                deleted: true
            },
            limit: pagination.limit,
            page: pagination.page,
            sort: {
                updateAt: -1
            },
            projection: {
                title: 1,
                url: 1,
                key: 1,
                updateAt: 1,
                icon: 1
            }
        }).then((res) => {
            if (res.success) {
                setList((res.data.list || []) as WebPage[])
                setPagination({
                    limit: pagination.limit,
                    page: pagination.page,
                    total: res.data.total,
                })
            }
        })
    }

    function changePagination(page: number, limit: number) {
        setPagination({
            limit: limit,
            page: page,
            total: pagination.total
        })
    }

    function removeItem(key: string) {
        extApi.lightpage.removePages({
            keys: [key],
            removeRelated: ['light', 'snapshot'], // 一并删除标记、截图
        }).then(function () {
            selectedIds.delete(key)
            loadTrashList();
        })
    }

    function revert(key: string) {
        extApi.lightpage.updatePages([{
            key: key,
            deleted: false,
            updateAt: Date.now(),
            expiredAt: 0,
        }]).then(function () {
            selectedIds.delete(key)
            loadTrashList()
        })
    }

    function removeSelected() {
        const keys = Array.from(selectedIds);
        extApi.lightpage.removePages({
            keys: keys,
            removeRelated: ['light', 'snapshot'], // 一并删除标记、截图
        }).then(function () {
            selectedIds.clear();
            loadTrashList()
        })
    }

    function revertSelected() {
        const keys = Array.from(selectedIds);
        const items = keys.map(function (item) {
            return {
                key: item,
                deleted: false,
                updateAt: Date.now(),
                expiredAt: 0,
            }
        });
        extApi.lightpage.updatePages(items).then(function () {
            selectedIds.clear()
            loadTrashList()
        })
    }

    return (
        <CheckVersion requireVersion={'0.24.8'}>
            <BasicLayout title={'网页回收站'}>
                <div className=''>
                    <Table list={list}
                           pagination={pagination}
                           onPaginationChange={changePagination}
                           headLabels={["网页", "更新时间", "操作"]}
                           selectedIds={selectedIds}
                           onSelectIds={setSelectedIds}
                           primaryKey={'key'}
                           renderTDS={function (item, index) {
                               return (
                                   <>
                                       <td>
                                           <div className='max-w-xs overflow-ellipsis'>
                                               <img className='inline' width={14} height={14} src={item.icon}
                                                    alt=""/> {item.title}
                                           </div>
                                           <div
                                               className='overflow-ellipsis max-w-screen-sm break-words pre-wrap overflow-hidden '>
                                               <a className='hover:text-blue-400 text-blue-200' target='_blank'
                                                  href={item.url}>
                                                   {item.url || item.key}
                                               </a>
                                           </div>
                                       </td>
                                       <td>{dayjs(item.updateAt).format('YYYY-MM-DD HH:mm:ss')}</td>
                                       <td>
                                           <button onClick={() => {
                                               removeItem(item.key)
                                           }} className="m-2 btn btn-sm btn-warning">
                                               彻底删除
                                           </button>
                                           <button onClick={() => {
                                               revert(item.key)
                                           }} className="m-2 btn btn-sm btn-success">
                                               恢复
                                           </button>
                                       </td>
                                   </>
                               )
                           }}
                           footerTD={
                               <div className='mx-2'>
                                   {
                                       selectedIds.size > 0 ?
                                           <div>
                                               <button onClick={removeSelected}
                                                       className="btn btn-xs btn-outline btn-error">
                                                   批量删除 {selectedIds.size}
                                               </button>
                                               <button onClick={revertSelected}
                                                       className="ml-2 btn btn-xs btn-outline btn-success">
                                                   批量恢复 {selectedIds.size}
                                               </button>
                                           </div> :
                                           <div className='text-gray-500'>

                                           </div>
                                   }
                               </div>
                           }
                    />
                </div>
            </BasicLayout>
        </CheckVersion>
    )
}
