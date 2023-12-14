import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import * as z from "zod"
import {Button} from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {Input} from "@/components/ui/input"
import {useToast} from "@/components/ui/use-toast"
import {useState} from "react";
import {updateProfile} from "../../service";
import useUserInfo, {fetchUserInfo} from "../../hooks/useUserInfo";

const FormSchema = z.object({
    nickname: z.string().min(2, {
        message: "最少两个字符",
    }),
})

export function ProfileEditor(props:{close:()=>void}) {
    const [user, refresh] = useUserInfo()
    const {toast} = useToast()
    const [loading, setLoading] = useState(false)

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            nickname: user?.profile.nickname
        }
    })

    function onSubmit(data: z.infer<typeof FormSchema>) {
        setLoading(true)
        updateProfile({
            nickname: data.nickname,
        })
            .then(function (result) {
                fetchUserInfo(true).then(function () {
                    refresh()
                })
                setLoading(false)
                console.log(result, '更新结果')
                const title = result?.error || '已提交更新请求'
                if (result?.success) {
                    props.close();
                }
                toast({
                    title: title,
                    duration: 2000,
                })
            })

    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className=" space-y-6">
                <FormField
                    control={form.control}
                    name="nickname"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>昵称</FormLabel>
                            <FormControl>
                                <Input placeholder="用户名" {...field} />
                            </FormControl>
                            <FormDescription>

                            </FormDescription>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <Button type="submit" disabled={loading} loading={loading}>
                    更新
                </Button>
            </form>
        </Form>
    )
}
