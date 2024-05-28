import BasicSettingLine, { SettingSection } from "components/setting/BasicSettingLine"
import useWhoAmi from "hooks/useWhoAmi"
import React from "react";
import useUserInfo from "hooks/useUserInfo";
import useAuthList from "../../../hooks/useAuthList";
import Avatar from "../Avatar";
import SettingDetail from "../../setting/SettingDetail";
import {Route, Routes} from "react-router-dom";
import CloudBackup from "../../backup/CloudBackup";
import AuthList from "../AuthList";
import BookList from "../BookList";
import useBooks from "../../../hooks/useBooks";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import { RiAlarmWarningFill } from "react-icons/ri";
import {Button} from "../../../@/components/ui/button";
import {openUrlInGroup} from "../../../utils/url";

export function IdRoutes(props:{rootPath: string}){
    const {rootPath} = props;
    const [ userInfo ] = useUserInfo();


    if(!userInfo){
        return(
            <SettingDetail label={'无法访问'}>
                <Alert>
                    <RiAlarmWarningFill fill={'red'} />
                    <AlertTitle >
                        <b>无法访问</b>
                    </AlertTitle>
                    <AlertDescription>
                        你尚未登录 PAGENOTE 账号。
                        <br/>
                        当前处于脱机模式，无法启用部分功能。
                        但这并不影响你使用 PAGENOTE 基础标记功能。
                        <div className={'flex justify-center mt-4'}>
                            <a className={'a'} href={'https://pagenote.cn/signin?group=PAGENOTE&reuse=1'}>登录后查看</a>
                        </div>
                    </AlertDescription>
                </Alert>
            </SettingDetail>
        )
    }

    return(
        <Routes>
            <Route path="/" element={<IdIndex basePath={rootPath}/>}/>
            <Route path="/third-part" element={
                <SettingDetail label={'第三方授权'}>
                    <AuthList/>
                </SettingDetail>
            }/>
            <Route path="/vip-record" element={
                <SettingDetail label={'赞助记录'}>
                    <BookList/>
                </SettingDetail>
            }/>
            <Route path="/*" element={<IdIndex basePath={rootPath}/>}/>
        </Routes>
    )
}

function IdIndex(props:{basePath: string}){
    const [userInfo, mutate, setToken] = useUserInfo()
    const [whoAmI] = useWhoAmi()
    const { data: authList = [] } = useAuthList()
    const [bookInfo] = useBooks()

    const { basePath='' } = props;

    return(
        <>
            <div className={'flex flex-col justify-center mb-10'}>
                <div className={'m-auto w-20 h-20'}>
                    <Avatar/>
                </div>
                <div className={'text-center'}>
                    <div className={'text-accent-foreground'}>
                        {userInfo?.profile.nickname}
                    </div>
                    <div className={'text-muted-foreground text-xs'}>
                        {whoAmI?.did}
                    </div>
                </div>
            </div>
            <SettingSection>
                <BasicSettingLine label={'关联账号'} path={basePath+'/third-part'}
                                  right={authList?.length ? <span className={'text-xs text-muted-foreground'}>
                        已关联 {authList.length} 个账号
                        </span> : ''}/>
                {/*<BasicSettingLine label={'云备份'} path={basePath+'/cloud-backup'}/>*/}

            </SettingSection>

            <SettingSection className={'my-4'}>
                <BasicSettingLine
                    label={'赞助记录'}
                    right={bookInfo.expiredTip}
                    path={(userInfo?.profile?.role || 0) > 2 ? basePath+'/vip-record': 'https://pagenote.cn/pro-plan'}/>
            </SettingSection>
        </>
    )
}

export default function IdHome(props:{basePath: string}) {
    const { basePath='' } = props;

    return (
        <>
            <IdRoutes rootPath={basePath} />
        </>
    )
}
