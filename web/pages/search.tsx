import React, {useEffect, useState} from 'react';
import api from '../api/index'
import {WebPage} from "@pagenote/shared/lib/@types/Types";
import {Pagination} from "@pagenote/shared/lib/@types/database";
import { useRouter } from 'next/router'

export default function Search() {
    const router = useRouter()
    const { keywords='pagenote' } = router.query
    const [pages,setPages] = useState<WebPage[]>([]);
    const [pagination,setPagination] = useState<Pagination>(function () {
        return{
            pages: 0,
            limit: 10,
            total: 0
        }
    })
    const [currentPage,setCurrentPage] = useState(0);

    function searchPages() {
        const query = {
            deleted: false,
            $or:[
                {
                    text:{
                        $like: keywords
                    }
                },
                {
                    domain:{
                        $like: keywords
                    }
                },
                {
                    tip:{
                        $like: keywords
                    }
                },
                {
                    context:{
                        $like: keywords
                    }
                },
                {
                    categories:{
                        $like: keywords
                    }
                },
            ]
        }
        console.time('sousuo')
        api.lightpage.getLightPages({
            limit: pagination.limit,
            skip: currentPage * pagination.limit,
            query: query
        }).then(function (result) {
            console.log('拉取结果',result)
            console.timeEnd('sousuo')
            if(result.success){
                setPages(result.data.pages)
                setPagination(result.data.pagination)
            }
        })
    }

    useEffect(function () {
        searchPages()
    },[currentPage,keywords])

    useEffect(function () {

        api.setting.getUserSetting().then(function (result) {
            // console.log('user setting ',result)
        })

        api.commonAction.usage().then(function (result) {
            console.log(result)
        })

        api.browserAction.getBrowserActionInfo({
            tabId: undefined
        }).then(function (result) {
            // console.log(result)
        })

        setTimeout(function () {
            api.browserAction.setBrowserActionDisplay({
                info: {
                    text: 'hi',
                    color: '#9affe9',
                    title: '和来来来',
                },
                tabId: undefined
            }).then(function (result) {
                // console.log('修改颜色',result)
            })
        },1000)

    },[])

    return(
        <div className={'container w-1/2 sm:w-full m-auto my-8'}>
            {
                pages.map((page,index)=>(
                    <div className={'text-base'} key={page.key}>
                        {index}: {page.plainData.title || page.plainData.url}
                    </div>
                ))
            }
            <div>
                搜索结果共有：{pagination.total} 个
                {
                    new Array(pagination.pages).fill(1).map(function (i,index) {
                        return <button key={index} onClick={()=>{setCurrentPage(index)}}>{index}</button>
                    })
                }
            </div>
        </div>
    )
}
