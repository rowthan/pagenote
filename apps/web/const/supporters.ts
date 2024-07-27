

export type SupporterType = 'webdav '| 'oss' |string;

type Supporter = {
    type: SupporterType
    name: string
    path: string
    icon: string
    description: string
}

export const supporters:Supporter[] = [
    {
        type: 'webdav',
        name: 'WebDav',
        path: '/cloud/supporters/webdav',
        description: '数据保存至你自己的服务器。更安全',
        icon:"https://pagenote-public.oss-cn-beijing.aliyuncs.com/0000/webdav.jpeg"
    },
    {
        type: 'oss',
        name: "PAGENOTE 云",
        description: '由 PAGENOTE 提供服务。',
        icon: "https://pagenote.cn/images/light-48.png",
        path: 'https://pagenote.cn/docs/cloud'
    }
]

const map: Record<string, Supporter> = {};

supporters.forEach(function(item){
    map[item.type] = item;
})

export const supporterMap = map;
