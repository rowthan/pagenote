import constant from './constant'
function createElement(type,id,content) {
    var el = document.createElement(type?type:"div");
    id?el.id = id:"";
    if(content instanceof HTMLElement){
        el.appendChild(content)
    }else{
        el.innerHTML = content
    }
    return el;
  }
const drawMenu = function(){

    const menu = createElement("button",constant.MENUID,"分享");
    const share = createElement("button",constant.SHAREID,"生成链接")

    const easyShareContainer = createElement("aside",constant.EASYSHARECONTAINER,menu)
    easyShareContainer.style.position = "absolute"
    easyShareContainer.style.top = 0
    easyShareContainer.style.left = 0
    easyShareContainer.style.transition = "0.5s"

    easyShareContainer.appendChild(share)
    document.body.appendChild(easyShareContainer);
}

export {
    drawMenu
}