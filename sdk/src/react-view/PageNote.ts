import {render} from "./PageNoteView";
import {PlainData} from "@pagenote/shared/lib/@types/Types";
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



    init(){
        render(this.data,this.onchange)
    }
}

