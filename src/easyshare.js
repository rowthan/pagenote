import {gotoPosition,getXY,hightLightElement} from './document'
import whatsPure from 'whats-element/pure'
//whats getTarget try catch  同时计算出多个 进行长度比较 取最优的
//将所有常用量进行存储 此处是全局 避免和原本常亮冲突 放到 constant里面
const whats = new whatsPure()

export default function EasyShare(id,options){
    this.id = id || "easyshare-container"
    this.options = 
    Object.assign({playSetting:{auto:true,dura:100},maxMarkNumber:10,
        stepSplit:"e_o",valueSplit:":)",blacklist:[this.id]
    },options)
    this.recordedSteps = []
    this.runindex = NULL
    this.target = {}
    this.url = window.location.href
    let status=NULL,
        nextTimer = NULL, 
        runningTimer = NULL,
        targetInfo = this.target
        

    const UNDEFINED = undefined,
          NULL = null,
          constant = this.CONSTANT,
          OPTIONS = this.options,
          splitStep = OPTIONS.stepSplit,
          splitValue= OPTIONS.valueSplit,
          playSetting = OPTIONS.playSetting,
          webPlaySetting = Object.assign({},playSetting),
          nameid = constant.ID,
          location = window.location,
          emptyString = "",
          numberAfter="_hash-",
          numberCode = "#", //中文 ! # & @ 不能作为分割词。 建议使用非对称 (→o←) -_-||
          NOCODE = [splitStep,splitValue],
          S = this.recordedSteps,
          blackNodes = [];
    window.addEventListener("load", ()=> {
        const search = decodeURI(location.search).replace(new RegExp(numberAfter,"g"),numberCode)
        
        const searchArray = search.substr(1).split("&");
        const searchObject = {}
        for(let i=0 ; i < searchArray.length; i++){
            const queryPar  = searchArray[i],
            index = queryPar.indexOf("=")
            searchObject[queryPar.substring(0,index)] = queryPar.substring(index+1)
        }
        const stepsString = searchObject[nameid],playsetting = searchObject["esplay"];
        if(stepsString){
            //获取到EasyShare数据字符串 解析为对象
            stepsString.split(splitStep).forEach(value=>{
                const values = value.split(splitValue),
                    tempStep = {
                        x:values[0],
                        y:values[1],
                        id:values[2],
                        text:values[3],
                        tip:values[4] || values[3]
                    }
                    S.push(tempStep)
                })
                this.status = constant.READY
        }
        if(playsetting){
            playsetting.split("_").forEach(set=>{
                const keyvalue = set.split("-")
                playSetting[keyvalue[0]] = keyvalue[1]
            })
            //将string转为 boolean 类型
            playSetting.auto = playSetting.auto && playSetting.auto == "true"
        }
        //能自动优化为 && 
        if(playSetting.auto){
            easyshare.replay(0,false,true,true,null,playSetting.dura)
        }
        setTimeout(()=>{
            this.options.blacklist.forEach((elementid)=>{
                const white = whats.getTarget(elementid);
                if(white){
                    blackNodes.push(white)
                } 
            })
        },0)
    });

    
    let levent = null
    
    if("ontouchstart" in window){
        document.addEventListener("touchstart",(e)=>{
            levent = e
        })
        document.onselectionchange = (e)=>{
            if(levent.target && levent.target.id!="record"){
                const{x,y}=getXY(levent)
                handleUp.call(this,{x,y:y+24})
            }
        }
    }else{
        document.addEventListener("mouseup" , (e)=>{
            handleUp.call(this,{x:e.pageX,y:e.pageY})
        } )
    }
    function handleUp(position){
        const selection = document.getSelection(),
              targetElment = selection.anchorNode.parentNode;
             
        for(let i of blackNodes){
            if(i.contains(targetElment)){
                return
            }
        }
        const selectdText = selection.toString().trim();

        if(this.status == constant.WAITING && selectdText === targetInfo.text){
            return
        }
        if(selectdText){
            this.target = targetInfo =  {
                x:position.x,
                y:position.y,
                text:selectdText.substring(0,30),
                tip:selectdText,
                id: whats.getUniqueId(targetElment).wid
            }
            
            this.status = (this.status === constant.REPLAYING || this.status === constant.PLAYANDWAIT) ? constant.PLAYANDWAIT : constant.WAITING
        }else{
            this.target = targetInfo = {}
            this.status = constant.PAUSE
        }
    }

    this.onStateChange = function(){}
    
    // success: true,faild:false
    this.record = function(forceRecord){   
        const maxNn = OPTIONS.maxMarkNumber
        if(S.length>=maxNn){
            alert("标记失败！最大标记数量为 "+maxNn)
            return false
        }
        // 如果当前状态不为等待记录 且不是强行记录时
        if(!forceRecord && this.status!=constant.WAITING){
            return false;
        }
        this.status = constant.RECORDING
        
        S.push(targetInfo)
        //记录内容字符串存储过程错误，进行回滚操作
        const storeResult = this.makelink()
        if(storeResult){
            alert(storeResult)
            S.splice(-1,1)
            this.status = constant.RECORDFAIL
            return false
        }
        hightLightElement(whats.getTarget(targetInfo.id),targetInfo.text,true)    
        targetInfo.isActive = true   
        this.status = constant.RECORDED
        return true
    }
    
    this.remove = function(stepIndex){
        //删除所有
        if(stepIndex<0){
            while(S.length>0){
                this.replay(0,false,false)
                S.splice(0,1)
            }
            this.status = constant.PAUSE
        }else{
            this.replay(stepIndex,false,false)
            S.splice(stepIndex,1)
        }
        this.makelink()
    }

    this.replay = function(index,goto,hightlight,autoNext,replaySteps,timeout){
        index = index || 0
        goto = goto!=UNDEFINED ? goto : true
        hightlight = hightlight!=UNDEFINED ? hightlight : true;
        timeout = timeout != UNDEFINED ? timeout : playSetting.dura
        //TODO 根据当前窗口与记录时候窗口大小进行比较，如果差异较大 则进行提示 可能定位不准确的情况
        replaySteps = replaySteps || S;
        const runStep = replaySteps[index]
        if(!runStep){
            this.runindex = NULL
            this.status = constant.DONE
            return 
        }
        const {x,y,id,text} = runStep, targetEl = id ? whats.getTarget(id) : NULL
        
        clearInterval(runningTimer)
        clearTimeout(nextTimer)
        runningTimer = nextTimer = NULL
        //开始滚动
        this.runindex = index
        this.status = constant.REPLAYING
        runStep.isActive = hightlight
        
        targetEl &&  hightLightElement(targetEl,text,hightlight)
        if(goto){
            runningTimer = gotoPosition(x-window.innerWidth/2,y-window.innerHeight/3,()=>{
                this.runindex = NULL
                if(autoNext){
                    nextTimer = setTimeout(()=>this.replay(index+1,goto,hightlight
                        ,autoNext,replaySteps,timeout),timeout)
                }else{
                    this.status = constant.DONE
                    clearTimeout(nextTimer)
                }
            })
        }else if(autoNext){
            nextTimer = setTimeout(()=>this.replay(index+1,goto,hightlight
                ,autoNext,replaySteps,timeout),timeout)
        }
        else{
            this.runindex = NULL
            this.status = constant.DONE
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

            if(S.length===0){
                share=""
            }else{
                S.forEach((step,index) => {
                    share += index!=0 ? splitStep:"";
                    var keys = ["x","y","id","text","tip"]
                    keys.forEach((key,keyindex)=>{
                        let value = (step[key] || emptyString).toString().replace(new RegExp(numberCode,"g"),numberAfter)
                        
                        NOCODE.forEach(code=>{
                            if(value.indexOf(code)>-1){
                                throw Error(`不得包含：${code}`)
                            }
                        })
                        
                        if((key=="id" && value.length > 35) || (key=="tip" && step["tip"]===step["text"])){
                            value = emptyString
                        }
                        share += keyindex!=0 ? splitValue+value : value
                    })
                });
                
                let index = 0
                for(let i in playSetting){
                    if(playSetting[i]==webPlaySetting[i]){
                        continue
                    }
                    const value = `${i}-${playSetting[i]}`;
                    share += !index ? "&esplay="+value : "_"+value
                    index++
                }
            }
            this.url = currentUrl+share
            history.pushState(emptyString, nameid, currentUrl+share);
        }catch(e){
            return e.message
        }
    }

    //TODO 滚动到此 自动展开 ，视线离开 自动收缩
    Object.defineProperty(this,"status",{get:()=>{return status},set:(value=>{
        status=value;
        this.onStateChange(status)
    })})
}

EasyShare.prototype.CONSTANT = {
    ID:"easyshare",
    WAITING:0,
    READY:1,
    RECORDING:2,
    PAUSE:3,
    RECORDED:4,
    RECORDFAIL:5,
    FINNISHED:6,
    REPLAYING:7,
    PLAYANDWAIT:8,
    DONE:9// 播放完毕
}

EasyShare.prototype.version = "0.0.6"