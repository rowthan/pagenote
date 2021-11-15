function notification(showMessage) {
    var message = showMessage.message, _a = showMessage.position, position = _a === void 0 ? { top: 0, left: 0, bottom: 0, right: 0 } : _a, _b = showMessage.type, type = _b === void 0 ? 'info' : _b, _c = showMessage.duration, duration = _c === void 0 ? 2000 : _c, _d = showMessage.color, color = _d === void 0 ? '#ffd581' : _d;
    var ele = document.createElement('div');
    // const leftPx = (position.left || window.innerWidth/2) + 'px';
    // const topPx = (position.top || window.innerHeight/2) + 'px';
    var notifi = document.createElement('pagenote-notify');
    // @ts-ignore
    notifi.style.top = position.top ? position.top + 'px' : '';
    // @ts-ignore
    notifi.style.left = position.left ? position.left + 'px' : '';
    notifi.style.right = position.right ? position.right + 'px' : '';
    notifi.style.bottom = position.bottom ? position.bottom + 'px' : '';
    // @ts-ignore
    notifi.style['--color'] = color;
    notifi.dataset.type = type;
    notifi.innerHTML = message;
    ele.innerHTML = "\n        <div>\n            <style>\n            @keyframes notification-fadeout {\n              0%{\n                opacity: 1;\n              }\n              100%{\n                opacity: 0;\n              }\n            }\n                pagenote-notify{\n                  display: inline-block;\n                  position: fixed;\n                  z-index: 99999;\n                  font-size: 12px;\n                  padding: 2px 4px;\n                  border-radius: 2px;\n                  background: var(--color,#ffd581);\n                  color:#000;\n                }\n                pagenote-notify[data-type='success']{\n                    background: #ffd581;\n                  }\n                  pagenote-notify[data-type='error']{\n                    background: #ff7b82;\n                  }\n                  pagenote-notify[data-status='fade']{\n                    animation: notification-fadeout " + duration + "ms ease-in-out forwards;\n                  }\n            </style>\n        </div>\n    ";
    ele.appendChild(notifi);
    document.body.appendChild(ele);
    var timer;
    setTimer();
    ele.addEventListener('mouseover', function () {
        notifi.dataset.status = '';
        clearTimeout(timer);
    }, { capture: true });
    ele.addEventListener('mouseout', function () {
        setTimer();
    }, { capture: true });
    function setTimer() {
        notifi.dataset.status = 'fade';
        timer = setTimeout(function () {
            // @ts-ignore
            ele.parentNode.removeChild(ele);
        }, duration);
    }
}
export default notification;
//# sourceMappingURL=toast.js.map