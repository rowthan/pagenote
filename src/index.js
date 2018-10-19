import easyshare from './easyshare'
import widget from './widget'

export default function EasyShare(id,options){
    const easy = new easyshare(id,options)
    const easyui = document.querySelectorAll("div[data-easyshare]")
    if(easyui.length==0){
        widget(easy);
    }
    return easy
}
window.EasyShare = EasyShare



