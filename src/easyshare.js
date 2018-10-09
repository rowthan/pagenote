import {gotoPosition,getXY,hightLightElement} from './document'
import constant from './constant'
import whatselement from 'whats-element'

const whats = new whatselement({draw:false}),
      MOUSE_UP = 'ontouchstart' in window ? 'touchend' : 'mouseup'

export default function Easyshare(options){
    this.options = Object.assign({autoReplay:true},options)
    this.recordedSteps = []
    this.runindex = null
    this.targetInfo = {}
    let status = constant.PAUSE, nameid = constant.SHARENAME

    const location = window.location
    window.addEventListener("load", (event)=> {
        const search = decodeURI(location.search)
        if(search.indexOf(nameid)===-1){
            return
        }
        const searchArray = search.substr(1).split("&");
        for(let i=0 ; i < searchArray.length; i++){
            const queryPar  = searchArray[i],
            index = queryPar.indexOf("=")
            if(index>-1){
                const values = queryPar.substring(index+1)
                    const replaySteps = []
                values.split("__").forEach(value=>{
                    const values = value.split("-"),
                        tempStep = {
                            x:values[0],
                            y:values[1],
                            id:values[2],
                            text:values[3]
                        }
                        replaySteps.push(tempStep)
                    })
                    this.status = constant.INITCOMPELETE
                    this.recordedSteps = replaySteps
                break
            }
        }
    });
    

    document.addEventListener( MOUSE_UP , (e)=>{
        const selectdText = document.getSelection().toString().trim();
        if(this.status == constant.WAITING && selectdText === this.targetInfo.text){
            return
        }
        if(selectdText){
            const { x, y } = getXY(e)
            this.targetInfo = {
                x:x,
                y:y,
                text:selectdText,
                //TODO 优化whatselement
                id: whats.getUniqueId(e.target).wid
            }
            this.status = (this.status === constant.REPLAYING || this.status === constant.PLAYANDWAIT) ? constant.PLAYANDWAIT : constant.WAITING
        }else{
            this.targetInfo = {}
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
        // hightLightElement(whats.getTarget(targetInfo.id),targetInfo.text)       
        this.recordedSteps.push(this.targetInfo)
        this.makelink()
        this.status = constant.RECORDED
        return true
    }
    this.remove = function(stepIndex){
        if(stepIndex<0){
            while(this.recordedSteps.length>0){
                this.replay(0,true)
                this.recordedSteps.splice(0,1)
            }
        }else{
            this.replay(stepIndex,true)
            this.recordedSteps.splice(stepIndex,1)
        }
        this.makelink()
    }

    let nextTimer = null
    let runningTimer = null
    this.replay = function(index=0,revert,autoNext,replaySteps,timeout=5000){
        //TODO 根据当前窗口与记录时候窗口大小进行比较，如果差异较大 则进行提示 可能定位不准确的情况
        replaySteps = replaySteps || this.recordedSteps;
        if(replaySteps.length<index+1){
            this.status = constant.REPLAYFINISHED
            return 
        }
        const runStep = replaySteps[index], {x,y,id,text} = runStep, targetEl = id ? whats.getTarget(id) : null
        
        clearInterval(runningTimer)
        //开始滚动
        this.runindex = index
        this.status = constant.REPLAYING
        runStep.isActive = !revert
        const gotoX = x-window.innerWidth/2,
              gotoY = y-window.innerHeight/2
        runningTimer = gotoPosition(gotoX,gotoY,()=>{
            this.runindex = null
            if(autoNext){
                nextTimer = setTimeout(()=>this.replay(index+1,revert,autoNext,replaySteps,timeout),timeout)
            }else{
                this.status = constant.REPLAYFINISHED
                clearTimeout(nextTimer)
            }
        })
        targetEl &&  hightLightElement(targetEl,text,revert)
        //TODO 存在 targetEl 时，使用定位该元素窗口居中效果 否则 使用滚动效果
    }

    this.makelink = () => {
        //TODO 生成的url带特殊字符的进行替换处理 并在解析时还原
       
        // 生成分享链接,记录数据:  http://www.baidu.com?share=0-123a0-234
        try{
            let share = "&"+nameid+"=",
                currentUrl = location.href,
                indexShare = currentUrl.indexOf("&"+nameid)
            
            if(location.search==""){
                currentUrl += "?"
            }
            if(indexShare>-1){
                currentUrl = currentUrl.substr(0,indexShare)
            }

            if(this.recordedSteps.length===0){
                share=""
            }else{
                this.recordedSteps.forEach((step,index) => {
                    index!=0?share +="__":"";
                    share += `${step.x}-${step.y}-${(step.id && step.id.length<15)?step.id:"_"}-${step.text.substring(0,15)}`
                });
                if(this.options.autoReplay){
                    share += "&autoreplay=true"
                }
            }
            history.pushState("", nameid, currentUrl+share);
        }catch(e){
            this.recordedSteps.splice(-1,1)
            throw Error("makelink faild",e)
        }
    }

    Object.defineProperty(this,"status",{get:()=>{return status},set:(value=>{
        status=value;
        this.onStateChange(status)
    })})
    Object.defineProperty(this,"version",{value:"0.0.2"})
}