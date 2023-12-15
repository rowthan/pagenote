import {setting} from "@pagenote/shared/lib/extApi";
import ISearchEngine = setting.ISearchEngine;
export function getSearchKeyFormUrl(url='',engines: ISearchEngine[]): string {
    if(!url){
        return ''
    }
    const searchEngine = engines.find(function (item) {
        return item.checkRules.some(function (rule) {
            return new RegExp(rule).test(url)
        })
    })
    if(searchEngine){
        const searchUrl = new URL(url);
        return searchUrl.searchParams.get(searchEngine.queryKey || '') || ''
    }
    return ''
}
