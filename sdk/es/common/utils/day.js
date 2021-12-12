var countdownTime = function (date1) {
    var date3 = new Date(date1).getTime() - new Date().getTime(); //时间差的毫秒数
    //计算出相差天数
    var days = Math.floor(date3 / (24 * 3600 * 1000));
    //计算出小时数
    var leave1 = date3 % (24 * 3600 * 1000); //计算天数后剩余的毫秒数
    var hours = Math.floor(leave1 / (3600 * 1000));
    //计算相差分钟数
    var leave2 = leave1 % (3600 * 1000); //计算小时数后剩余的毫秒数
    var minutes = Math.floor(leave2 / (60 * 1000));
    //计算相差秒数
    var leave3 = leave2 % (60 * 1000); //计算分钟数后剩余的毫秒数
    var seconds = Math.round(leave3 / 1000);
    return [days, hours, minutes, seconds];
};
var computeLeftTime = function (expiredAt, lastModAt) {
    var left = expiredAt - Date.now();
    var total = lastModAt ? (expiredAt - lastModAt) : (14 * 3600 * 24) * 100;
    var percent = left / total * 100;
    var leftTime = countdownTime(expiredAt);
    var days = leftTime[0], hours = leftTime[1], minites = leftTime[2], seconds = leftTime[3];
    var label;
    if (days > 0) {
        label = days + "天后";
    }
    else if (hours > 0) {
        label = hours + '小时后';
    }
    else if (minites > 0) {
        label = minites + '分钟后';
    }
    else if (minites > 0) {
        label = minites + '分钟后';
    }
    else {
        label = '即将';
    }
    return {
        percent: percent,
        label: label,
    };
};
export { countdownTime, computeLeftTime, };
//# sourceMappingURL=day.js.map