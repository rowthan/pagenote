import {type ReactNode} from 'react';
import useTableQuery from "../../hooks/table/useTableQuery";
import {Collection} from "../../const/collection";
import {computeTimeDiff} from "../../utils/time";

interface Props {
    children?: ReactNode;
}

export default function BackupStat(props: Props) {
    const {children} = props;
    const {data} = useTableQuery<{key: string,value?: number}>(Collection.memory, {
        query: {
            key: 'backup.at',
        },
        limit: 1,
    })


    const latestBackup = data[0]
    const time = latestBackup?.value

    if(!time){
        return null;
    }

    return (
        <div className="">
            上次备份于：{computeTimeDiff(time)}
        </div>
    );
}

