enum CACHE_TYPE {
    localstorage = "localstorage",
    sessionStorage = 'sessionStorage',
    // indexedDB = 'indexedDB',
}

function parseValue<T>(data: string): T {
    let result;
    try {
        result = JSON.parse(data);
    } catch (e) {

    }
    return result;
}

function getCacheKey(key: string,prefix:string) {
    return `${prefix}${key}`
}

function getExpiredKey(key: string,prefix:string) {
    return `${prefix}${key}__expired`
}

interface Option<T> {
    type?: CACHE_TYPE,
    duration?: number,
    defaultValue?: T,
    prefix?: string
}

function selectApi(type: CACHE_TYPE): Storage {
    let Api: Storage;
    switch (type) {
        case CACHE_TYPE.sessionStorage:
            Api = window.sessionStorage;
            break;
        // case CACHE_TYPE.indexedDB:
        //     // TODO
        //     break
        default:
            Api = window.localStorage;
    }
    return Api
}

const getCacheInstance = function <T>(key: string, option: Option<T> = {}, api?: Storage) {
    const {type = CACHE_TYPE.localstorage, duration = 3600 * 1000 * 24 * 30, prefix='__c_'} = option;

    function getApi() {
        return api || selectApi(type);
    }

    const expiredKey = getExpiredKey(key,prefix);
    const cacheKey = getCacheKey(key,prefix);

    return {
        set: function (value: T) {
            try {
                if (duration) {
                    getApi().setItem(expiredKey, JSON.stringify(Date.now() + duration));
                } else {
                    getApi().setItem(cacheKey, JSON.stringify(value));
                }
            } catch (e) {

            }
        },
        get: function (defaultValue?: T): T {
            const expiredAtStr = getApi().getItem(expiredKey);
            // @ts-ignore todo
            const expiredAt = parseValue<number>(expiredAtStr);
            if (duration && expiredAt && expiredAt < Date.now()) {
                // @ts-ignore todo
                return undefined
            }
            const str = getApi().getItem(cacheKey);
            // @ts-ignore todo
            let value: T = parseValue(str);
            if (value === undefined || value === null) {
                // @ts-ignore todo
                value = defaultValue || option.defaultValue
            }
            return value;
        },
        subscribe(onchange: (newValue: T, oldValue: any) => void): () => void {
            const that = this;
            if (type === CACHE_TYPE.sessionStorage || type === CACHE_TYPE.localstorage) {
                const listener = function (e: StorageEvent) {
                    if (e.key === key) {
                        onchange(that.get(), e.oldValue)
                    }
                }
                window.addEventListener('storage', listener);
                return function () {
                    window.removeEventListener('storage', listener)
                }
            }else {
                throw Error('un support subscribe')
            }
        }
    }
}


export default getCacheInstance;

export {
    CACHE_TYPE,
}
