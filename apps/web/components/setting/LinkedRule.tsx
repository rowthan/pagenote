import {type ReactNode} from 'react';
import useSettingConfig from "hooks/table/useSettingConfig";
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

interface Props {
    children?: ReactNode;
}

type Config = {baseUrl: string, queries: string};
export default function LinkedRule(props: Props) {
    const {children} = props;
    const [extensionConfig , setConfig] = useSettingConfig<{ linkRule: Record<string, { queries: string }> }>('extension','config')

    console.log(extensionConfig)
    function saveConfig(data:Config) {
        console.log(data)
        setConfig({
            linkRule: {
                [data.baseUrl]: {
                    queries: data.queries
                }
            }
        })
    }

    const configList = [];
    if(extensionConfig?.linkRule) {
        for (const baseUrl in extensionConfig.linkRule) {
            configList.push({
                baseUrl,
                queries: extensionConfig.linkRule[baseUrl].queries
            })
        }
    }

    return (
        <div className="">
            {
                configList && configList.map((config)=>(
                    <BasicSettingLine
                        key={config.baseUrl}
                        label={`${config.baseUrl}?${config.queries||''}`}
                    />
                ))
            }


            <Dialog>
                <DialogTrigger asChild>
                    <Button className={'w-full'}>
                        添加规则
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>自定义网页识别规则</DialogTitle>
                        <DialogDescription>
                            通过配置实现 https://pagenote.cn/author?a=1 与 https://pagenote.cn/author?a=1&b=2 为同一页面，
                        </DialogDescription>
                    </DialogHeader>
                    <UrlRuleForm onSubmitClick={saveConfig}>
                        <DialogFooter>
                            <Button type="submit">提交</Button>
                        </DialogFooter>
                    </UrlRuleForm>
                </DialogContent>
            </Dialog>
        </div>
    );
}

