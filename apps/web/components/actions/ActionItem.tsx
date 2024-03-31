import React, {FC, PropsWithChildren, useEffect} from "react";
import {WorkFlow} from "@pagenote/actions/dist/typing";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Button} from "@/components/ui/button";

interface Props {
    css?: string
    className?: string
    workflow: WorkFlow
}

const Component: FC<PropsWithChildren<Props>> = (props) => {
    const {children,workflow} = props;

    useEffect(() => {

    }, [])

    return (
        <div className={'p-3 max-w-full m-auto flex border-card border rounded'}>
            <div className={'w-1/2 shrink-0 flex'}>
                <Avatar>
                    <AvatarImage src={workflow?.icon} />
                    <AvatarFallback>{workflow.name}</AvatarFallback>
                </Avatar>
                <div className={'mx-2'}>
                    <h3>{workflow.name}</h3>
                    <div className={'text-xs text-muted-foreground max-w-1/3 line-clamp-2'}>
                        {workflow?.description}
                    </div>
                </div>
            </div>
            <div>
                <Button>配置</Button>
            </div>
        </div>
    );
}
export default Component
