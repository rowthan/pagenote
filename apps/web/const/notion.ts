export const DEFAULT_BASE_DOC_PATH =  'doc';


export const SEO_MAP: Record<string, string> = {
    '9ba20cf8-0ca1-4551-a93e-ca35f1064077': '/sitemap',
    'cfd9af87-0210-4934-9e04-20bc708c4206': '/',
    '3fdf1250-b41a-4e39-a387-4948be959ecd': '/404'
}

export const SEO_REVERT_MAP: Record<string, string> = {}

for(let i in SEO_MAP){
    SEO_REVERT_MAP[SEO_MAP[i]] = i;
}
