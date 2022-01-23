import {whats} from "../utils";
import {gotoPosition} from "../utils/document";

function stepGotoView(callback=function(){}){
    let targetEl = this.runtime.relatedNode?this.runtime.relatedNode[0]:null;
    if(!targetEl){
        try{
            // @ts-ignore
            targetEl = whats.getTarget(this.data.id);
        }catch (e){

        }
    }
    return gotoPosition(targetEl,this.data.x-window.innerWidth/2,this.data.y-window.innerHeight/3,()=>{
        callback();
    })
}
export default stepGotoView;