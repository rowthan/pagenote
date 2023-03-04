import {config} from "../extApi";
import ConfigObject = config.ConfigObject;
import {get, set} from "lodash";

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
export function objectToConfigArray(config: Record<string, string>): Omit<ConfigObject, "deleted"|"updateAt">[] {
    const keys = getDeepKeys(config);
    return keys.map(function (key) {
        return {
            key: key,
            value: get(config,key)
        }
    })
}

export function configArrayToObject(inputs: Omit<ConfigObject, "deleted"|"updateAt">[]): Record<string, string> {
    const object = {};
    inputs.forEach(function (item) {
        set(object,item.key,item.value)
    })
    return object;
}
