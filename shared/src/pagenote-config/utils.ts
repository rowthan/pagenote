import {config} from "../extApi";
import ConfigObject = config.ConfigObject;
import ConfigItem = config.ConfigItem;
const get = require('lodash/get')
const set = require('lodash/set')

function getDeepKeys(obj: Record<string, any>) {
    let keys: string[] = [];
    for(const key in obj) {
        if(typeof obj[key] === "object") {
            const subkeys = getDeepKeys(obj[key]);
            keys = keys.concat(subkeys.map(function(subkey) {
                return key + "." + subkey;
            }));
        }else{
            keys.push(key);
        }
    }
    return keys;
}

export function objectToConfigArray(config: ConfigItem): Pick<ConfigObject, "key"|"value"|"rootKey">[] {
    const keys = getDeepKeys(config);
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
