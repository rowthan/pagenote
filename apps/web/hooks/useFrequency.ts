import {useEffect, useState} from "react";
import {useRouter} from "next/router";


export default function useFrequency(id: string,day: number = 0) {
    const [valid, setValid] = useState<boolean|null>(null);
    const router = useRouter()

    useEffect(function () {
        const visitedAt = localStorage.getItem(id);
        const timeStamp = Number(visitedAt || 0);
        const past = Date.now() - timeStamp;
        const duration = day * 24 * 60 * 60 * 1000;
        const validShow = past > duration;
        setValid(validShow);
        localStorage.setItem(id, String(Date.now()));
    },[])

    return [valid]
}
