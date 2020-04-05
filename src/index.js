import pagenote from './pagenote'
import widget from './widget'

function PageNote(id,options={}){
    const easy = new pagenote(id,options);
    const easyui = document.querySelectorAll("div[data-pagenote]")
    if(easyui.length===0){
        widget(easy,options.colors);
    }
    return easy
}
module.exports = PageNote;
window.PageNote = PageNote;



