import md5 from 'md5';
import {Step} from "../@types/data";


/**suffix 区分不同用户对同一个位置标记*/
export function createLightId(item: Step, suffix?: string) {
    return md5(`${item.url}${(item.wid || item.id)}${item.text}${suffix}`)
}


/**查找冗余的标记，防止重复记录*/
export function findMultiLights(items: Step[]): Step[] {
    const uniqueMap = new Map();
    const multiLights: Step[] = [];
    items.forEach(function (item: Step) {
        const id = createLightId(item);
        if(!uniqueMap.get(id)){
            uniqueMap.set(id,true)
        }else{
            multiLights.push(item)
        }

        uniqueMap.set(id,true)
    })
    return multiLights;
}
