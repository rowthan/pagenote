import {type ReactNode, useState} from 'react';
import {Button} from "@/components/ui/button";
import BasicSettingLine from "./BasicSettingLine";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog';
import UrlRuleForm from "../form/UrlRuleForm";
import md5 from "md5";
import useTableQuery from "../../hooks/table/useTableQuery";
import {Collection} from "../../const/collection";

interface Props {
    children?: ReactNode;
}


const KEYS = ["DBCODE","dbcode","dbname","FileName","filename","TABLEName"]
const PRESET_RULES: Record<string, Config[]> = {
    zhiwang: [
        {
            key: "CNKI_NET",
            matchUrl: 'https://www.cnki.net/*',
            template: `[origin][pathname]?[?:${KEYS.toString()}]&title=[title]`
        },
        {
            key: "KNS_CNKI_NET",
            matchUrl: 'https://kns.cnki.net/*',
            template: `[origin][pathname]?[?:${KEYS.toString()}]&title=[title]`
        },
        {
            key: "KNS_ALL_CNKI_NET",
            matchUrl: 'https://*.cnki.net/*',
            template: `[origin][pathname]?[?:${KEYS.toString()}]&title=[title]`
        },
    ]
}

const KEY_PREFIX = 'extension.linkRule.'

type Config = {matchUrl: string, template: string, key?: string};
export default function LinkedRule(props: Props) {
    const {children} = props;
    const [initValue,setInitFormValue] = useState<Config>();
    const {data: configList=[], put,remove} = useTableQuery<{
            key: string,
            rootKey: string,
            value: Config}>(Collection.config,{
                query:{
                    rootKey: 'extension',
                    key: {
                        $regex: KEY_PREFIX
                    }
                }
    })
    function saveConfig(data:Config) {
        let key = data.key || initValue?.key || KEY_PREFIX+md5(data.matchUrl);
        if(!key.startsWith(KEY_PREFIX)){
            key = KEY_PREFIX + key
        }
        put({
            key: key,
            rootKey: 'extension',
            value: data,
        }).then(function () {
            setInitFormValue(undefined)
        })
    }


    return (
        <div className="">
            {
                configList && configList.map((item,index)=>{
                    const config = item.value;
                    if(!config){
                        return null;
                    }
                    config.key = item.key;
                    return (
                        <BasicSettingLine
                            key={index}
                            subLabel={
                                <div className={'whitespace-pre-wrap max-w-[80%] break-all'}>{config.template}</div>
                            }
                            label={config.matchUrl}
                            right={
                                <div className={'flex gap-2'}>
                                    <button onClick={() => {
                                        remove(item.key)
                                    }}>删除
                                    </button>
                                    <button onClick={() => {
                                        setInitFormValue(config)
                                    }}>编辑
                                    </button>
                                </div>

                            }
                        />
                    )
                })
            }

            <Button className={'w-full mt-10'}
                    onClick={()=>{
                setInitFormValue({
                    matchUrl: '',
                    template: ''
                })
            }} disabled={configList.length > 10}>
                添加规则
            </Button>

            <Button className={'w-full mt-10'} variant={'ghost'} onClick={()=>{
                PRESET_RULES.zhiwang.forEach(function (item) {
                    console.log('save config',item)
                    saveConfig(item)
                })
            }}>
                一键配置（知网）
            </Button>


            {
                <Dialog open={!!initValue} onOpenChange={(open)=>{
                    if(!open){
                        setInitFormValue(undefined)
                    }
                }}>
                    <DialogTrigger asChild >

                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>自定义网页识别规则</DialogTitle>
                            <DialogDescription>
                                识别不同URL链接为同一页面
                            </DialogDescription>
                        </DialogHeader>
                        <UrlRuleForm onSubmitClick={saveConfig} initValue={initValue}>
                            <DialogFooter>
                                <Button type="submit">提交</Button>
                            </DialogFooter>
                        </UrlRuleForm>
                    </DialogContent>
                </Dialog>
            }

        </div>
    );
}

