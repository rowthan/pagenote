import {type ReactNode, useEffect} from 'react';
import BasicSettingLine, {SettingSection} from "../setting/BasicSettingLine";
import { HiCheckCircle } from "react-icons/hi";
import { PiProhibitFill } from "react-icons/pi";
import useWhoAmi from "hooks/useWhoAmi";
import usePermissions from "hooks/usePermissions";

interface Props {
    children?: ReactNode;
}

const permissionList = [
    {
        name: '【必须】访问所有网站',
        description: '在所有网页上运行工作的必要权限',
        namespace: 'origins',
        permission: '<all_urls>',
    },
    {
        name: '【可选】标签页分组管理',
        description: '可以对网页进行归组管理',
        permission: 'tabGroups',
        namespace: 'permissions',
        supportPlatform: ['chrome','edge','offline']
    }
]

export default function PermissionList(props: Props) {
    const {children} = props;
    const [permission,requestPermission] = usePermissions();
    const [whoAmI] = useWhoAmi()
    return (
        <div className="">
            <div className="mx-auto space-y-6">
                <SettingSection>
                    {
                        permissionList.map((item)=> {
                            const show = !item.supportPlatform || item.supportPlatform.includes(whoAmI?.extensionPlatform||"chrome");
                            if(!show){
                                return null;
                            }
                            //@ts-ignore
                            const hasPerm = permission[item.namespace]?.includes(item.permission);
                            return (
                                <BasicSettingLine
                                    onClick={()=>{
                                        console.log('request');
                                        if(hasPerm){
                                            return
                                        }
                                        requestPermission({
                                            [item.namespace]: [item.permission]
                                        })
                                    }}
                                    key={item.name}
                                    subLabel={item.description}
                                    right={
                                        <div>
                                            {
                                                hasPerm ?
                                                    <HiCheckCircle className={'text-green-500 text-xl'}/>
                                                    : <div>
                                                        <span className={'text-xs'}>缺少权限，点击申请</span>  <PiProhibitFill className={'inline-block text-red-500 text-xl'}/>
                                                    </div>
                                            }
                                        </div>
                                    }
                                    label={item.name}>
                                </BasicSettingLine>
                            )
                        })
                    }
                </SettingSection>

                {/*{*/}
                {/*    hasAllurlPermission ?*/}
                {/*        <div>*/}
                {/*            <Alert>*/}
                {/*                <CheckIcon className="h-4 w-4"/>*/}
                {/*                <AlertTitle>已拥有必要的权限</AlertTitle>*/}
                {/*                <AlertDescription>*/}
                {/*                    申请完成后，请刷新网页或重启浏览器即可。*/}
                {/*                </AlertDescription>*/}
                {/*            </Alert>*/}
                {/*        </div> :*/}
                {/*        <div className="space-y-2 text-center mt-10 mb-10">*/}
                {/*            <h1 className="text-3xl font-bold">权限申请</h1>*/}

                {/*            <div className={'space-y-4'}>*/}
                {/*                <p className="text-gray-500 dark:text-gray-400">*/}
                {/*                    PAGENOTE 运行中缺少以下必要的权限。*/}
                {/*                </p>*/}
                {/*                <ul className={' text-foreground'}>*/}
                {/*                    <li><b>（all_urls）</b>允许 PAGENOTE 在所有网页内运行</li>*/}
                {/*                </ul>*/}
                {/*            </div>*/}
                {/*        </div>*/}
                {/*}*/}
                {/*<div className="space-y-4">*/}
                {/*    <Button disabled={hasAllurlPermission} className="w-full" onClick={requestPermission}>*/}
                {/*        {*/}
                {/*            hasAllurlPermission ? '已完成' : '申请权限'*/}
                {/*        }*/}
                {/*    </Button>*/}
                {/*</div>*/}
            </div>
            {children}
        </div>
    );
}

