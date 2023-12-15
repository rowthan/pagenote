import {useEffect, useMemo, useState} from "react";
import {Step, WebPage} from "@pagenote/shared/lib/@types/data";
import extApi from "@pagenote/shared/lib/pagenote-api";
import * as React from "react";
import CheckVersion from "../../components/check/CheckVersion";
import Table from "../../components/Table";
import {Pagination, QueryValue} from "@pagenote/shared/lib/@types/database";
import {onVisibilityChange} from "@pagenote/shared/lib/utils/document";
import SearchIcon from '../../assets/svg/search.svg'
import CloseIcon from '../../assets/svg/close.svg'
import LightText from "../../components/LightText";
import BasicLayout from "../../layouts/BasicLayout";
import {computeTimeDiff} from "../../utils/time";
import ColorLines from "../../components/ColorLines";

export default function Light() {
    const [list, setList] = useState<WebPage[]>([]);
    const [colors,setColors] = useState<string[]>([])
    const [pagination, setPagination] = useState<Pagination>({
        page: 0,
        pageSize: 10,
        total: 0,
    })
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [keywords, setKeys] = useState('');

    useEffect(function () {
        loadColors();
        return onVisibilityChange(function () {
            loadList();
        })
    }, [])

    useEffect(function () {
        loadList()
    }, [pagination.pageSize,pagination.page,keywords])

    function loadColors() {
        extApi.lightpage.groupLights({
            groupBy: 'bg',
            projection: {
                key: 1,
            },
        }).then(function (res) {
            console.log('color',res)
            if(res.success){
                const colors = []
                for(let i in res.data){
                    colors.push(i)
                }
                setColors(colors)
            }
        })
    }

    /**拉取页面数据*/
    function loadList() {
        const regex = '.*' + keywords + '.*'

        const orFilter: {
            [key in keyof WebPage]?: QueryValue
        }[] = keywords ? ['text', 'pre', 'suffix', 'tip','url'].map(function (key) {
            return {
                [key]: {
                    $regex: regex
                }
            }
        }) : []

        extApi.lightpage.queryLights({
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
                url: 1,
                key: 1,
                updateAt: 1,
                text: 1,
                tip: 1,
                bg: 1
            }
        }).then((res) => {
            console.log(res,'res')
            if (res?.success) {
                setList((res.data.list || []) as WebPage[])
                setPagination({
                    ...pagination,
                    total: res.data.total || 0,
                })
            }
        })
    }

    /**分页器修改*/
    function changePagination(page: number, pageSize: number) {
        setPagination({
            ...pagination,
            pageSize: pageSize,
            page: page,
        })
    }


    /**批量删除*/
    function batchDelete(list?: string[]) {
        const ids = Array.from(selectedIds);
        extApi.lightpage.removeLights({
            keys: Array.isArray(list) ? list : ids
        }).then(function () {
            loadList()
            setSelectedIds(new Set())
        })
    }


    return (
        <BasicLayout>
            <CheckVersion requireVersion={'0.24.8'}>
                <div className='mx-auto'>
                    <div className='my-4  sticky top-0 z-40'>
                        <div className='input-group'>
                            <input value={keywords} onChange={(e) => {
                                setKeys(e.target.value)
                            }} type="text" placeholder="搜索" className="input input-bordered input-sm w-full"/>
                            <button className='btn btn-square btn-sm' onClick={()=>{keywords?setKeys(''):null}}>
                                {
                                    keywords ?
                                        <CloseIcon width={20} height={20}/> :
                                        <SearchIcon width={20} height={20}/>
                                }
                            </button>
                        </div>
                        {/*<div>*/}
                        {/*    <h2>过滤标记颜色：</h2>*/}
                        {/*    {*/}
                        {/*        useMemo(()=>(<ColorLines colors={colors}/>),[colors])*/}
                        {/*    }*/}
                        {/*</div>*/}
                    </div>
                    <Table list={list}
                           pagination={pagination}
                           onPaginationChange={changePagination}
                           selectedIds={selectedIds}
                           pageSteps={[10,50,100]}
                           onSelectIds={setSelectedIds}
                           primaryKey={'key'}
                           headLabels={["标记内容", "笔记", "操作"]}
                           renderTDS={function (item: Step, index) {
                               return (
                                   <>
                                       <td className='max-w-7xl w-2/4'>
                                           <div className='whitespace-pre-line overflow-ellipsis pre-wrap break-words'>
                                               <LightText light={item}/>
                                           </div>
                                           {/*<div className='max-w-xl break-words pre-wrap overflow-hidden overflow-ellipsis truncate '>*/}
                                           {/*    <a className='hover:text-blue-400 text-blue-200' target='_blank'*/}
                                           {/*       href={item.url}>*/}
                                           {/*        {getDomain(item.url || item.key || '',true)}*/}
                                           {/*    </a>*/}
                                           {/*</div>*/}
                                       </td>
                                       <td className='max-w-md whitespace-pre-line	overflow-ellipsis'>
                                           <div dangerouslySetInnerHTML={{__html: item.tip || ''}}></div>
                                       </td>
                                       <td>
                                           <span className='text-xs'>{computeTimeDiff(item.updateAt)}</span>
                                           <button onClick={() => {
                                               batchDelete([item.key || ''])
                                           }} className="m-2 btn btn-xs btn-success btn-outline">
                                               彻底删除
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
                                               {/*<li>*/}
                                               {/*    <button className='btn' disabled={true}>批量备份</button>*/}
                                               {/*</li>*/}
                                               <li onClick={()=>{batchDelete()}}><a>彻底删除</a></li>
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
