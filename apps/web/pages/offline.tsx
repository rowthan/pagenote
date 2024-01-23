import React, {FC, PropsWithChildren, useEffect} from "react";
import {useRouter} from "next/router";
import useTableQuery from "../hooks/table/useTableQuery";
import {html} from "@pagenote/shared";
import {Collection} from "../const/collection";
import OfflineHTML = html.OfflineHTML;
import extApi from "@pagenote/shared/lib/pagenote-api";
import useWhoAmi from "../hooks/useWhoAmi";

interface Props {
    css?: string
    className?: string
}

const Component: FC<PropsWithChildren<Props>> = (props) => {
    const {children} = props;
    const { query } = useRouter();
    const [whoAmI] = useWhoAmi()
    const id = query.id as string

    useEffect(() => {
        if(!id){
            return;
        }
        extApi.table
            .query({
                table: 'html',
                db: 'resource',
                params: {
                    query: {
                        resourceId: id,
                    },
                    limit: 1,
                },
            }).then(function (res) {
            const resource = res.data ? res.data.list[0]: null;
            if(!resource){
                return;
            }
            // 1.iframe 隔离的方式
            const originUrl = resource.relatedPageUrl || resource.originUrl || ''
            const iframe = document.createElement('iframe')
            // iframe.srcdoc =
            //     resource.data ||
            //     '<!DOCTYPE html><html><head></head><body></body></html>'
            iframe.src = originUrl
            iframe.setAttribute('data-pagenote', 'html')
            iframe.style.width = '100%'
            iframe.style.height = '100%'
            const current = document.querySelector('iframe[data-pagenote]')
            if (current) {
                document.documentElement.removeChild(current)
            }
            document.documentElement.appendChild(iframe)


            iframe?.contentDocument?.write(resource.data || '')
        })


    }, [id])

    return (
        <div className="">
            {children}
        </div>
    );
}
export default Component
