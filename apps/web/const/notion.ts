export const DEFAULT_BASE_DOC_PATH =  'doc';


export const SEO_MAP: Record<string, string> = {
    '9ba20cf8-0ca1-4551-a93e-ca35f1064077': '/sitemap',
    'cfd9af87-0210-4934-9e04-20bc708c4206': '/',
}

export const databaseList = [
    'fd2ef32a46bb42a69711f826cb70a267', // 地图
    '5c0aa83127014f3791e9c66ce70687dc', // 发布历史
]
export const SEO_REVERT_MAP: Record<string, string> = {}

for(let i in SEO_MAP){
    SEO_REVERT_MAP[SEO_MAP[i]] = i;
}
