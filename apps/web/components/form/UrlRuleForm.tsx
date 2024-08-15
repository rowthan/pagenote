import React, {type ReactNode, useState} from 'react';
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {DialogFooter} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {useForm} from "react-hook-form";
import * as z from "zod";
import {zodResolver} from "@hookform/resolvers/zod";

interface Props {
    children?: ReactNode;
    onSubmitClick: (data: any) => void
}
const FormSchema = z.object({
    baseUrl: z.string().min(1,{
        message:'请输入适用链接范围'
    }),
    queries: z.string().min(1,{
        message:'请输入网址特征参数，例如：id,name,title'
    }),
})

export default function UrlRuleForm(props: Props) {
    const {onSubmitClick} = props;
    const [loading,setLoading] = useState(false)
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            baseUrl:  '',
            queries: ''
        }
    })


    function onSubmit(data:z.infer<typeof FormSchema>) {
        onSubmitClick(data)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className=" space-y-6">
                <FormField
                    control={form.control}
                    name="baseUrl"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>
                                适用网址
                            </FormLabel>
                            <FormControl>
                                <Input className={''} placeholder="如 https://baidu.com/s" {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="queries"
                    render={({field}) => (
                        <>
                            <FormItem>
                                <FormLabel>
                                    区分网页参数名
                                </FormLabel>
                                <FormControl>
                                    <Input className={''} placeholder="如 kw,title" {...field} />
                                </FormControl>
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

