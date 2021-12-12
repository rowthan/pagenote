function maskInfo(input:string):string {
    const splitIndex = input.indexOf('@') === - 1 ? input.length : input.indexOf('@')
    const maskPart = input.substr(0,splitIndex)
    const suffix = input.substr(splitIndex)

    if(maskPart.length<2){
        return input
    }

    let mask = maskPart.length <= 2 ?  '*' :  (maskPart.length > 6 ? "****" : "**")

    const maskStart = Math.fround((maskPart.length - mask.length) / 2)

    return ( maskPart.substr(0,maskStart) + mask + maskPart.substr(maskStart+mask.length) ) + suffix
}

export {
    maskInfo
}