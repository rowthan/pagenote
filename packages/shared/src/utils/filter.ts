const getDomain = function(url:string,main:boolean):string{
    const match = url.match(/:\/\/(.*?)\//)
    let domainKey = match?match[1]: url;
    if(domainKey){
        domainKey = domainKey.replace(/^www\./,'')
    }
    if(main){
        const words = domainKey.split('.');
        return words.slice(words.length-2,words.length).join('.')
    }
    return domainKey;
}

export {
    getDomain
}
