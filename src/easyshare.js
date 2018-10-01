import {version} from '../package.json'
import {getoPosition,getXY,hightLightElement} from './document'
import constant from './constant'
import whatselement from 'whats-element'
const whats = new whatselement({draw:false})
const MOUSE_UP = 'ontouchstart' in window
  /* istanbul ignore next */ ? 'touchend'
  /* istanbul ignore next */ : 'mouseup'


export default function Easyshare(options){
    this.options = Object.assign({autoReplay:true,hightligth:true},options)
    this.recordedSteps = []
    //TODO 将mousePosition 放入 targetInfo中
    this.mousePosition = {x:0,y:0}
    let status = constant.PAUSE
    let targetInfo = {}
    

    window.addEventListener("load", (event)=> {
        const search = window.location.search
        if(search.indexOf("easyshare")===-1){
            return
        }
        const searchArray = search.substr(1).split("&");
        for(let i=0 ; i < searchArray.length; i++){
            const queryPar  = searchArray[i]
            if(queryPar.indexOf("easyshare")>-1){
                const pair = queryPar.split("=");
                if(pair.length===2){
                    const values = pair[1]
                    const replaySteps = []
                    values.split("a").forEach(value=>{
                        const tempStep = {
                            x:value.split("-")[0],
                            y:value.split("-")[1]
                        }
                        replaySteps.push(tempStep)
                    })
                    this.replay(0,replaySteps)
                }
                break
            }
        }
    });
    

    document.addEventListener( MOUSE_UP , (e)=>{
        const selectdText = document.getSelection().toString().trim();
        if(selectdText===targetInfo.text){
            console.log("不再监听")
            return
        } 
        
        // const shareContainer = document.getElementById(constant.EASYSHARECONTAINER)
        //存在选中内容 并且 状态为暂停时 显示锚点按钮 存储相关信息
        if(selectdText){
            const { x, y } = getXY(e)
            this.mousePosition = {
                x:x,
                y:y
            }
            // shareContainer.style.transform = `translateX(${x}px) translateY(${y}px)`
            // shareContainer.style.display = "block"
            this.status = constant.WAITING
            
            targetInfo = {
                x:document.documentElement.scrollLeft,
                y:document.documentElement.scrollTop,
                text:selectdText,
                id: whats.getUniqueId(e.target).wid
            }
        }else{
            targetInfo = {}
            // shareContainer.style.display = "none"
            this.status = constant.PAUSE
        }
    } );

    this.onStateChange = function(){
        console.log("changed state:"+status)
    }
    
    this.finished = function(){
        this.status = constant.FINNISHED
        this.setps = []
    }

    this.record = function(callback){
        this.status = constant.RECORDING       
        this.recordedSteps.push(targetInfo)
        this.status = constant.RECORDED
        typeof callback === "function" &&callback()
    }

    this.replay = function(step=0,replaySteps){
        replaySteps = replaySteps || this.recordedSteps;
        if(replaySteps.length<step+1){
            this.status = constant.REPLAYFINISHED
            return 
        }
        const {x,y,id} = replaySteps[step]

        const targetEl = whats.getTarget(id);
       
        if(targetEl && this.options.hightligth){
            hightLightElement(targetEl)
        }
        //TODO 存在 targetEl 时，使用定位该元素窗口居中效果 否则 使用滚动效果
        this.status = constant.REPLAYING
        getoPosition(x,y,()=>{
            if(this.options.autoReplay){
                setTimeout(()=>this.replay(step+1,replaySteps),1000)
            }
        })
    }

    this.makelink = () => {
        if(this.recordedSteps.length===0)return;
        // 生成分享链接,记录数据:  http://www.baidu.com?share=0-123a0-234
        let share = "&easyshare="
        this.recordedSteps.forEach((step,index) => {
            index!=0?share +="a":"";
            share += step.x+"-"+step.y
        });
        let currentUrl = window.location.href,
        indexShare = currentUrl.indexOf("&easyshare")
        if(window.location.search==""){
            currentUrl += "?"
        }
        if(indexShare>-1){
            currentUrl = currentUrl.substr(0,indexShare)
        }
        if(options.autoReplay){
            share += "&autoreplay=true"
        }
        history.pushState("", "EasyShare 预览", currentUrl+share);
    }

    Object.defineProperty(this,"status",{get:()=>{return status},set:(value=>{
        status=value;
        this.onStateChange(status)
        // menuEl.innerHTML = value
    })})
    Object.defineProperty(this,"version",{value:version})
}