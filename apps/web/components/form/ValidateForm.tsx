import {type ReactNode, useState} from 'react';
import useUserInfo from "../../hooks/useUserInfo";
import {useForm} from "react-hook-form";
import * as z from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {requestValidate} from "../../service/account";
import {toast} from "../../@/components/ui/use-toast";
import {Button} from "../../@/components/ui/button";
import {Form, FormControl, FormDescription, FormField, FormItem, FormMessage} from "../../@/components/ui/form";
import {Input} from "../../@/components/ui/input";

interface Props {
    children?: ReactNode;
    validateType: string;
    withTargetEmail: boolean
}

const FormSchema = z.object({
    validateText: z.string().min(4, {
        message: "最少4字符",
    }).max(8,{
        message: "最多8字符",
    }),
    publicText: z.string(),
    validateEmail: z.string(),
})

export default function ValidateForm(props: Props) {
    const {children,validateType,withTargetEmail} = props;
    const [loading, setLoading] = useState(false)
    const [userinfo] = useUserInfo()
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            validateText: '',
            publicText: '',
            validateEmail: ""
        }
    })
    const values = form.getValues()

    function requestValidateCode() {
        setLoading(true)
        form.clearErrors()
        requestValidate({
            publicText: validateType,
            validateType: validateType,
            uid: userinfo?.profile?.uid,
            email: values.validateEmail,
        }).then(function (res) {
            form.setValue('publicText', res?.data?.requestValidate?.publicText || '')
            const validateEmailSend = res?.data?.requestValidate?.validateEmail || ''
            if(validateEmailSend){
                form.setValue('validateEmail',validateEmailSend)
            }
            setLoading(false)
            if(res?.error){
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
    }

    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className=" space-y-6">
                    {
                        withTargetEmail &&
                        <FormField
                            control={form.control}
                            name="validateEmail"
                            render={({field}) => (
                                <FormItem>
                                    <FormControl>
                                        <Input className={''} placeholder="邮箱地址" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                    <FormDescription>
                                        {
                                            values.publicText ? `验证码已发送至你邮箱 ${values.validateEmail}` : ''
                                        }
                                    </FormDescription>
                                </FormItem>
                            )}
                        />
                    }
                    <Button loading={loading} disabled={loading} onClick={requestValidateCode} >请求</Button>
                    {
                        values.publicText &&
                        <FormField
                            control={form.control}
                            name="validateText"
                            render={({field}) => (
                                <FormItem>
                                    <FormControl>
                                        <div className={'flex justify-between'}>
                                            <Input className={'w-4/5'} placeholder="请输入验证码" {...field} />
                                            <Button loading={loading} disabled={loading} variant="destructive" type={'submit'}>提交</Button>
                                        </div>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    }

                    {children}
                </form>
            </Form>


        </>
    );
}

ValidateForm.defaultProps = {}
