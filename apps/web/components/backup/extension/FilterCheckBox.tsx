import React from "react";

export default function FilterCheckBox(props: { field: string, selected: string[], onChange:(key: string)=>void }) {
    return (
        <input type="checkbox"
               onChange={(e)=>{props.onChange(props.field)}}
               checked={props.selected.includes(props.field)}
               className="checkbox checkbox-xs"/>
    )
}
