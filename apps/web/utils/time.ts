import dayjs from "dayjs";

export const computeTimeDiff = function (timeStamp:number):string {
    if(!timeStamp){
        return ''
    }
    const tempTime = dayjs(+timeStamp);
    const now = dayjs(new Date());
    const diffDay = now.diff(tempTime,'day');
    if(diffDay>30){
        const diffMonth = now.diff(tempTime,'month');
        return diffMonth + '月前'
    } else if(diffDay>1){
        return diffDay + '天前'
    } else {
        const diffHours = now.diff(tempTime,'hour');
        if(diffHours>1){
            return diffHours + '小时前'
        } else{
            const diffMinute = now.diff(tempTime,'minute');
            if(diffMinute>1){
                return diffMinute + '分钟前'
            } else{
                return '片刻前'
            }
        }
    }
}
