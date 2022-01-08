import '../assets/styles/modal.scss';
import { emptyChildren } from "./document";
function createModal(element, position) {
    var that = this;
    var block = document.createElement('pagenote-block');
    block.dataset.role = "modal";
    var mask = document.createElement('pagenote-block');
    mask.dataset.role = "mask";
    var content = document.createElement('pagenote-block');
    content.dataset.role = "content";
    if (element) {
        content.appendChild(element);
    }
    block.appendChild(mask);
    block.appendChild(content);
    mask.onclick = function () {
        that.destroy();
    };
    this.root = block;
    this.content = content;
}
createModal.prototype.show = function (element, position) {
    var that = this;
    that._onresize = function () {
        var height = document.documentElement.scrollHeight;
        var width = document.documentElement.scrollWidth;
        that.root.style.width = width + 'px';
        that.root.style.height = height + 'px';
    };
    window.addEventListener('resize', that._onresize);
    that._onresize();
    if (position) {
        this.content.style.left = position.left;
        this.content.style.top = position.top;
    }
    if (element) {
        emptyChildren(this.content);
        this.content.appendChild(element);
    }
    document.documentElement.appendChild(this.root);
};
createModal.prototype.destroy = function () {
    if (this.root && this.root.parentNode) {
        this.root.parentNode.removeChild(this.root);
    }
    window.removeEventListener('resize', this._onresize);
};
export default createModal;
//# sourceMappingURL=modal.js.map