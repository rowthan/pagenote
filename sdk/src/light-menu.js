import {render} from 'react-dom';
import {getScroll} from "./utils/document";
import LightActionBar from "./component/LightActionBar";


const toggleLightMenu = (function () {
    let toggleLightBar;
    return function (show,light,position,colors){
        return // 封禁该功能
        if(toggleLightBar){
            return toggleLightBar(show,light,position);
        }

        function Menu({light,pos}) {
            let top,left;
            if(!pos){
                const scroll = getScroll();
                const relativeNode = light.runtime.relatedNode[0] || light.runtime.relatedAnnotationNode;
                const triggerPosition = relativeNode.getBoundingClientRect();
                top = Math.max(triggerPosition.top-40+scroll.y,40)
                left = triggerPosition.left+scroll.x+triggerPosition.width/2 - 56;
            } else {
                top = pos.top;
                left = pos.left;
            }
            
            return <pagenote-block
                onClick={(e)=>{e.stopPropagation()}}
                style={`position:absolute; z-index:999999;top:${top}px;left:${left}px;
                    `}>
                <LightActionBar step={light} colors={colors}/>
            </pagenote-block>
        }

        toggleLightBar = function (show,light,position) {
            render(show?<Menu light={light} pos={position}></Menu>:null,
                document.documentElement)
        }

        toggleLightBar(show,light,position)

        document.addEventListener('click',function (e) {
            toggleLightBar(false)
        });
    }
})()

export default toggleLightMenu;