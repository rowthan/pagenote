enum CACHE_TYPE {
    localstorage = "localstorage",
    sessionStorage = 'sessionStorage',
}

function parseValue<T>(data:string):T{
    let result;
    try{
        result = JSON.parse(data);
    }catch (e) {

    }
    return result;
}

function getCacheKey(key:string) {
    return `__c_${key}`
}

function getExpiredKey(key:string) {
    return `__c_${key}__expired`
}

const getCacheInstance = function <T>(key:string,type:CACHE_TYPE=CACHE_TYPE.localstorage,duration:number=3600 * 1000 * 24 * 30) {
    let Api:Storage = localStorage;
    switch (type){
        case CACHE_TYPE.sessionStorage:
            Api = sessionStorage;
            break;
        default:
            Api = localStorage;
    }

    return{
        set: function (value:T) {
            try{
                Api.setItem(getCacheKey(key),JSON.stringify(value));
                if(duration){
                    Api.setItem(getExpiredKey(key),JSON.stringify(Date.now() + duration));
                }
            }catch (e) {
                
            }
        },
        get: function ():T {
            const expiredAtStr = Api.getItem(getExpiredKey(key));
            const expiredAt = parseValue<number>(expiredAtStr);
            if(duration && expiredAt && expiredAt < Date.now()){
                return
            }
            const str = Api.getItem(getCacheKey(key));
            return parseValue(str);
        }
    }
}


export default getCacheInstance;

export {
    CACHE_TYPE,
}
