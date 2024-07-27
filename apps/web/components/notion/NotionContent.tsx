import {type ReactNode, useEffect, useState} from 'react';
import NotionDoc, {NotionDocProp} from "./NotionDoc";
import {getNotionDetailFromServer} from "../../service/server/api";

interface Props {
    children?: ReactNode;
    docId: string
    notionDoc?: NotionDocProp;
}

export default function NotionContent(props: Props) {
    const {children} = props;
    const [data,setData] = useState<NotionDocProp|null|undefined>(props.notionDoc);

    useEffect(() => {
        // 已经有数据时，不再请求
        if(props.notionDoc){
            return;
        }
        getNotionDetailFromServer(props.docId).then(function (res) {
            console.log('doc detail',res)
         setData(res || null)
       })
    }, [props.docId]);

    if(!data || !data.recordMap){
      return null;
    }

    const {recordMap, title, path, keywords, description} = data;
    return (
        <NotionDoc
            className={'notion-component'}
            recordMap={recordMap}
            title={title}
            path={path}
            keywords={keywords}
            description={description}
            header={null}
            pageHeader={null}
            fullPage={false}
            pageTitle={null}
        />
    );
}
