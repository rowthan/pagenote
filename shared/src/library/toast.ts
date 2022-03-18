
enum MessageType {
    success='success',
    error='error',
    info='info'
}

interface Message {
    message: string,
    type?: MessageType,
    duration?: number,
    placement?: string,
    position?: { top?: number, left?: number, right?: number, bottom?: number },
    color?: string,
}

function notification(showMessage: Message) {
    const {
        message,
        position = {top: 0, left: 0, bottom: 0, right: 0},
        type = MessageType.info,
        duration = 2000,
        color = '#ffd581'
    } = showMessage;
    const ele = document.createElement('div');
    // const leftPx = (position.left || window.innerWidth/2) + 'px';
    // const topPx = (position.top || window.innerHeight/2) + 'px';

    const notifi = document.createElement('pagenote-notify');
    // @ts-ignore
    notifi.style.top = position.top ? position.top + 'px' : '';
    // @ts-ignore
    notifi.style.left = position.left ? position.left + 'px' : '';
    notifi.style.right = position.right ? position.right + 'px' : '';
    notifi.style.bottom = position.bottom ? position.bottom + 'px' : '';
    // @ts-ignore
    notifi.style['--color'] = color;
    notifi.dataset.type = type;

    notifi.innerHTML = message

    ele.innerHTML = `
        <div>
            <style>
                @keyframes notification-fadeout {
                  0%{
                    opacity: 1;
                  }
                  100%{
                    opacity: 0;
                  }
                }
                pagenote-notify{
                  display: inline-block;
                  position: fixed;
                  z-index: 99999;
                  font-size: 12px;
                  padding: 2px 4px;
                  border-radius: 2px;
                  background: var(--color,#ffd581);
                  color:#000;
                }
                pagenote-notify[data-type='success']{
                    background: #ffd581;
                }
                pagenote-notify[data-type='error']{
                    background: #ff7b82;
                }
                pagenote-notify[data-status='fade']{
                    animation: notification-fadeout ${duration}ms ease-in-out forwards;
                }
            </style>
        </div>
    `;
    ele.appendChild(notifi)
    document.body.appendChild(ele);
    let timer: NodeJS.Timeout;
    setTimer();
    ele.addEventListener('mouseover', function () {
        notifi.dataset.status = ''
        clearTimeout(timer);
    }, {capture: true});
    ele.addEventListener('mouseout', function () {
        setTimer();
    }, {capture: true});

    function setTimer() {
        notifi.dataset.status = 'fade';
        timer = setTimeout(() => {
            // @ts-ignore
            ele.parentNode.removeChild(ele);
        }, duration);
    }
}

export default notification
