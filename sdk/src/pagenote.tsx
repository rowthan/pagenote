// @ts-nocheck
import PagenoteCore from './pagenote-core'
import ReactDOM from "react-dom";
import AsideBar from "./component/aside/AsideBar";
import ActionBars from "./action/ActionBars";
import {debounce, getPagenoteRoot} from './utils';
import './component/light/annotation.scss'
import toggleLightMenu from './light-menu'
import {IOption} from "./types/Option";
import React from "react";
import {setLoaded} from "./common/pagenote-utils/share-pagenote";

function PageNote(id:string,options:IOption){
    // @ts-ignore
    const pagenoteCore = new PagenoteCore(id,options);
    const rootElement = getPagenoteRoot();

    const colors = options.brushes.filter(function (item) {
        return item && item.bg;
    }).map((brush)=>{return brush.bg})
    toggleLightMenu(false,null,null,colors);

    // side-bar
    // const sidebar = document.createElement('pagenote-bar');
    // sidebar.dataset.pagenote='sidebar';
    // rootElement.appendChild(sidebar);
    // render(<AsideBar pagenote={pagenoteCore} /> , sidebar);

    // action-bar
    let actionBar: HTMLElement = null;
    pagenoteCore.addListener(debounce(function (status: any, before: any) {
        const showButton = (pagenoteCore.target && (status === pagenoteCore.CONSTANT.WAITING || status === pagenoteCore.CONSTANT.PLAYANDWAIT));
        if(showButton) {
            actionBar = actionBar || document.createElement('pagenote-action');
            actionBar.dataset.pagenote = 'action';
            ReactDOM.render(<ActionBars pagenote={pagenoteCore} />, actionBar);
            rootElement.appendChild(actionBar);
        } else {
            actionBar && actionBar.remove();
        }
    },16));

    // lights
    let stepBar = document.querySelector('pagenote-annotations');
    if(!stepBar){
        stepBar = document.createElement('pagenote-annotations')
        rootElement.appendChild(stepBar);
    }

    setLoaded()
    return pagenoteCore;
}


declare global {
    interface Window { PageNote: any; }
    interface ProxyConstructor {
        new <TSource extends object, TTarget extends object>(target: TSource, handler: ProxyHandler<TSource>): TTarget;
    }
}

window.PageNote = PageNote;
export default PageNote;

