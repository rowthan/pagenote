import {BaseMessageRequest, CommunicationClient} from "./base";


/**
 * 粗略计算字符占用内存空间；
 * 以utf-8 编码为例，每个字符编码长度不定长，英文数字占用较少1字节；中文较多 取中间值粗略估算；
 * 估算结果在 实际大小的 1/n ~ 4/n 倍之间
 * */
export function sumSizeKB(input: string) {
    const sumByte = input.length * 2
    return sumByte / 1024;
}

export function sumSizeMB(input: string) {
    return sumSizeKB(input) / 1024
}

export function stringToBlob(input: string) {
    const blob = new Blob([input],{
        type: 'text/plain',
    })
    return blob
}

export function createURLForJSON(input: Object) {
    const blob = stringToBlob(JSON.stringify(input))
    const url = URL.createObjectURL(blob);
    return url;
}

/**
 * 检测是否要需要
 * 1. 处理当前接收到的请求
 * 2. 是否需要相应请求
 * */
export function shouldResolveRequest(request: BaseMessageRequest, client: CommunicationClient){
    const result = {
        resolveResponse: false,
        resolveRequest: false,
    }

    const {targetClientId} = request.header;
    const {clientId} = client;
    // 判断目标明确匹配
    const matched = Boolean(targetClientId) && targetClientId===clientId;

    if(targetClientId===null || matched){
        result.resolveRequest = true;
    }

    result.resolveResponse = matched;
    return result;
}
