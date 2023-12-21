
import useSettings from "hooks/useSettings"
import { useEffect } from "react"
import obsidian from "utils/obsidian";


export default function SyncSettingToObsidian(){
    const {data} = useSettings()


    useEffect(function(){
        console.log(data)
        for(let i in data){
            if(!i.startsWith('_')){
                obsidian.putFile(`pagenote/.setting/${i}.json`,JSON.stringify(data[i]))
            }
        }

    },[data])

    return(
        <div></div>
    )
}