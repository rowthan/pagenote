export type commonKeyValuePair = {
    key: string,
    value: any,
}

export function convertObjectToArray(input: Record<string, any>): commonKeyValuePair[] {
    const result = []
    for(let i in input){
        result.push({
            key: i,
            value: input[i]
        })
    }
    return result
}

export function convertArrayToObject(array: commonKeyValuePair[]): Record<string, any> {
    const result: Record<string, any> = {}
    for(let i=0; i< array.length; i++){
        const temp = array[i];
        result[temp.key] = temp.value
    }
    return result
}