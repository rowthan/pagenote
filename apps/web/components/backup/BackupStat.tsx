import {type ReactNode} from 'react';
import useTableQuery from "../../hooks/table/useTableQuery";
import {Collection} from "../../const/collection";
import {computeTimeDiff} from "../../utils/time";

interface Props {
    children?: ReactNode;
    title: string
    statKey: 'backup.at'| 'sync.at' |string
}

export default function BackupStat(props: Props) {
    const {children,title='',statKey='backup.at'} = props;
    const {data} = useTableQuery<{key: string,value?: number}>(Collection.memory, {
        query: {
            key: statKey,
        },
        limit: 1,
    })


    const latestBackup = data[0]
    const time = latestBackup?.value

    if(!time){
        return null;
    }

    return (
        <span className="">
           {title || statKey} {computeTimeDiff(time)}
        </span>
    );
}

