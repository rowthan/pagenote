import extApi from "@pagenote/shared/lib/pagenote-api";

export function checkInExtensionContext(){
    return typeof chrome !== 'undefined' && chrome && chrome.runtime
}

export function callChrome<T>(arg:{namespace: string, method: string, arguments: any[]}):Promise<T> {
    //@ts-ignore
    if(checkInExtensionContext() && chrome[arg.namespace]){
        //@ts-ignore
        return chrome[arg.namespace][arg.method](...arg.arguments).then(function(res){
            return res
        })
    }else{
        return extApi.developer
            .chrome(arg)
            .then(function (res) {
                return res.data as T;
            })
    }
}
