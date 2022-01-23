import { getRootOffset, whats } from "../utils";
import { gotoPosition } from "../utils/document";
var connectToKeywordTag = function (ignoreScroll) {
    if (ignoreScroll === void 0) { ignoreScroll = false; }
    var tag = this.runtime.relatedNode[this.runtime.relatedNode.length - 1];
    if (tag) {
        var rootOffset = getRootOffset();
        // @ts-ignore
        var position = whats.compute(tag);
        var height = tag.offsetHeight;
        var left = position.left - rootOffset.left;
        var top_1 = position.top + height + 8 - rootOffset.top;
        this.runtime.annotationDrag.set(left, top_1);
        this.data.x = left;
        this.data.y = top_1;
        if (ignoreScroll !== true) {
            if (!this.runtime.isVisible) {
                gotoPosition(null, position.left, position.top - height - 8);
            }
        }
    }
};
export default connectToKeywordTag;
//# sourceMappingURL=step-connectToKeywordTag.js.map