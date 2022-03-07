import React from "react";
import useWhoAmI from "../hooks/useWhoAmI";
import {isLow} from "@pagenote/shared/lib/utils/compare";

interface Props {
    Component: React.Component,
    minVersion: string
}

export default function VersionCheck(Component:() => JSX.Element,minVersion:string) {
    return function () {
        const whoAmI = useWhoAmI();
        if(isLow(whoAmI.version,minVersion)){
            return (
                <div>
                    此版本不支持 {whoAmI.version}
                </div>
            )
        }else{
            return <Component />
        }
    }
}