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
            alert("当前状态不可记录")
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
                x:document.documentElement.scrollLeft,
                y:document.documentElement.scrollTop,
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
        this.status = constant.RECORDED
        typeof callback === "function" &&callback()
    }

    this.replay = function(step=0){
        if(this.steps.length<step+1){
            return 
        }
        const {x,y,targetId} = this.steps[step]


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


function getoPosition(x=0,y=0,callback){
    const timer = setInterval(function () {
        //获取scrollTop
        const scrollTop=document.documentElement.scrollTop||document.body.scrollTop;
        const scrollLeft=document.documentElement.scrollLeft||document.body.scrollLeft;
        const step =  y - scrollTop
        const ispeed=Math.floor(step/6);
        //修改前
        const lastScrollTop = document.documentElement.scrollTop||document.body.scrollTop
        const lastScrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft
        //修改后
        document.documentElement.scrollTop=document.body.scrollTop=scrollTop+ispeed;
        document.documentElement.scrollLeft=document.body.scrollLeft=scrollLeft+ispeed
        const currentScrollTop = document.documentElement.scrollTop||document.body.scrollTop
        const currentScrollLeft = document.documentElement.scrollLeft||document.body.scrollLeft
        if(lastScrollTop === currentScrollTop && lastScrollLeft === currentScrollLeft){
            clearInterval(timer)
            callback()
        }
    },30)
}

Easyshare.prototype.init = function(){console.log("init")}