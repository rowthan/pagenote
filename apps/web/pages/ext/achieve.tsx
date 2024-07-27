import React, {FC, PropsWithChildren, useEffect} from "react";
import useTableKeys from "../../hooks/table/useTableKeys";
import {Collection} from "../../const/collection";
import {html} from "@pagenote/shared";
import OfflineHTML = html.OfflineHTML;
import BasicLayout from "../../layouts/BasicLayout";
import useTableQuery from "../../hooks/table/useTableQuery";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import dayjs from "dayjs";
import {Button} from "../../@/components/ui/button";
import {openHtml} from "../../service/offline";
import Empty from "../../components/Empty";
import ExtLayout from "../../layouts/ExtLayout";

interface Props {
    css?: string
    className?: string
}

function SnapshotItem(props:{url:string}) {
    const {url} = props;
    const {data=[]} = useTableQuery<OfflineHTML>(Collection.html, {
        query:{
            relatedPageUrl: url,
        },
        projection:{
            relatedPageUrl: 1,
            icon: 1,
            name: 1,
            description: 1,
            resourceId: 1,
            createAt: 1,
            data: 1,
        }
    })

    const cover = data.find(function (item) {
        return item.icon || item.name
    })


    return(
        <div className={'p-3 max-w-7xl m-auto flex border-card border rounded'}>
            <div className={'w-1/2 shrink-0 flex'}>
                <Avatar>
                    <AvatarImage src={cover?.icon} />
                    <AvatarFallback></AvatarFallback>
                </Avatar>
                <div className={'mx-2'}>
                    <a href={cover?.relatedPageUrl} target={'_blank'} className={'text-sm link'}>{cover?.name || cover?.relatedPageUrl}</a>
                    <div className={'text-xs text-muted-foreground max-w-1/3 line-clamp-2'}>
                        {cover?.description}
                    </div>
                </div>
            </div>
            <div className={'shrink-0 grow-0   ml-3'}>
                <div className={'text-'}>存档版本</div>
                <div className={'flex flex-wrap items-center text-xs text-muted-foreground'}>
                    {
                        data.map((item,index)=>(
                            <div key={item.resourceId || index} className={'mx-1'}>
                                <Button size={'sm'} variant="outline" onClick={()=>{openHtml(item.resourceId,item.data)}}>
                                    {dayjs(item.createAt).format('YYYY-MM-DD HH:mm:ss')}
                                </Button>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

const Achieve: FC<PropsWithChildren<Props>> = (props) => {
    const {data} = useTableKeys<OfflineHTML>(Collection.html, 'relatedPageUrl')

    useEffect(() => {

    }, [])

    return (
        <ExtLayout>
            <div className={'m-2'}>
                {
                    data.map((url)=>(
                        <div key={url} className={'mb-1'}>
                            <SnapshotItem  url={url} />
                        </div>
                    ))
                }
                {
                    data.length ===0 &&
                    <Empty>
                        <div>
                            还没有 <key-word preview={'1'}>存档网页</key-word>
                            ，去尝试一下吧。
                        </div>
                    </Empty>
                }

            </div>
        </ExtLayout>
    );
}
export default Achieve
