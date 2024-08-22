import React, {type ReactNode, useEffect, useState} from 'react';
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "../../@/components/ui/form";
import {Input} from "../../@/components/ui/input";
import {DialogFooter} from "../../@/components/ui/dialog";
import {Button} from "../../@/components/ui/button";
import {useForm} from "react-hook-form";
import * as z from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import useSettingConfig from "../../hooks/table/useSettingConfig";
import { Textarea } from "@/components/ui/textarea"

interface Props {
    children?: ReactNode;
    afterSubmit?: () => void
}
const FormSchema = z.object({
    customCss: z.string().optional(),
})

const defaultCss = `
developer.pagenote.cn/*   pagenote.cn/[path] // 表示将 developer.pagenote.cn 域名当作 pagenote.cn
https://pagenote.cn/* [host]/[path] // 表示所有 pagenote.cn 的网页，只保留【域名 + 路径】作为URL标识，忽略URL的参数
https://baidu.com/s* baidu.com/s?
`

export default function CustomLinkForm(props: Props) {
    const {afterSubmit} = props;
    const [loading,setLoading] = useState(false)
    const [config,update] = useSettingConfig<z.infer<typeof FormSchema>>('sdk','config')
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            customCss: defaultCss
        }
    })

    useEffect(() => {
        form.reset(config || {})
    }, [config]);

    function onSubmit(data:z.infer<typeof FormSchema>) {
        setLoading(true)
        update(data).then(function () {
            setLoading(false)
            afterSubmit && afterSubmit();
        })
    }

    function reset() {
        update({
            customCss: defaultCss
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className=" space-y-6">
                <FormField
                    control={form.control}
                    name="customCss"
                    render={({field}) => (
                        <FormItem onChange={form.handleSubmit(onSubmit)}>
                            <FormControl>
                                <Textarea rows={26} placeholder="相同网页判定规则" {...field} />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <DialogFooter>
                    <Button loading={loading}
                            variant={'ghost'}

                            onClick={reset}
                            type="button">重置</Button>
                </DialogFooter>
            </form>
        </Form>
    );
}

