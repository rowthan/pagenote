import '../assets/styles/modal.scss'
import {emptyChildren} from "./document";
function createModal(element,position,) {
   const that = this;
   const block =  document.createElement('pagenote-block');
   block.dataset.role="modal";
   const mask = document.createElement('pagenote-block');
   mask.dataset.role="mask";
   const content = document.createElement('pagenote-block')
   content.dataset.role="content";

   if(element){
      content.appendChild(element);
   }
   block.appendChild(mask);
   block.appendChild(content);

   mask.onclick = function () {
      that.destroy();
   }
   this.root = block;
   this.content = content;
}

createModal.prototype.show = function (element,position) {
   const height = document.documentElement.scrollHeight;
   const width = document.documentElement.scrollWidth;
   this.root.style.width = width + 'px';
   this.root.style.height = height+ 'px';

   if(position){
      this.content.style.left = position.left;
      this.content.style.top = position.top;
   }
   if(element){
      emptyChildren(this.content);
      this.content.appendChild(element)
   }

   document.documentElement.appendChild(this.root);
}

createModal.prototype.destroy = function () {
   this.root.parentNode.removeChild(this.root);
}

export default createModal;