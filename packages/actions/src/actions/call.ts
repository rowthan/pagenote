import lodash, {keys} from 'lodash';

const libs = {
    lodash: lodash,
}

// @deprecated 删除此 actions。使用 表达式运算
export default function run(args: { method: string, lib: string |  object, arguments?: any[] }) {
    const {method,lib} = args;
    // @ts-ignore
    let library = libs[lib] || lib; // 没有指定 lib 的情况下，lib 自身可能是一个对象，直接调用 lib 自身。
    const leftArgs = lodash.omit(args,['method','arguments','lib']);
    // 无参数时，参数空数组
    const inputArgs = args.arguments|| (keys(leftArgs).length === 0 ? []:[leftArgs]);
    if(typeof library==='string'){
        // @ts-ignore
        library = globalThis[library] || library;
    }
    if(method){
        return library[method](...inputArgs)
    }
    return library(...inputArgs)
}
