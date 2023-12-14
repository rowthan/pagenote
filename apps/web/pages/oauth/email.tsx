import {type ReactNode, useEffect} from 'react';
import BasicLayout from "../../layouts/BasicLayout";
import SignForm from "../../components/account/sign/SignForm";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "../../@/components/ui/card";
import useUserInfo from "../../hooks/useUserInfo";
import Link from "next/link";

interface Props {
    children?: ReactNode;
}

export default function Email(props: Props) {
    const [user] = useUserInfo()

    function onFinished() {
        window.location.href = '/account'
    }

    return (
        <BasicLayout
            nav={false}
            title={'登录 PAGENOTE- 邮箱验证'}
            description={'登录 PAGENOTE 账号'}
        >
            <Card className={'bg-card p-4 m-auto mt-10 max-w-[400px]'}>
                <CardHeader>
                    <CardTitle>添加邮箱登录授权</CardTitle>
                    <CardDescription>多个邮箱可以关联同一个 PAGENOTE 账号</CardDescription>
                </CardHeader>
                <CardContent>
                    {
                        user ?
                            <SignForm onFinished={onFinished} validateType={'bindEmail'}/>
                            : <div>请先 <Link className={'underline'} href="/signin">登录后</Link> 添加邮箱管理</div>
                    }
                </CardContent>
            </Card>
        </BasicLayout>
    );
}

Email.defaultProps = {}
