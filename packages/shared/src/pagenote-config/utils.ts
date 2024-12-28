import {config} from "../extApi";
import ConfigObject = config.ConfigItem;
import ConfigItem = config.ConfigObject;
const get = require('lodash/get')
const set = require('lodash/set')

function getDeepKeys(obj: Record<string, any>, deep: number) {
    let keys: string[] = [];
    for(const key in obj) {
        // 限定取值的深度
        if(typeof obj[key] === "object" && deep > 0) {
            const subKeys = getDeepKeys(obj[key],deep - 1);
            keys = keys.concat(subKeys.map(function(subKey) {
                return key + "." + subKey;
            }));
        }else{
            keys.push(key);
        }
    }
    return keys;
}

export function objectToConfigArray(config: ConfigItem,deep: number): Pick<ConfigObject, "key"|"value"|"rootKey">[] {
    const keys = getDeepKeys(config, deep);
    return keys.map(function (key) {
        return {
            key: key,
            value: get(config,key),
            rootKey: key.split(".")[0]
        }
    })
}

export function configArrayToObject(inputs: Omit<ConfigObject, "deleted"|"updateAt">[]): ConfigItem {
    const object:ConfigItem = {};
    inputs.forEach(function (item) {
        set(object,item.key,item.value)
    })
    return object;
}
