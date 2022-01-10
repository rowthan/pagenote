import {getRootOffset, whats} from "../utils";
import {gotoPosition} from "../utils/document";

const connectToKeywordTag = function (ignoreScroll=false) {
    const tag = this.runtime.relatedNode[this.runtime.relatedNode.length-1];
    if(tag){
        const rootOffset = getRootOffset();
        // @ts-ignore
        const position = whats.compute(tag);
        const height = tag.offsetHeight;
        const left = position.left - rootOffset.left;
        const top = position.top + height + 8 - rootOffset.top;

        this.runtime.annotationDrag.set(left,top)
        this.data.x = left;
        this.data.y = top;
        if(ignoreScroll !== true){
            if(!this.runtime.isVisible){
                gotoPosition(null,position.left,position.top - height - 8);
            }
        }
    }
}

export default connectToKeywordTag;