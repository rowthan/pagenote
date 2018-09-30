import {version} from '../package.json'
import {drawMenu} from './document'
import constant from './constant'
import whatselement from 'whats-element'
const whats = new whatselement({draw:false})
const MOUSE_UP = 'ontouchstart' in window
  /* istanbul ignore next */ ? 'touchend'
  /* istanbul ignore next */ : 'mouseup',
  IS_TOUCH = 'ontouchstart' in window

const getXY = IS_TOUCH
? e => {
const touch = e.touches[0] || e.changedTouches[0]
return touch ? {
    x: touch.pageX,
    y: touch.pageY
} : { x: 0, y: 0 }
}
: e => {
   var e = event || window.event;
   var x = e.pageX || e.clientX + getScroll().x;
   var y = e.pageY || e.clientY + getScroll().y;
   return { 'x': x, 'y': y };
}
 
function getScroll(){
    var x = document.documentElement.scrollLeft || document.body.scrollLeft;
    var y = document.documentElement.scrollTop || document.body.scrollTop;
    return {x,y}
}

function setScroll(x=0,y=0){
    document.documentElement.scrollLeft = document.body.scrollLeft = x;
    document.documentElement.scrollTop =  document.body.scrollTop = y;
}

function focusOnElement(element){

}

function hightLightElement(element){
    console.log("hightligth target")
    element.style.background = "#e8d2bb"
}

export default function Easyshare(options={autoReplay:true,hightligth:true}){
    this.options = options
    this.steps = []
    this.replayStep = null
    let status = constant.PAUSE
    let targetInfo = {}
    drawMenu();

    const menuEl = document.getElementById(constant.MENUID)
    
    menuEl.onclick = (e)=> {
        if(this.status===constant.RECORDED){
            console.log("已经记录")
            return
        }
        else if(this.status!=constant.WAITING){
            alert("当前状态不可记录")
            return false;
        }
        this.record()
        menuEl.innerHTML = status
    }

    document.addEventListener( MOUSE_UP , (e)=>{
        const selectd = getText(e);
        if(selectd.text===targetInfo.text){
            console.log("不再监听")
            return
        } 
        
        //存在选中内容 并且 状态为暂停时 显示锚点按钮 存储相关信息
        if(selectd.text){
            const { x, y } = getXY(e)
            menuEl.style.transform = `translateX(${x}px) translateY(${y}px)`
            menuEl.style.display = "block"
            this.status = constant.WAITING
            
            targetInfo = {
                x:document.documentElement.scrollLeft,
                y:document.documentElement.scrollTop,
                text:selectd.text,
                id: selectd.id ? selectd.id.wid : null
            }
        }else{
            targetInfo = {}
            menuEl.style.display = "none"
            this.status = constant.PAUSE
        }
    } );
    

    this.finished = function(){
        this.status = constant.FINNISHED
        this.setps = []
    }

    this.record = function(callback){
        this.status = constant.RECORDING
        
        this.steps.push(targetInfo)
        this.status = constant.RECORDED
        typeof callback === "function" &&callback()
    }

    this.replay = function(step=0){
        if(this.steps.length<step+1){
            return 
        }
        const {x,y,id} = this.steps[step]

        const targetEl = whats.getTarget(id);
       
        if(targetEl && options.hightligth){
            hightLightElement(targetEl)
        }
        //TODO 存在 targetEl 时，使用定位该元素窗口居中效果 否则 使用滚动效果
        getoPosition(x,y,()=>{
            if(this.steps.length===step+1){
                this.status = constant.REPLAYFINISHED
                return;
            }else if(options.autoReplay){
                setTimeout(()=>this.replay(step+1),5000)
            }
        })
    }

    Object.defineProperty(this,"status",{get:()=>{return status},set:(value=>{
        status=value;
        menuEl.innerHTML = value
    })})
    Object.defineProperty(this,"version",{value:version})
}


function getText(e) {
    const selected = document.getSelection()
    return {
        text:selected.toString().trim(),
        id: whats.getUniqueId(e.target)
    };
}


function getoPosition(targetX=0,targetY=0,callback){
    // console.log("target position:",targetX,targetY)
    const timer = setInterval(function () {
        //移动前
        const { x:beforeScrollLeft,y:beforeScrollTop} = getScroll();
        const distanceX = targetX - beforeScrollLeft
        , distanceY =  targetY - beforeScrollTop
        
        //移动后
        setScroll(beforeScrollLeft+Math.floor(distanceX/6),Math.floor(beforeScrollTop+distanceY/6))
        
        const {x:afterScrollLeft,y:afterScrollTop} = getScroll()
        
        if(beforeScrollTop === afterScrollTop && beforeScrollLeft === afterScrollLeft){
            clearInterval(timer)
            callback()
        }
    },30)
}

Easyshare.prototype.init = function(){console.log("init")}