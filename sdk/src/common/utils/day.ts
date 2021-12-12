
const countdownTime = function (date1: number):[number,number,number,number] {
    const date3 = new Date(date1).getTime() - new Date().getTime();   //时间差的毫秒数
    //计算出相差天数
    const days=Math.floor(date3/(24*3600*1000))

    //计算出小时数

    const leave1=date3%(24*3600*1000)    //计算天数后剩余的毫秒数
    const hours=Math.floor(leave1/(3600*1000))
    //计算相差分钟数
    const leave2=leave1%(3600*1000)        //计算小时数后剩余的毫秒数
    const minutes=Math.floor(leave2/(60*1000))
    //计算相差秒数
    const leave3=leave2%(60*1000)      //计算分钟数后剩余的毫秒数
    const seconds=Math.round(leave3/1000)

    return [days,hours,minutes,seconds]
}

const computeLeftTime = function (expiredAt:number,lastModAt:number):{percent:number,label:string} {
    let left = expiredAt - Date.now();
    const total = lastModAt ? (expiredAt - lastModAt) : (14 * 3600 * 24) * 100
    const percent = left / total * 100;
    const leftTime = countdownTime(expiredAt);
    const [days,hours,minites,seconds] = leftTime;
    let label
    if(days>0){
        label = days + "天后"
    } else if(hours>0){
        label = hours + '小时后'
    } else if(minites>0){
        label = minites + '分钟后'
    }else if(minites>0){
        label = minites + '分钟后'
    } else {
        label = '即将'
    }
    return{
        percent: percent,
        label: label,
    }
}

export {
    countdownTime,
    computeLeftTime,
}