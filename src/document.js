import constant from './constant'
function createElement(type,id,content) {
    var el = document.createElement(type?type:"div");
    id?el.id = id:"";
    el.innerHTML = content;
    return el;
  }
const drawMenu = function(){
    const menu = createElement("button",constant.MENUID,"分享");
    menu.style.position = "absolute"
    menu.style.top = 0
    menu.style.left = 0
    menu.style.transition = "0.5s"
    document.body.appendChild(menu);
}

export {
    drawMenu
}