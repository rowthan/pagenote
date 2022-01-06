interface Message {
    message: string,
    type: string,
    duration: number,
    position?: {x: string,y: string},
    color?: string,
    e?: any,
}

export default function notification(showMessage: Message) {
    const {message,position = {x:0,y:0},type,duration=2000,color,e} = showMessage;
    const ele =  document.createElement('pagenote-notification');
    ele.dataset.type = type;
    if(color){
        // @ts-ignore
        ele.style = `--color: ${color}`
    }
    ele.innerHTML = message;
    ele.style.left = position.x || e?.target?.clientX || window.innerWidth/2 + 'px';
    ele.style.top = position.y || e?.target?.clientY || window.innerHeight/2 + 'px';
    document.body.appendChild(ele);
    let timer: NodeJS.Timeout;
    setTimer();
    ele.addEventListener('mouseover',function () {
        ele.dataset.status = ''
        clearTimeout(timer);
    },{capture:true});
    ele.addEventListener('mouseout',function () {
        setTimer();
    },{capture:true});

    function setTimer() {
        ele.dataset.status = 'fade';
        timer = setTimeout(()=>{
            ele.parentNode.removeChild(ele);
        },duration);
    }
}

export type {
    Message
}
