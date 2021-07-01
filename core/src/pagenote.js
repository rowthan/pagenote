import PagenoteCore from './pagenote-core'
import { h, render } from 'preact';
import AsideBar from "./component/aside/AsideBar";
import ActionBars from "./component/action/ActionBars";
import {debounce} from './utils';
import LightActionBar from "./component/LightActionBar";
import { getScroll } from "./utils/document";

function PageNote(id,options={}){
    const pagenoteCore = new PagenoteCore(id,options);
    const rootElement = document.documentElement || document.body || document.createElement('div');

    // side-bar
    const sidebar = document.createElement('pagenote-bar');
    sidebar.dataset.pagenote='sidebar';
    rootElement.appendChild(sidebar);
    render(<AsideBar pagenote={pagenoteCore} /> , sidebar);

    // action-bar
    let actionBar = null;
    pagenoteCore.addListener(debounce(function (status,before) {
        if(status===before && status!==pagenoteCore.CONSTANT.WAITING){
            return;
        }
        const showButton = (pagenoteCore.target && (status === pagenoteCore.CONSTANT.WAITING || status === pagenoteCore.CONSTANT.PLAYANDWAIT));
        if(showButton) {
            actionBar = actionBar || document.createElement('pagenote-action');
            actionBar.dataset.pagenote = 'action';
            render(<ActionBars pagenote={pagenoteCore} />, actionBar);
            rootElement.appendChild(actionBar);
        } else {
            actionBar && actionBar.remove();
        }
    },16));

    // // lights
    // const stepBar = document.createElement('pagenote-tags');
    // stepBar.className='no-pagenote';
    // stepBar.dataset.pagenote = 'tags';
    // render(<Lights pagenote={pagenoteCore}/>,stepBar);
    // rootElement.appendChild(stepBar);

    function Menu({light,element}) {
        // console.log(light,element.getBoundingClientRect())
        const scroll = getScroll();
        const triggerPosition = element.getBoundingClientRect();
        return <div
                    onClick={(e)=>{e.stopPropagation()}}
                    style={`position:absolute; z-index:1;padding: 4px; background: #fff; border-radius: 4px; box-shadow: 1px 2px 6px 0px #cecece;
                            top:${triggerPosition.top-40+scroll.y}px;left:${triggerPosition.left+scroll.x+triggerPosition.width/2}px;
                    `}>
            <LightActionBar step={light} colors={pagenoteCore.options.brushes.map((brush)=>{return brush.bg})}/>
        </div>
    }

    pagenoteCore.toggleLightBar = function (show,light,element) {
        render(show?<Menu light={light} element={element}></Menu>:null,
            document.documentElement)
    }

    document.addEventListener('click',function (e) {
        console.log('click',e.target);
        pagenoteCore.toggleLightBar(false)
    })

    return pagenoteCore;
}



export default PageNote;
window.PageNote = PageNote;
