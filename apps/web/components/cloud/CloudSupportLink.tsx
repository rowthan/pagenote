import React, {type ReactNode} from 'react';
import {supporterMap, SupporterType} from "../../const/supporters";
import useSettingConfig from "../../hooks/table/useSettingConfig";
import {NavLink} from "react-router-dom";

interface Props {
    children?: ReactNode;
    type?: SupporterType;
}

export default function CloudSupportLink(props: Props) {
    const [cloudConfig] = useSettingConfig<{cloudSource?: string}>('_cloud','config')

    const cloudSource = props.type ?? cloudConfig?.cloudSource;

    const cloudInfo = cloudSource ? supporterMap[cloudSource] : null;

    if(!cloudInfo){
        return
    }

    return (
        cloudInfo?.path.startsWith('http') ?
            <a href={cloudInfo?.path} className={'a'}>
                {cloudInfo?.name || cloudSource}
            </a>:
            <NavLink to={cloudInfo.path} className={'a'}>{cloudInfo.name || cloudSource}</NavLink>
        );
}

