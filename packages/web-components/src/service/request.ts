export function getWordInfo(word:string):Promise<{markdown: string}>{
    const HOST = 'https://api.pagenote.cn'
    return fetch(`${HOST}/api/graph/profile?`+ new URLSearchParams({
        query: `{keyword(keyword:"${word}"){markdown}}`
    })).then(async function(res){
        const data = await res.json();
        const keyword = data?.data?.keyword;
        if(keyword.json){
            keyword.json = JSON.parse(keyword.json)
        }
        return keyword;
    })
}
