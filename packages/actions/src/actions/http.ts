export interface HttpRequest {
    url: string
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    headers?: {
        Accept?:  string,
        'content-type'?: string,
    } & Record<string, string>,
    body?: any, // 请求体，POST PUT 请求使用
    params?: Record<string, string>,
}

interface HttpResponse extends Response{
    /**基于场景的返回数据封装**/
    _response?: string | Blob | Object | any
    _status: number,
    /**返回的 headers 无法直接通过 key 值获取，故这里封装一下*/
    _headers: Record<string, string>,
}

function run(args: HttpRequest):Promise<HttpResponse> {
    const {headers,method='GET',url,body,params} = args;
    const requestContentType = headers?.['content-type'] || headers?.['Content-Type'] || '';
    const requestMethod = method.toUpperCase();

    /**POST 参数格式化 application/json 数据需要序列化 */
    const checkSendBody = ['POST','PUT'].includes(requestMethod);
    const isJSONrequest = requestContentType.includes('application/json');
    const requestBody = (isJSONrequest && typeof body === 'object') ? JSON.stringify(body) : body;

    /**GET 请求参数格式化*/
    const requestURL = new URL(url);
    if(params){
        for(let i in params){
            requestURL.searchParams.set(i,params[i])
        }
    } else if(requestMethod==='GET' && typeof body === 'object'){
        for(let i in body){
            requestURL.searchParams.set(i,body[i])
        }
    }

    return fetch(requestURL.toString(),{
        method: requestMethod,
        headers: headers,
        body: checkSendBody ? requestBody : undefined,
    }).then(async function (response) {
        // @ts-ignore
        const res: HttpResponse = response.clone();
        res._status = res.status;
        const contentType = res.headers.get('Content-Type') || res.headers.get('content-type') || '';
        if(/text|html/.test(contentType)){
            res._response = await res.text();
        } else if(/image/.test(contentType)){
            res._response = await res.blob()
        } else if(/json/.test(contentType)){
            res._response = await res.json()
        } else{
            res._response = res.body;
        }
        res._headers = {} as Record<string,string>;
        res.headers.forEach((value,key)=>{
            //@ts-ignore
            res._headers[key.toLowerCase()] = value;
        })

        return res;
    }).catch(function (reason) {
        console.error(args.url,'fetch error', reason)
        throw reason;
    })
}


export default run
