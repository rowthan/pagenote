import { render } from "./PageNoteView";
import { PlainData } from "@pagenote/shared/lib/@types/data";
import { $emit, $on, EVENT_NAME } from "./emit";
import { PageNoteProps } from "./types";

export default class PageNote {
    options: PageNoteProps
    constructor(options: PageNoteProps & {onchange: (data: PlainData) => void,}) {
        this.options = options;
        if(options.onchange){
            $on(EVENT_NAME.DATA_CHANGE,function(data: PlainData) {
                options.onchange(data)
            })
        }
        render(options)
    }

    setData(value:PlainData){
        if(!value){
            return;
        }
        $emit(EVENT_NAME.TRIGGER_CHANGE_DATA,value)
    }
}

