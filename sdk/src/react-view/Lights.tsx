import {Step} from "@pagenote/shared/lib/@types/Types";
import {Fragment} from "react";
import React from "react";
import LightItem from "./LightItem";

interface Props {
    lights: Step[],
    remove: (index: number)=>void,
    save:()=>void,
}
export default function Lights({lights,remove,save}:Props){
    return (
        <Fragment>
            {
                lights.map((item,index)=>(
                    <LightItem key={index} save={save} light={item} remove={()=>{remove(index)}}/>
                ))
            }
        </Fragment>
    )
}
