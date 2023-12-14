import {ReactElement, useEffect} from "react";

export default function CheckDomain(props:{origin: string,children:ReactElement}) {
    const {children,origin} = props;
    useEffect(function () {
        if(window.location.protocol.indexOf('http') === -1){
            return
        }
        if(origin){
            const currentDomain = window.location.origin;
            if(origin!==currentDomain){
                window.location.href = window.location.href.replaceAll(currentDomain, origin)
            }
        }
    },[origin])


    return(
        {children}
    )
}
