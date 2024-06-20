import React, {type ReactNode} from 'react';
import useStat from "../../hooks/useStat";
import {StatBadge} from "../setting/BasicSettingLine";
import classNames from "classnames";

interface Props {
    children?: ReactNode;
    type: 'oss'|'webdav'
    space?: "private"|'data'
    connectedLable?: string
}

export default function CloudStat(props: Props) {
    const {children,type} = props;
    //@ts-ignore
    const {data} = useStat(type,props.space)
    const status = data?.connected ? 'success' : 'fail';
    const label = data?.connected ? (props.connectedLable || 'connected') : data?.error;
    const actionUrl = data?.actionUrl;

    return (
        <>
            <StatBadge key={type} type={status} className={classNames({
                'text-blue-500': status === 'success',
                'text-red-500': status !== 'success',
            })}>
                {actionUrl ? <a className={'a !text-red-500'} href={actionUrl} target={'_blank'}>{label}</a> :label}
            </StatBadge>
        </>
    );
}


export function CloudConnectedCheck() {
    const {data:oss} = useStat('oss','data')
    const {data:webdav} = useStat('webdav');

    const connected = oss?.connected || webdav?.connected;
    return <StatBadge type={connected ? 'success' : 'fail'}>
        {connected ? '' : 'not connected'}
    </StatBadge>
}
