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
   var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
   var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
   var x = e.pageX || e.clientX + scrollX;
   var y = e.pageY || e.clientY + scrollY;
   return { 'x': x, 'y': y };
}
 


export default function Easyshare(options={autoReplay:true}){
    this.options = options
    this.steps = []
    this.replayStep = null
    let status = constant.PAUSE
    let targetInfo ={}
    drawMenu();

    const menuEl = document.getElementById(constant.MENUID)
    
    menuEl.onclick = (e)=> {
        if(this.status!=constant.WAITING){
            console.log("当前状态不可记录")
            return false;
        }
        this.record()
        menuEl.innerHTML = status
    }

    document.addEventListener( MOUSE_UP , (e)=>{
        // handle mouseup
        const selectd = getText(e);
        if(selectd.text){
            const { x, y } = getXY(e)
            menuEl.style.transform = `translateX(${x}px) translateY(${y}px)`
            menuEl.style.display = "block"
            this.status = constant.WAITING
            
            targetInfo = {
                x:x,
                y:y,
                text:selectd.text,
                id: selectd.id ? selectd.id.wid : null
            }
        }else{
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
        console.log(targetInfo)
        this.status = constant.RECORDED
        typeof callback === "function" &&callback()
    }

    this.replay = function(step=0){
        if(this.steps.length<step+1){
            return 
        }
        const {x,y,text,targetId} = this.steps[step]

        goTop(y,()=>{
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


function getoPosition(target=0,callback){
    // target = target>document.body.scrollHeight?document.body.scrollHeight:target
    const timer = setInterval(function () {
        //获取scrollTop
        const scrollTop=document.documentElement.scrollTop||document.body.scrollTop;
        const step =  target - scrollTop
        const ispeed=Math.floor(step/6);
        console.log(target,scrollTop,step,ispeed)
        //修改前
        const lastScrollTop = document.documentElement.scrollTop||document.body.scrollTop
        //修改后
        document.documentElement.scrollTop=document.body.scrollTop=scrollTop+ispeed;
        const currentScrollTop = document.documentElement.scrollTop||document.body.scrollTop
        console.log("modify:",lastScrollTop,currentScrollTop)
        if(Math.abs(ispeed)<10 || lastScrollTop === currentScrollTop){
            clearInterval(timer)
            callback()
        }
    },30)
}

Easyshare.prototype.init = function(){console.log("init")}