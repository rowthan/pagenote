// @ts-nocheck
import PagenoteCore from './pagenote-core';
import ReactDOM from "react-dom";
import ActionBars from "./action/ActionBars";
import { debounce, getPagenoteRoot } from './utils';
import './component/light/annotation.scss';
import toggleLightMenu from './light-menu';
import React from "react";
import { setLoaded } from "./common/pagenote-utils/share-pagenote";
function PageNote(id, options) {
    // @ts-ignore
    var pagenoteCore = new PagenoteCore(id, options);
    var rootElement = getPagenoteRoot();
    var colors = options.brushes.filter(function (item) {
        return item && item.bg;
    }).map(function (brush) { return brush.bg; });
    toggleLightMenu(false, null, null, colors);
    // side-bar
    // const sidebar = document.createElement('pagenote-bar');
    // sidebar.dataset.pagenote='sidebar';
    // rootElement.appendChild(sidebar);
    // render(<AsideBar pagenote={pagenoteCore} /> , sidebar);
    // action-bar
    var actionBar = null;
    pagenoteCore.addListener(debounce(function (status, before) {
        var showButton = (pagenoteCore.target && (status === pagenoteCore.CONSTANT.WAITING || status === pagenoteCore.CONSTANT.PLAYANDWAIT));
        if (showButton) {
            actionBar = actionBar || document.createElement('pagenote-action');
            actionBar.dataset.pagenote = 'action';
            ReactDOM.render(React.createElement(ActionBars, { pagenote: pagenoteCore }), actionBar);
            rootElement.appendChild(actionBar);
        }
        else {
            actionBar && actionBar.remove();
        }
    }, 16));
    // lights
    var stepBar = document.querySelector('pagenote-annotations');
    if (!stepBar) {
        stepBar = document.createElement('pagenote-annotations');
        rootElement.appendChild(stepBar);
    }
    setLoaded();
    return pagenoteCore;
}
window.PageNote = PageNote;
export default PageNote;
//# sourceMappingURL=pagenote.js.map