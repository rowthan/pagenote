import {useEffect, useState} from "react";
import {requestExtension} from "../utils/extensionApi";

function useWebdavAccount() {
    const [data,setData] = useState<{accountName:string}>(function () {
        return{
            accountName: ''
        }
    })
    useEffect(function () {
        requestExtension<{data:{accountName:string}}>('getWebdavAccount').then(function (result) {
            setData(result.data)
        })
    },[])

    return data
}

export default useWebdavAccount