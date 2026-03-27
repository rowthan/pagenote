import React, {type ReactNode} from 'react';
import NotionContent from "../components/notion/NotionContent";
import { getNotionDocDetail } from 'service/server/doc';
import { NotionDocProp } from 'components/notion/NotionDoc';
import Plans, { type RightsConfig } from "../components/pro/Plans";
import BasicLayout from "../layouts/BasicLayout";

const NOTION_DOC_ID = '/pro-plan/tips'

const FALLBACK_CONFIG: RightsConfig = {
    rights: [
        { label: "解锁所有功能", allowFor: [2], visibleFor: [2] },
    ],
    payments: [
        {
            id: "alipay",
            label: "支付宝",
            url: "https://pagenote-public.oss-cn-beijing.aliyuncs.com/_static/alipay.png",
        },
        {
            id: "wechat",
            label: "微信",
            url: "https://pagenote-public.oss-cn-beijing.aliyuncs.com/0000/wechat_pay.jpg?x-oss-process=style/q75",
        },
    ],
    types: [
        {
            title: "终身 VIP",
            description: "没有时限的 VIP 用户。",
            price: 125,
            duration: "终身",
            unit: "元",
            bg: "indigo",
            role: 2,
            deduct: true,
            final: true,
        },
    ],
}

export async function getServerSideProps() {
    const res = await getNotionDocDetail(NOTION_DOC_ID);
    const url = 'https://api.jsonbin.io/v3/b/69bb727ac3097a1dd53adeb9'
    let config: RightsConfig = FALLBACK_CONFIG
    try {
        const r = await fetch(url, { cache: 'no-store' as any })
        if (!r.ok) throw new Error(String(r.status))
        const json = await r.json()
        const record = (json && (json.record || json)) as RightsConfig
        if (record?.types?.length) config = record
    } catch (e) {
        console.error('fetch vip config error', e)
        config = FALLBACK_CONFIG
    }

    return {
        props: {
            doc: res.props,
            config
        },
    };
}

export default function expired1(props: {doc: NotionDocProp, config: RightsConfig}) {
    const { doc, config } = props

    return (
        <BasicLayout>
            <div className={'m-auto px-6 max-w-5xl py-14'}>
                <Plans config={config} />
            </div>
            {/*https://page-note.notion.site/da8bdda50ec344f488d7c84ba52faea5?pvs=4*/}
            <NotionContent
                docId={NOTION_DOC_ID}
                notionDoc={doc}
            />
        </BasicLayout>
    );
}
