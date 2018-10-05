import {gotoPosition,getXY,getScroll,hightLightElement} from './document'
import constant from './constant'
import whatselement from 'whats-element'

const whats = new whatselement({draw:false}),
      MOUSE_UP = 'ontouchstart' in window ? 'touchend' : 'mouseup'

export default function Easyshare(options){
    this.options = Object.assign({autoReplay:true,hightligth:true},options)
    this.recordedSteps = []
    this.runindex = null
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
        if(selectdText){
            const { x, y } = getXY(e)
            const {x:scrollLeft,y:scrollTop} = getScroll()
            this.mPos = {
                x:x,
                y:y
            }
            targetInfo = {
                x:scrollLeft,
                y:scrollTop,
                text:selectdText,
                id: whats.getUniqueId(e.target).wid
            }
            this.status = (this.status === constant.REPLAYING || this.status === constant.PLAYANDWAIT) ? constant.PLAYANDWAIT : constant.WAITING
        }else{
            targetInfo = {}
            this.status = constant.PAUSE
        }
    } )

    this.onStateChange = function(){}
    

    this.record = function(forceRecord=false){
        // 如果当前状态不为等待记录 且不是强行记录时
        if(!forceRecord && this.status!=constant.WAITING){
            console.log("当前状态不可记录")
            return false;
        }
        this.status = constant.RECORDING       
        this.recordedSteps.push(targetInfo)
        this.status = constant.RECORDED
        return true
    }

    let nextTimer = null
    let runningTimer = null
    this.replay = function(step=0,replaySteps,autoNext=true,timeout=5000){
        replaySteps = replaySteps || this.recordedSteps;
        if(replaySteps.length<step+1){
            this.status = constant.REPLAYFINISHED
            return 
        }
        const {x,y,id} = replaySteps[step], targetEl = whats.getTarget(id)

        targetEl && this.options.hightligth &&  hightLightElement(targetEl)
       
        //TODO 存在 targetEl 时，使用定位该元素窗口居中效果 否则 使用滚动效果
        this.runindex = step
        this.status = constant.REPLAYING
        clearInterval(runningTimer)
        runningTimer = gotoPosition(x,y,()=>{
            if(autoNext){
                nextTimer = setTimeout(()=>this.replay(step+1,replaySteps),timeout)
            }else{
                this.status = constant.REPLAYFINISHED
                clearTimeout(nextTimer)
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