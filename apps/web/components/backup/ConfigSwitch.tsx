import React, {type ReactNode} from 'react';
import {Switch} from "../../@/components/ui/switch";
import useSettingConfig from "../../hooks/table/useSettingConfig";

interface Props {
    children?: ReactNode;
    rootKey: '_backup' | '_sync' | 'cloud'
}

export default function ConfigSwitch(props: Props) {
    const [config,update] = useSettingConfig<{
        switch?: boolean,
        enable?: boolean
    }>(props.rootKey,'config');

    const enabled = config?.switch;
    return (
        <Switch checked={enabled} onCheckedChange={(checked)=>{
            update({
                switch: checked,
                enable: checked,
            })
        }} />
    );
}

