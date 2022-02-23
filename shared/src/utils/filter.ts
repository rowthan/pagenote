const getDomain = function(url:string):string{
    const match = url.match(/:\/\/(.*?)\//)
    let domainKey = match?match[1]: url;
    if(domainKey){
        domainKey = domainKey.replace(/^www\./,'')
    }
    return domainKey;
}

export {
    getDomain
}