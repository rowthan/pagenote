import React, {type ReactNode, useEffect, useState} from 'react';
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {DialogFooter} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {useForm} from "react-hook-form";
import * as z from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Textarea} from "../../@/components/ui/textarea";

interface Props {
    children?: ReactNode;
    onSubmitClick: (data: any) => void
    initValue?: {
        matchUrl: string,
        template: string
    }
}

const demoTemplate = '[origin][pathname][search]'
const FormSchema = z.object({
    matchUrl: z.string().regex(/^http/,{
        message: '一般以 http 开头'
    }).min(10,{
        message:'请输入适用链接范围'
    }),
    template: z.string().regex(/\[.*]/,{
        message: '至少包含一个变量，如 [path]'
    }).min(8,{
        message:'请输入网址模版，如 '+demoTemplate
    }),
})

export default function UrlRuleForm(props: Props) {
    const {onSubmitClick,initValue} = props;
    const [loading,setLoading] = useState(false)
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: initValue
    })

    console.log(initValue,'init')

    // useEffect(() => {
    //     form.reset(initValue)
    //     // form.setValue(initValue)
    // }, [initValue]);


    function onSubmit(data:z.infer<typeof FormSchema>) {
        onSubmitClick(data)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className=" space-y-6">
                <FormField
                    control={form.control}
                    name="matchUrl"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>
                                规则适用范围
                            </FormLabel>
                            <FormDescription>
                                此条规则作用的网址范围，应尽可能的缩小应用范围
                            </FormDescription>
                            <FormControl>
                                <Input className={''} placeholder="如 https://pagenote.com/author*" {...field} />
                            </FormControl>
                            <FormDescription>
                                * 为通配符
                            </FormDescription>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="template"
                    render={({field}) => (
                        <>
                            <FormItem>
                                <FormLabel>
                                    网址格式化规则
                                </FormLabel>
                                <FormDescription>
                                    将不同网址认定为同一个网址的规则。如
                                    https://pagenote.cn/author#line1?from=web
                                    https://pagenote.cn/author#line2?from=app
                                    经过格式化、忽略无关的URL参数后，处理为 https://pagenote.cn/author
                                </FormDescription>
                                <FormControl>
                                    <Textarea className={''} placeholder={`如：${demoTemplate}`} {...field} />
                                </FormControl>
                                <div>
                                    <FormDescription>
                                       <b className={'text-red-500'}>[]</b> 为变量占位符，支持以下几种类型：
                                    </FormDescription>
                                    <ul>
                                        <li>
                                            <FormDescription>
                                                1. [origin] 表示服务器主机地址，替换后如 <b>https://pagenote.cn</b>
                                            </FormDescription>
                                        </li>
                                        <li>
                                            <FormDescription>
                                                2. [pathname] 表示网址路径地址，替换后如 <b>/author</b>
                                            </FormDescription>
                                        </li>
                                        <li>
                                            <FormDescription>
                                                2. [hash] 表示网址路径hash地址，替换后如 <b>#line1</b>
                                            </FormDescription>
                                        </li>
                                        <li>
                                            <FormDescription>
                                                3. [search] 表示网址中的所有参数，替换后如 <b>?a=1&b=2</b>
                                            </FormDescription>
                                        </li>
                                        <li>
                                            <FormDescription>
                                                4. [searchParams.from] 表示单独获取参数名为 from 的变量值，替换后如   <b>web/app</b>
                                            </FormDescription>
                                        </li>
                                        <li>
                                            <FormDescription>
                                                5. [?:from,b,c] 表示保留URL中的参数白名单列表： from,b,c。替换结果如 <b>from=web&b=2&c=3</b>
                                            </FormDescription>
                                        </li>
                                    </ul>
                                </div>
                                <FormMessage/>
                            </FormItem>
                        </>
                    )}
                />

                {
                    props.children ? props.children :
                    <DialogFooter>
                        <Button loading={loading} type="submit">保存</Button>
                    </DialogFooter>
                }
            </form>
        </Form>
    );
}

