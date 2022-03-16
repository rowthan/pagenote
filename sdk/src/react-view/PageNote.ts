import {render} from "./PageNoteView";
import {PlainData} from "@pagenote/shared/lib/@types/data";
export default class PageNote {
    data: PlainData
    onchange: (data:PlainData)=>void
    constructor(onchange:(data:PlainData)=>void) {
        this.onchange = onchange || function () {
            
        };
        this.data = {
            categories: [],
            images: [],
            setting: undefined,
            snapshots: [],
            steps: [],
            url: ""
        }
    }

    init(data?:PlainData){
        if(data){
            this.data = data;
        }
        render(this.data,this.onchange)
    }
}

