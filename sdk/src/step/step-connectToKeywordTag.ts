import {getRootOffset, whats} from "../utils/index";

const connectToKeywordTag = function () {
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
    }
}

export default connectToKeywordTag;