import whatsPure from "whats-element/pure";

export const prepareTarget = function (e,blackNodes,enableMarkImg) {
    const whats = new whatsPure();

    const selection = document.getSelection();
    const selectedText = selection.toString().trim(); // 跨标签高亮
    // pagenote 状态监测
    const isWaiting = this.status === constant.WAITING && selectedText === this.target.text;
    const isDestroy = this.status === this.CONSTANT.DESTROY;
    if(isWaiting || isDestroy || selection.rangeCount===0){ // 避免重复计算\无选区
        return;
    }
    // 选区父节点是否存在监测
    const range0 = selection.getRangeAt(0);
    let parentElement = selection.anchorNode?range0.commonAncestorContainer:null;
    if(parentElement && parentElement.nodeType===3){ // 如果父节点为文本节点，则需要再寻一级父节点
        parentElement = parentElement.parentNode;
    }
    const noParentElement = !parentElement || !parentElement.tagName;
    if(noParentElement){
        return;
    }
    // 黑名单节点监测
    let isBlackNode = parentElement.tagName.toLowerCase().indexOf('pagenote')>-1;
    for(let i of blackNodes){
        if(i.contains(parentElement)||i.contains(selection.anchorNode)||i.contains(selection.focusNode)){
            isBlackNode = false;
            break;
        }
    }
    if(isBlackNode){
        return;
    }
    // 是否可编辑区
    let canHighlight = true;
    if(!parentElement || parentElement.contentEditable==='true'){
        canHighlight = false;
    }

    // TODO 监测是否有图片、视频等其他资源
    const markImages = [];
    const selectedElementContent = range0.cloneContents();
    if(enableMarkImg){
        const children = selectedElementContent.children;
        for(let i=0; i< children.length; i++){
            const item = children[i];
            if(item.tagName==='IMG'){
                // 找到对应的图片节点
                const id = `img[src="${item.src}"]`;
                const elements = document.querySelectorAll(id);
                for(let j=0; j<elements.length; j++){
                    const element = elements[j];
                    if(selection.containsNode(element)){
                        const imgId = whats.getUniqueId(element).wid;
                        const imgUrl = element.src;
                        markImages.push({
                            id: imgId,
                            url: imgUrl,
                            alt: element.alt,
                            pre: element.previousSibling,
                            suffix: element.nextSibling,
                        })
                        break;
                    }
                }
            }
        }
    }

    if(!(selectedText || markImages.length)){
        return
    }

    let before = range0.startContainer.textContent.substr(0,range0.startOffset);
    let after = range0.endContainer.textContent.substr(range0.endOffset,10);
    if(!before){
        const preElement = parentElement.previousSibling;
        if(preElement && parentElement.contains(preElement)){
            before = preElement.textContent;
        }
    }
    if(!after){
        const nextElement = parentElement.nextSibling;
        if(nextElement && parentElement.contains(nextElement)){
            after = nextElement.textContent;
        }
    }

    const selectionRects=selection.getRangeAt(0).getClientRects();
    const lastSelectionRect=selectionRects[selectionRects.length-1];
    if(!lastSelectionRect){
        return;
    }
    const x = isMoble ? lastSelectionRect.x + lastSelectionRect.width/2
        :Math.min(lastSelectionRect.x+lastSelectionRect.width/1.5+this.options.actionBarOffset.offsetX,window.innerWidth-150);
    const y = window.scrollY+lastSelectionRect.y+lastSelectionRect.height + this.options.actionBarOffset.offsetY;

    const whatsEl = whats.getUniqueId(parentElement);
    const cursorX = parseInt(x);
    const cursorY = parseInt(y);
    const target = {
        x:cursorX,
        y:cursorY,
        pre:before,
        suffix:after,
        text:selectedText,
        tip:'', // 提供支持纯文本的取值方式
        time: new Date().getTime(),
        id: whatsEl.wid,
        isActive: false,
        bg:this.options.colors[0],
        offsetX: 0.5, // right 小于1时 为比例
        offsetY: 0.99, // bottom
        parentW: parseInt(parentElement.clientWidth),
        clientX: e.clientX,
        clientY: e.clientY,
        canHighlight: canHighlight,
        selectionElements: selectedElementContent,
        images: markImages,
    };

    return target
}
