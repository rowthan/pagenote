export const NUMBERS = "0123456789";

// 输入一个字符串 返回一个 与之对应的Code,用于无安全性要求、不可逆的映射Code
const customMapCode = function(input:string, length=5, codeRange=NUMBERS, unMapCode='0'){
    const step = Math.ceil(input.toString().length/length)
    const result = new Array(length).fill(unMapCode);

    const leftCnt = input.length % length;
    const appendString = leftCnt === 0 ? '' : input.substring(0,length - leftCnt)

    const formatedString = input + appendString;

    let resultCodeIndex = 0;

    for(let i=0; i<formatedString.length;){
        const group = formatedString.substring(i,i+step);
        const codeIndexs:number[] = [];
        for(let subIndex=0; subIndex<group.length; subIndex++){
            codeIndexs[subIndex] = group[subIndex].charCodeAt(0);
        }

        const currentIndex = codeIndexs.reduce(function(a,b){return a+b},0)

        const codeIndex = currentIndex%codeRange.length;
        const code = codeRange[codeIndex];
        if(code===undefined){
            console.error(codeRange,codeIndex,currentIndex)
        }
        result[resultCodeIndex] = code
        resultCodeIndex++
        i = i+step;
    }

    return result.join("")
}


export {
    customMapCode,
}
