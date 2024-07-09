// 制定获取 notion 数据源的接口；默认请求自身服务。
import {NotionDocProp} from "../../components/notion/NotionDoc";
import {PlanInfo} from "../../typing";
export const WEB_HOST = process.env.NODE_ENV === 'development'
    ? "http://localhost:3000"
    : ( process.env.WEB_HOST || "https://pagenote.cn");



export async function getNotionDetailFromServer(id: string): Promise<NotionDocProp | undefined> {
    try {
        const result = await (await fetch(`${WEB_HOST}/api/doc?id=${id}`)).json();
        return result;
    } catch (e) {
        console.error('fetch doc detail error',e)
    }
}


export async function getPlansFromServer(): Promise<PlanInfo[]> {
    const data = await fetch(
        `${process.env.API_HOST}/api/graph/book?query=query{plans{dataJson}}`,
        {
            headers: {
                'x-pagenote-priority': '1.1'
            }
        }
    ).then(async function (response) {
        const res = await response.json()
        const dataJson = res.data?.plans?.dataJson
        if (dataJson) {
            const plans: PlanInfo[] = JSON.parse(dataJson)
            return plans
        }
    }).catch(function () {
        return [{
            title: '终身VIP',
            description: '没有时限的VIP用户。',
            price: 125,
            duration: '终身',
            unit: '元(累计)',
            bg: 'indigo',
            role: 2,
            deduct: true,
            final: true,
            rights: [{
                label: '解锁所有功能',
            }],
            payments: [{
                id: 'alipay',
                label: '支付宝',
                url: "https://pagenote-public.oss-cn-beijing.aliyuncs.com/_static/alipay.png",
            },{
                id:'wechat',
                label: '微信',
                url: "https://pagenote-public.oss-cn-beijing.aliyuncs.com/0000/wechat_pay.jpg?x-oss-process=style/q75",
            }]
        },]
    })
    return data || [];
}
