import {config} from "../extApi";
import ConfigObject = config.ConfigObject;
import get from "lodash/get";
import set from 'lodash/set';

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

type ConfigItem = Record<string, any>
export function objectToConfigArray(config: ConfigItem): Omit<ConfigObject, "deleted"|"updateAt">[] {
    const keys = getDeepKeys(config);
    return keys.map(function (key) {
        return {
            key: key,
            value: get(config,key)
        }
    })
}

export function configArrayToObject(inputs: Omit<ConfigObject, "deleted"|"updateAt">[]): ConfigItem {
    const object = {};
    inputs.forEach(function (item) {
        set(object,item.key,item.value)
    })
    return object;
}
