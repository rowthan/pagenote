import React, {type ReactNode} from 'react';
import NotionContent from "../components/notion/NotionContent";
import { getNotionDocDetail } from 'service/server/doc';
import { NotionDocProp } from 'components/notion/NotionDoc';
import Plans from "../components/pro/Plans";
import {PlanInfo} from "../typing";
import {getPlansFromServer} from "../service/server/api";
import BasicLayout from "../layouts/BasicLayout";

interface Props {
    children?: ReactNode;
}
const NOTION_DOC_ID = '/pro-plan/tips'
// This function gets called at build time
export async function getStaticProps() {
    // Call an external API endpoint to get posts
    const res = await getNotionDocDetail(NOTION_DOC_ID);
    const plans = await getPlansFromServer();
    // By returning { props: { posts } }, the Blog component
    // will receive `posts` as a prop at build time
    return {
        props: {
            doc: res.props,
            plans: plans
        },
        revalidate: 60 * 60 * 4, // 单位 秒
    };
}

export default function expired1(props: {doc: NotionDocProp,plans: PlanInfo[]}) {
    const { plans,doc } = props

    return (
        <BasicLayout>
            <div className={'m-auto px-6 max-w-5xl py-14'}>
                <Plans plans={plans || []} />
            </div>
            {/*https://page-note.notion.site/da8bdda50ec344f488d7c84ba52faea5?pvs=4*/}
            <NotionContent
                docId={NOTION_DOC_ID}
                notionDoc={props.doc}
            />
        </BasicLayout>
    );
}
