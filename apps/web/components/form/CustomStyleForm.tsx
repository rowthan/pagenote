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
/**画笔按钮位置偏移设置，应用场景：避免和其他插件的划词按钮重叠冲突*/ 
pagenote-action>pagenote-block{
    /**修改下方数值即可*/ 
    transform: translate(1px, 2px); /**作用：向右偏移1像素，向下偏移2像素。*/ 
}

/**侧边栏样式*/
pagenote-bar{
  display:block; /**block,显示；none,隐藏。*/
}
`

export default function CustomStyleForm(props: Props) {
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
                                <Textarea rows={26} placeholder="CSS 语法" {...field} />
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

