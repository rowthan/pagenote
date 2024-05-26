import React, {type ReactNode, useState} from 'react';
import useStat from "../../hooks/useStat";
import {StatBadge} from "../setting/BasicSettingLine";

interface Props {
    children?: ReactNode;
    types: ('oss'|'webdav')[]
    space?: "private"|'data'
}

export default function CloudStat(props: Props) {
    const {children,types = ['oss','webdav']} = props;
    const [oss] = useStat('oss',props.space)
    const [webdav] = useStat('webdav')
    const stats = {
        oss,
        webdav
    }

    const connected = types.some(function(type){
       return Boolean(stats[type]?.connected)
    })
    const errorType = types.find(function(item){
        return stats[item]
    })
    const error = errorType ? stats[errorType] : null;
    console.log(error,webdav)

    return (
        <>
            {
                connected ? <StatBadge type={'success'} className={'text-blue-500'}>
                        成功连接
                    </StatBadge>:
                    <StatBadge type={'fail'}>
                        {error?.actionUrl ? <a className={'a !text-red-500'} href={error.actionUrl} target={'_blank'}>{error.error}</a>:error?.error}
                    </StatBadge>

            }
        </>
    );
}

