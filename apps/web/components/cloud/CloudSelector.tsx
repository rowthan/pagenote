import * as React from "react"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel, SelectSeparator,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import useSettingConfig from "hooks/table/useSettingConfig"
import useStat, {CloudStat} from "../../hooks/useStat";
import {supporters} from "../../const/supporters";
import {NavLink} from "react-router-dom";
import { IoCloudOffline } from "react-icons/io5";

export function CloudSelect() {
    const [config, update] = useSettingConfig<{ cloudSource: string }>('_cloud','config');
    const [webdavConfig] = useSettingConfig<{ username: string }>('_webdav','secret');

    const {data: oss} = useStat('oss','data')
    const {data: webdav} = useStat('webdav')

    const statMap: Record<string, CloudStat | undefined> = {
        'oss': oss,
        'webdav': webdav,
    }

    return (
        <Select onValueChange={(value) => {
            update({
                cloudSource: value,
            })
        }} value={config?.cloudSource || ''}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="存储至"/>
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>数据存储至</SelectLabel>
                    <SelectItem value="">
                        <div className={'flex gap-2 items-center'}>
                            <IoCloudOffline fill={'red'} />
                            关闭
                        </div>
                    </SelectItem>
                    {
                        supporters.map((item)=>{
                            const disabled = !statMap[item.type]?.connected
                            if(item.type === 'webdav' && !webdavConfig?.username){
                                return null;
                            }
                            return (
                                <SelectItem
                                    key={item.type}
                                    value={item.type}
                                    disabled={disabled}
                                >
                                    <div className={'flex gap-2 items-center'}>
                                        <img src={item.icon} alt={item.name} className={'w-4 h-4'}/>
                                        <span>{item.name}</span>
                                        {disabled ?
                                            <span className={'text-destructive'}>联通监测异常，请检查配置</span> : ''}
                                    </div>
                                </SelectItem>
                            )
                        })
                    }
                </SelectGroup>
                <SelectSeparator />
                <NavLink to={'/cloud/supporters'}>
                    <SelectGroup>
                        <div className={'p-2 a text-xs'}>
                            更多服务商
                        </div>
                    </SelectGroup>
                </NavLink>

            </SelectContent>
        </Select>
    )
}
