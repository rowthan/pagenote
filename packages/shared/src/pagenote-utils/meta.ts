function resolveKey(key: string) {
    return key.indexOf('pagenote') > -1 ? key : `pagenote:${key}`;
}

export function getMetaElement(key: string) {
    const propertyKey = resolveKey(key);
    return document.querySelector(`meta[property="${propertyKey}"]`)
}
export function writeToMetaData(key: string, value?: string) {
    const propertyKey = resolveKey(key);
    let meta = getMetaElement(propertyKey)

    if (!value) {
        return meta;
    }
    if (meta) {
        meta.setAttribute('content', value);
    } else {
        meta = document.createElement('meta');
        meta.setAttribute('property', propertyKey);
        meta.setAttribute('content', value);
        (document.head || document.body)?.appendChild(meta);
    }
    return meta;
}
