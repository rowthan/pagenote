// 制定获取 notion 数据源的接口；默认请求自身服务。
import {NotionDocProp} from "../../components/notion/NotionDoc";
import {PlanInfo} from "../../typing";

type RightsConfig = {
    rights?: {
        label: string
        disAllowLabel?: string
        allowFor?: number[]
        visibleFor?: number[]
    }[]
    payments?: { id: string, label: string, url: string }[]
    types?: {
        title: string
        description: string
        price: number
        duration: string
        unit?: string
        bg: string
        role: number
        deduct: boolean
        final?: boolean
    }[]
}

function buildPlansFromRights(cfg: RightsConfig): PlanInfo[] {
    const rights = cfg?.rights || []
    const payments = cfg?.payments || []
    const types = cfg?.types || []

    return (types as any[]).map((t) => {
        const role = Number(t?.role ?? 0)
        const planRights = (rights as any[])
            .filter((r) => Array.isArray(r?.visibleFor) && r.visibleFor.includes(role))

        const unit = t?.unit
        const final = t?.final
        return {
            title: t?.title,
            description: t?.description,
            price: Number(t?.price ?? 0),
            duration: t?.duration,
            bg: t?.bg,
            role,
            deduct: Boolean(t?.deduct),
            ...(unit ? { unit } : {}),
            ...(final ? { final: true } : {}),
            rights: planRights,
            payments: payments as any,
        } satisfies PlanInfo
    })
}


export async function getNotionDetailFromServer(id: string): Promise<NotionDocProp | undefined> {
    try {
        const result = await (await fetch(`/api/doc?id=${id}`)).json();
        return result;
    } catch (e) {
        console.error('fetch doc detail error',e)
    }
}


export async function getPlansFromServer(): Promise<PlanInfo[]> {
    const url = 'https://api.jsonbin.io/v3/b/69bb727ac3097a1dd53adeb9'
    try {
        const res = await fetch(url, { cache: 'no-store' as any })
        if (!res.ok) {
            throw new Error(`fetch jsonbin failed: ${res.status}`)
        }
        const json = await res.json()
        const record = (json && (json.record || json)) as RightsConfig
        const plans = buildPlansFromRights(record)
        if (plans?.length) return plans
        return []
    } catch (e) {
        console.error('getPlansFromServer error', e)
        return []
    }
}
