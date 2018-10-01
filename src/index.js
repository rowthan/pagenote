import easyshare from './easyshare'
import widget from './widget'

export default function EasyShare(options={}){
    const easy = new easyshare(options)
    widget(easy)
    return easy
}

window.EasyShare = EasyShare



