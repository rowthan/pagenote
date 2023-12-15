import {useEffect, useState} from "react";
import {WebPage} from "@pagenote/shared/lib/@types/data";
import WebPageItem from "../webpage/WebPageItem";
import extApi from "@pagenote/shared/lib/pagenote-api";
import dayjs from "dayjs";

export default function TodayRelated() {
    const [list,setList] = useState<Partial<WebPage>[]>([]);

    const today = dayjs().startOf('day').toDate().getTime();
    function fetchToday() {
        extApi.lightpage.queryPages({
            query:{
                $or:[
                    {
                        updateAt: {
                            $gt:today
                        }
                    },
                    {
                        createAt: {
                            $gt: today
                        }
                    }
                ]
            }
        },{
            cacheControl:{
                maxAgeMillisecond: 60000
            }
        }).then(function (res) {
            setList(res?.data?.list||[])
        })
    }

    useEffect(function () {
        fetchToday()
    },[])

    return(
        <div>
            {
                list.map((item,index)=>(
                    <WebPageItem key={index} webpage={item} keyword={''} />
                ))
            }
        </div>
    )
}
