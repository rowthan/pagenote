import useWhoAmi from "hooks/useWhoAmi";
import {ReactElement, useEffect} from "react";
import {replaceHttpToExt} from "utils/url";
export default function RedirectToExt(props:{children: ReactElement}) {
    const [whoAmI] = useWhoAmi();
    useEffect(function () {
        replaceHttpToExt(whoAmI?.origin)
    },[whoAmI])
    return (props.children)
}
