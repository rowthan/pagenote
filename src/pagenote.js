import PagenoteCore from './pagenote-core'
import { h, render } from 'preact';
import AsideBar from "./widget/AsideBar";
import ActionBars from "./widget/ActionBars";
import LightActionBar from "./widget/LightActionBar";
import {debounce} from './utils';

function PageNote(id,options={}){
    const pagenoteCore = new PagenoteCore(id,options);
    const rootElement = document.body || document.documentElement || document.createElement('div');

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
        const showButton = (status === pagenoteCore.CONSTANT.WAITING || status === pagenoteCore.CONSTANT.PLAYANDWAIT);
        if(showButton) {
            setTimeout(()=>{
                actionBar = actionBar || document.createElement('pagenote-action');
                actionBar.dataset.pagenote = 'action';
                render(<ActionBars pagenote={pagenoteCore} />, actionBar);
                rootElement.appendChild(actionBar);
            },10);
        } else {
            actionBar && actionBar.remove();
        }
    },16));

    // lights
    const stepBar = document.createElement('pagenote-tags');
    stepBar.className='no-pagenote';
    stepBar.dataset.pagenote = 'tags';
    render(<LightActionBar pagenote={pagenoteCore}/>,stepBar);
    rootElement.appendChild(stepBar);
    return pagenoteCore;
}
export default PageNote;
window.PageNote = PageNote;
