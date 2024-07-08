// 制定获取 notion 数据源的接口；默认请求自身服务。
import {NotionDocProp} from "../../components/notion/NotionDoc";
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
