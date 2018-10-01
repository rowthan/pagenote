import {gotoPosition,getXY,getScroll,hightLightElement} from './document'
import constant from './constant'
import whatselement from 'whats-element'

const whats = new whatselement({draw:false}),
      MOUSE_UP = 'ontouchstart' in window ? 'touchend' : 'mouseup'

export default function Easyshare(options){
    this.options = Object.assign({autoReplay:true,hightligth:true},options)
    this.recordedSteps = []
    this.running = null
    this.mPos = {x:0,y:0}
    let status = constant.PAUSE,targetInfo = {}, nameid = constant.SHARENAME

    window.addEventListener("load", (event)=> {
        const search = window.location.search
        if(search.indexOf(nameid)===-1){
            return
        }
        const searchArray = search.substr(1).split("&");
        for(let i=0 ; i < searchArray.length; i++){
            const queryPar  = searchArray[i]
            if(queryPar.indexOf(nameid)>-1){
                const pair = queryPar.split("=");
                if(pair.length===2){
                    const values = pair[1]
                    const replaySteps = []
                    values.split("a").forEach(value=>{
                        const tempStep = {
                            x:value.split("-")[0],
                            y:value.split("-")[1],
                        }
                        replaySteps.push(tempStep)
                    })
                    this.status = constant.INITCOMPELETE
                    this.recordedSteps = replaySteps
                }
                break
            }
        }
    });
    

    document.addEventListener( MOUSE_UP , (e)=>{
        const selectdText = document.getSelection().toString().trim();
        if(selectdText===targetInfo.text){
            return
        } 
        if(selectdText){
            const { x, y } = getXY(e)
            const {x:scrollLeft,y:scrollTop} = getScroll()
            this.mPos = {
                x:x,
                y:y
            }
            this.status = constant.WAITING
            targetInfo = {
                x:scrollLeft,
                y:scrollTop,
                text:selectdText,
                id: whats.getUniqueId(e.target).wid
            }
        }else{
            targetInfo = {}
            this.status = constant.PAUSE
        }
    } )

    this.onStateChange = function(){}
    
    this.finished = function(){
        this.status = constant.FINNISHED
        this.recordedSteps = []
    }

    this.record = function(){
        this.status = constant.RECORDING       
        this.recordedSteps.push(targetInfo)
        this.status = constant.RECORDED
    }

    this.replay = function(step=0,replaySteps,timeout=5000){
        replaySteps = replaySteps || this.recordedSteps;
        if(replaySteps.length<step+1){
            this.running = null
            this.status = constant.REPLAYFINISHED
            return 
        }
        const {x,y,id} = replaySteps[step], targetEl = whats.getTarget(id)

        targetEl && this.options.hightligth &&  hightLightElement(targetEl)
       
        //TODO 存在 targetEl 时，使用定位该元素窗口居中效果 否则 使用滚动效果
        this.running = step
        this.status = constant.REPLAYING
        gotoPosition(x,y,()=>{
            if(this.options.autoReplay){
                setTimeout(()=>this.replay(step+1,replaySteps),timeout)
            }
        })
    }

    this.makelink = () => {
        if(this.recordedSteps.length===0)return;
        // 生成分享链接,记录数据:  http://www.baidu.com?share=0-123a0-234
        let share = "&"+nameid+"=",
            currentUrl = window.location.href,
            indexShare = currentUrl.indexOf("&"+nameid)
        this.recordedSteps.forEach((step,index) => {
            index!=0?share +="a":"";
            share += step.x+"-"+step.y
        });
        
        if(window.location.search==""){
            currentUrl += "?"
        }
        if(indexShare>-1){
            currentUrl = currentUrl.substr(0,indexShare)
        }
        if(this.options.autoReplay){
            share += "&autoreplay=true"
        }
        history.pushState("", nameid, currentUrl+share);
    }

    Object.defineProperty(this,"status",{get:()=>{return status},set:(value=>{
        status=value;
        this.onStateChange(status)
    })})
    Object.defineProperty(this,"version",{value:"0.0.2"})
}