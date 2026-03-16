export const DEFAULT_BASE_DOC_PATH =  'doc';


export const SEO_MAP: Record<string, string> = {
    '9ba20cf8-0ca1-4551-a93e-ca35f1064077': '/sitemap',
    'cfd9af87-0210-4934-9e04-20bc708c4206': '/',
}

export const databaseList = [
    'd093839d-1d66-4880-811c-bb060627dd5d',// 博文列表
    'd8423c93-e14c-4089-97c0-eaa23eda1d71',// 地图数据源
    // 'fd2ef32a46bb42a69711f826cb70a267', // 地图
    'ecf8941f-24bb-4f66-ab8b-38730bf7747b', // 发布历史
]

export const WRITER_ID = process.env.NOTION_WRITER || '7c55490e-52d4-4bf9-8b86-dc9b51162224'
export const SEO_REVERT_MAP: Record<string, string> = {}

for(let i in SEO_MAP){
    SEO_REVERT_MAP[SEO_MAP[i]] = i;
}
