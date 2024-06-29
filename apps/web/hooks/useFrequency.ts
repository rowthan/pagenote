import {useEffect, useState} from "react";
import {useRouter} from "next/router";


export default function useFrequency(id: string,day: number = 0) {
    const [valid, setValid] = useState<boolean|null>(null);

    useEffect(function () {
        const visitedAt = localStorage.getItem(id);
        const timeStamp = Number(visitedAt || 0);
        const past = Date.now() - timeStamp;
        const duration = day * 24 * 60 * 60 * 1000;
        // 没有过访问记录，或者过了频控限制，均
        const validShow = visitedAt === null || past > duration;
        setValid(validShow);
        localStorage.setItem(id, String(Date.now()));
    },[])

    return {
        // 是否超出频控限制，不能使用 !判断，初始化状态不判断
        exceeded: valid === false,
    }
}
