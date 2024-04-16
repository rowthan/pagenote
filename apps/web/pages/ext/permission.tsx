import {type ReactNode} from 'react';
import RedirectToExt from "../../components/RedirectToExt";
import usePermissions from "../../hooks/usePermissions";
import ExtLayout from "../../layouts/ExtLayout";
import { Button } from "@/components/ui/button"
import { AlertTitle, AlertDescription, Alert } from "@/components/ui/alert"
import {CheckIcon} from "@radix-ui/react-icons";
interface Props {
    children?: ReactNode;
}

export default function Permission() {
    const [permission,requestPermission] = usePermissions();
    const hasAllurlPermission = permission?.origins?.includes('<all_urls>');
    return (
        <RedirectToExt>
            <ExtLayout>
                <div className="mx-auto max-w-sm space-y-6 py-10">
                    {
                        hasAllurlPermission ?
                        <div>
                            <Alert>
                                <CheckIcon className="h-4 w-4" />
                                <AlertTitle>已拥有必要的权限</AlertTitle>
                                <AlertDescription>
                                    申请完成后，请刷新网页或重启浏览器即可。
                                </AlertDescription>
                            </Alert>
                        </div>:
                        <div className="space-y-2 text-center mt-10 mb-10">
                            <h1 className="text-3xl font-bold">权限申请</h1>

                            <div className={'space-y-4'}>
                                <p className="text-gray-500 dark:text-gray-400">
                                    PAGENOTE 运行中缺少以下必要的权限。
                                </p>
                                <ul className={' text-foreground'}>
                                    <li><b>（all_urls）</b>允许 PAGENOTE 在所有网页内运行</li>
                                </ul>
                            </div>
                        </div>
                    }
                    <div className="space-y-4">
                        <Button disabled={hasAllurlPermission} className="w-full" onClick={requestPermission}>
                            {
                                hasAllurlPermission ? '已完成' : '申请权限'
                            }
                        </Button>
                    </div>
                </div>
            </ExtLayout>
        </RedirectToExt>
    );
}

