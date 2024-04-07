import lodash from 'lodash';
import dayjs from 'dayjs';

const libs = {
    dayjs: dayjs,
    lodash: lodash,
}

export default function run(args: { method: string, lib: string |  object, arguments?: any[] }) {
    const {method,lib} = args;
    // @ts-ignore
    let library = libs[lib] || lib; // 没有指定 lib 的情况下，lib 自身可能是一个对象，直接调用 lib 自身。
    if(typeof library==='string'){
        // @ts-ignore
        library = globalThis[library] || library;
    }
    const leftArgs = lodash.omit(args,['method','arguments','lib']);
    const inputArgs = args.arguments|| [leftArgs];
    if(method){
        return library[method](...inputArgs)
    }
    return library(...inputArgs)
}
