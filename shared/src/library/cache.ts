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

const getCacheInstance = function <T>(key:string,defaultValue:T,type:CACHE_TYPE=CACHE_TYPE.localstorage,duration:number=3600 * 1000 * 24 * 30) {
    function getApi():Storage {
        let Api:Storage = window.localStorage;
        switch (type){
            case CACHE_TYPE.sessionStorage:
                Api = window.sessionStorage;
                break;
            default:
                Api = window.localStorage;
        }
        return Api
    }

    return{
        set: function (value:T) {
            try{
                getApi().setItem(getCacheKey(key),JSON.stringify(value));
                if(duration){
                    getApi().setItem(getExpiredKey(key),JSON.stringify(Date.now() + duration));
                }
            }catch (e) {
                
            }
        },
        get: function ():T {
            const expiredAtStr = getApi().getItem(getExpiredKey(key));
            const expiredAt = parseValue<number>(expiredAtStr);
            if(duration && expiredAt && expiredAt < Date.now()){
                return undefined
            }
            const str = getApi().getItem(getCacheKey(key));
            let value:T = parseValue(str);
            if(value===undefined){
                value = defaultValue
            }
            return value;
        }
    }
}


export default getCacheInstance;

export {
    CACHE_TYPE,
}
