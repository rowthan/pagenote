import {type ReactNode, useState} from 'react';
import {useForm} from "react-hook-form";
import * as z from "zod";
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '../../@/components/ui/input'
import {Button} from "../../@/components/ui/button";
import {AuthInfo} from "hooks/useAuthList";
import {requestValidate, unBindAuth} from "../../service/account";
import useUserInfo from "hooks/useUserInfo";
import {toast} from "../../@/components/ui/use-toast";

interface Props {
    children?: ReactNode;
    auth: AuthInfo
    onFinished: ()=>void
}


const FormSchema = z.object({
    validateText: z.string().min(4, {
        message: "最少4字符",
    }).max(8,{
        message: "最多8字符",
    }),
    publicText: z.string(),
})

export default function UnbindForm(props: Props) {
    const {auth, onFinished} = props;
    const [loading, setLoading] = useState(false)
    const [userinfo] = useUserInfo()
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            validateText: '',
            publicText: '',
        }
    })

    function requestValidateCode() {
        setLoading(true)
        form.clearErrors()
        requestValidate({
            publicText: auth.authId,
            validateType: 'unbind',
            uid: userinfo?.profile?.uid,
        }).then(function (res) {
            form.setValue('publicText', res?.data?.requestValidate?.publicText || '')
            setLoading(false)
            if (res?.error) {
                toast({
                    variant: 'destructive',
                    title: '请求失败',
                    description: res.error
                })
            }
        })
    }


    function onSubmit(data: z.infer<typeof FormSchema>) {
        setLoading(true)
        const unbindForm = {
            ...data,
            authId: auth.authId,
            authType: auth.authType,
        }

        unBindAuth(unbindForm).then(function (res) {
            if (!res) {
                form.setError('validateText', {
                    message: '请求超时，请重试'
                })
                return;
            }
            if (res?.error) {
                form.setError('validateText', {
                    message: res?.error?.toString()
                })
            } else if (res?.data?.unBindAuth?.success) {
                toast({
                    title: "已成功取消绑定",
                    description: '第三方账号信息已从 PAGENOTE 删除'
                })
                onFinished()
            }
        }).finally(function () {
            setLoading(false)
        })
    }

    const values = form.getValues()

    return (
        <>
            <Button loading={loading} disabled={loading} type={'button'} onClick={requestValidateCode}>
                {
                    values.publicText ? `验证码已发送至你邮箱，请查收。点击重新请求` : '请求验证码'
                }
            </Button>
            {
                values.publicText &&
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className=" space-y-6">
                        <FormField
                            control={form.control}
                            name="validateText"
                            render={({field}) => (
                                <FormItem>
                                    <FormControl>
                                        <div className={'flex justify-between'}>
                                            <Input className={'w-4/5'} placeholder="删除账号关联，请输入验证码" {...field} />
                                            <Button loading={loading} disabled={loading} variant="destructive" type={'submit'}>提交</Button>
                                        </div>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </form>
                </Form>
            }
        </>
    );
}

UnbindForm.defaultProps = {}
