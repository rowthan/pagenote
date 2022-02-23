function isLow(current='0.0.0',compareVersion='',separator='.'):boolean {
    if(current===compareVersion){
        return false;
    }
    const firstVersion = current.split(separator);
    const secondVersion = compareVersion.split(separator);
    let isOld = true;
    for(let i=0; i<secondVersion.length; i++) {
        const preVersion = parseInt(firstVersion[i]);
        const nexVersion = parseInt(secondVersion[i]);
        if(preVersion!==nexVersion){
            isOld = preVersion<nexVersion;
            break;
        }
    }
    return isOld;
}

export {
    isLow,
}