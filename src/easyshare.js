import {gotoPosition,getXY,hightLightElement} from './document'
import constant from './constant'
import whatsPure from 'whats-element/pure'
//whats getTarget try catch 
//TODO 不能返回带#号
const whats = new whatsPure(),
      MOUSE_UP = 'ontouchstart' in window ? 'touchend' : 'mouseup'

export default function Easyshare(options){
    this.options = Object.assign({autoReplay:true,maxMarkNumber:10,stepSplit:"e_o",valueSplit:":)"},options)
    this.recordedSteps = []
    this.runindex = null
    this.targetInfo = {}
    let nextTimer = null, runningTimer = null
    //做成可配置项
    const splitStep = this.options.stepSplit,splitValue=this.options.valueSplit,nameid = constant.SHARENAME,location = window.location,
    nullValue = "",numberAfter="_hash_",numberCode = "#", //中文 ! # & @ 不能作为分割词。 建议使用非对称 (→o←) -_-||
    NOCODE = [splitStep,splitValue];
    window.addEventListener("load", (event)=> {
        const search = decodeURI(location.search).replace(new RegExp(numberAfter,"g"),numberCode)
        if(search.indexOf(nameid)===-1){
            return
        }

        const searchArray = search.substr(1).split("&");
        for(let i=0 ; i < searchArray.length; i++){
            const queryPar  = searchArray[i],
            index = queryPar.indexOf("=")
            if(index>-1){
                const values = queryPar.substring(index+1),replaySteps = []
                //获取到EasyShare数据字符串 解析为对象
                values.split(splitStep).forEach(value=>{
                    const values = value.split(splitValue),
                        tempStep = {
                            x:values[0],
                            y:values[1],
                            id:values[2],
                            text:values[3],
                            tip:values[4] || values[3]
                        }
                        replaySteps.push(tempStep)
                    })
                    this.status = constant.INITCOMPELETE
                    this.recordedSteps = replaySteps
                break
            }
        }
    });

    
    
    //TODO 移动设备兼容性  设置监听黑名单 如widget中所有元素不参与点击事件
    document.addEventListener( MOUSE_UP , (e)=>{
        const selectdText = document.getSelection().toString().trim();
        if(this.status == constant.WAITING && selectdText === this.targetInfo.text){
            return
        }
        e.target.classList.remove("easyshare_highlight")
        if(selectdText){
            const { x, y } = getXY(e)
            this.targetInfo = {
                x:x,
                y:y,
                text:selectdText.substring(0,30),
                tip:selectdText,
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
    
    // success: true,faild:false
    this.record = function(forceRecord=false){
        const maxNn = this.options.maxMarkNumber
        if(this.recordedSteps.length>=maxNn){
            alert("标记失败！本网页最大标记数量为 "+maxNn)
            return false
        }
        // 如果当前状态不为等待记录 且不是强行记录时
        if(!forceRecord && this.status!=constant.WAITING){
            console.log("当前状态不可记录")
            return false;
        }
        const targetInfo = this.targetInfo;
        
        this.status = constant.RECORDING
        
        this.recordedSteps.push(targetInfo)
        //记录内容字符串存储过程错误，进行回滚操作
        const storeResult = this.makelink()
        if(storeResult){
            alert("存储失败："+storeResult)
            this.recordedSteps.splice(-1,1)
            this.status = constant.RECORDFAIL
            return false
        }
        hightLightElement(whats.getTarget(targetInfo.id),targetInfo.text)    
        targetInfo.isActive = true   
        this.status = constant.RECORDED
        return true
    }
    
    this.remove = function(stepIndex){
        //删除所有
        if(stepIndex<0){
            while(this.recordedSteps.length>0){
                this.replay(0,false,false)
                this.recordedSteps.splice(0,1)
            }
        }else{
            this.replay(stepIndex,false,false)
            this.recordedSteps.splice(stepIndex,1)
        }
        this.makelink()
    }

    this.replay = function(index=0,goto=true,hightlight=true,autoNext,replaySteps,timeout=5000){
        //TODO 根据当前窗口与记录时候窗口大小进行比较，如果差异较大 则进行提示 可能定位不准确的情况
        replaySteps = replaySteps || this.recordedSteps;
        const runStep = replaySteps[index]
        if(!runStep){
            this.status = constant.REPLAYFINISHED
            return 
        }
        const {x,y,id,text} = runStep, targetEl = id ? whats.getTarget(id) : null
        
        clearInterval(runningTimer)
        clearTimeout(nextTimer)
        runningTimer = null
        nextTimer = null
        //开始滚动
        this.runindex = index
        this.status = constant.REPLAYING
        runStep.isActive = hightlight
        
        targetEl &&  hightLightElement(targetEl,text,hightlight)
        if(goto){
            const gotoX = x-window.innerWidth/2,gotoY = y-window.innerHeight/2;
            runningTimer = gotoPosition(gotoX,gotoY,()=>{
                this.runindex = null
                if(autoNext){
                    nextTimer = setTimeout(()=>this.replay(index+1,goto,hightlight
                        ,autoNext,replaySteps,timeout),timeout)
                }else{
                    this.status = constant.REPLAYFINISHED
                    clearTimeout(nextTimer)
                }
            })
        }else{
            this.runindex = null
            this.status = constant.REPLAYFINISHED
        }
        

        //TODO 存在 targetEl 时，使用定位该元素窗口居中效果 否则 使用滚动效果
    }

    //success no return; failed return errorMsg
    this.makelink = () => {
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
                    share += index!=0 ? splitStep:"";
                    var keys = ["x","y","id","text","tip"]
                    keys.forEach((key,keyindex)=>{
                        let value = (step[key] || nullValue).toString().replace(new RegExp(numberCode,"g"),numberAfter)
                        
                        NOCODE.forEach(code=>{
                            if(value.indexOf(code)>-1){
                                throw Error(`选中文字、提示信息不得包含：${code}`)
                            }
                        })
                        
                        if((key=="id" && value.length > 35) || (key=="tip" && step["tip"]===step["text"])){
                            value = nullValue
                        }
                        share += keyindex!=0 ? splitValue+value : value
                    })
                });
                if(this.options.autoReplay){
                    share += "&autoreplay=true"
                }
            }
            history.pushState("", nameid, currentUrl+share);
        }catch(e){
            return e.message
        }
    }

    Object.defineProperty(this,"status",{get:()=>{return status},set:(value=>{
        status=value;
        this.onStateChange(status)
    })})
    Object.defineProperty(this,"version",{value:"0.0.2"})
}