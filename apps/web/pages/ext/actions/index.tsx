import React, {FC, PropsWithChildren, useEffect} from "react";
import jsYaml from 'js-yaml';
import {WorkFlow} from "@pagenote/actions/dist/typing";
import ActionItem from "components/actions/ActionItem";
interface Props {
    css?: string
    className?: string
    workflowList: WorkFlow[]
}

const actions = [
    'https://api-test.pagenote.cn/sync_setting_by_obsidian.yml'
]

export async function getStaticProps(): Promise<any> {
    const workflowList:WorkFlow[] = []
    for (let i=0; i<actions.length; i++) {
        const link = actions[i];
        console.log(link,'link')
        const yml = await fetch(link).then(res => {
            return res.text();
        })
        try{
            workflowList.push(jsYaml.load(yml) as WorkFlow)
        }catch (e) {

        }
    }
    return {
        props:{
            workflowList: workflowList
        }
    }
}

const Component: FC<PropsWithChildren<Props>> = (props) => {
    const {children,workflowList=[]} = props;

    useEffect(() => {

    }, [])

    return (
        <div className="max-w-5xl m-auto">
            {
                workflowList.map((workflow)=>(
                    <ActionItem workflow={workflow} key={workflow.id}></ActionItem>
                ))
            }
        </div>
    );
}
export default Component
