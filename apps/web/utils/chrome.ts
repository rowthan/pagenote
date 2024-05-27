import extApi from "@pagenote/shared/lib/pagenote-api";


export function callChrome<T>(arg:{namespace: string, method: string, arguments: any[]}):Promise<T> {
    //@ts-ignore
    if(chrome && chrome[arg.namespace]){
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
