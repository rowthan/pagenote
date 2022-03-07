import {useEffect, useState} from "react";
import {requestExtension} from "../utils/extensionApi";

function useWhoAmI() {
    const [whoAmI,setWhoAmI] = useState(function () {
        return{
            version: ''
        }
    })
    useEffect(function () {
        requestExtension<{version:string}>('WHOAMI').then(function (result) {
            setWhoAmI(result)
        })
    },[])

    return whoAmI
}

export default useWhoAmI