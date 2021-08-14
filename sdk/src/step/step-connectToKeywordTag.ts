import {whats} from "../utils/index";

const connectToKeywordTag = function () {
    const tag = this.runtime.relatedNode[0];
    if(tag){
        // @ts-ignore
        const position = whats.compute(tag);
        const height = tag.offsetHeight;
        const left = position.left;
        const top = position.top + height + 2;

        this.runtime.annotationDrag.set(left,top)
        this.data.x = left;
        this.data.y = top;
    }
}

export default connectToKeywordTag;