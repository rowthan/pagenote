import {h,render} from 'preact';
import {getScroll} from "./utils/document";
import LightActionBar from "./component/LightActionBar";


const toggleLightMenu = (function () {
    let toggleLightBar;
    return function (show,light,element,colors){
        if(toggleLightBar){
            return toggleLightBar(show,light,element);
        }

        function Menu({light,element}) {
            const scroll = getScroll();
            const triggerPosition = element.getBoundingClientRect();
            const top = Math.max(triggerPosition.top-40+scroll.y,40)
            // padding: 4px; background: #fff; border-radius: 4px; box-shadow: 1px 2px 6px 0px #cecece;
            return <div
                onClick={(e)=>{e.stopPropagation()}}
                style={`position:absolute; z-index:1;top:${top}px;left:${triggerPosition.left+scroll.x+triggerPosition.width/2}px;
                    `}>
                <LightActionBar step={light} colors={colors}/>
            </div>
        }

        toggleLightBar = function (show,light,element) {
            render(show?<Menu light={light} element={element}></Menu>:null,
                document.documentElement)
        }

        toggleLightBar(show,light,element)

        document.addEventListener('click',function (e) {
            toggleLightBar(false)
        });
    }
})()

export default toggleLightMenu;