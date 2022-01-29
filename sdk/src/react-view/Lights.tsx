import {Step} from "../../../shared/src/@types/Types";
import {Fragment} from "react";
import React from "react";
import LightItem from "./LightItem";

interface Props {
    lights: Step[],
    remove: (index: number)=>void,
}
export default function Lights({lights,remove}:Props){
    return (
        <Fragment>
            {
                lights.map((item,index)=>(
                    <div key={item.id}>
                        <LightItem light={item} remove={()=>{remove(index)}}/>
                    </div>
                ))
            }
        </Fragment>
    )
}
