import {type ReactNode} from 'react';
import useTableQuery from "../../hooks/table/useTableQuery";
import {Collection} from "../../const/collection";

interface Props {
    children?: ReactNode;
}

export default function index(props: Props) {
    const {children} = props;
    const {data} = useTableQuery<{filename: string}>(Collection.file, {
        query:{
        },
        limit: 9999,
        projection:{
            filename: 1,
        }
    })


    return (
        <div className="p-10">
            <h3>本地资源列表：</h3>
            {
                data.map((item,index )=>(
                    <div key={index}>
                        <a className={'link'} href={`/file/${item.filename}`}>{item.filename}</a>
                    </div>
                ))
            }
        </div>
    );
}

