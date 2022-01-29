export default function notification(showMessage) {
    var _a, _b;
    var message = showMessage.message, _c = showMessage.position, position = _c === void 0 ? { x: 0, y: 0 } : _c, type = showMessage.type, _d = showMessage.duration, duration = _d === void 0 ? 2000 : _d, color = showMessage.color, e = showMessage.e;
    var ele = document.createElement('pagenote-notification');
    ele.dataset.type = type;
    if (color) {
        // @ts-ignore
        ele.style = "--color: ".concat(color);
    }
    ele.innerHTML = message;
    ele.style.left = position.x || ((_a = e === null || e === void 0 ? void 0 : e.target) === null || _a === void 0 ? void 0 : _a.clientX) || window.innerWidth / 2 + 'px';
    ele.style.top = position.y || ((_b = e === null || e === void 0 ? void 0 : e.target) === null || _b === void 0 ? void 0 : _b.clientY) || window.innerHeight / 2 + 'px';
    document.body.appendChild(ele);
    var timer;
    setTimer();
    ele.addEventListener('mouseover', function () {
        ele.dataset.status = '';
        clearTimeout(timer);
    }, { capture: true });
    ele.addEventListener('mouseout', function () {
        setTimer();
    }, { capture: true });
    function setTimer() {
        ele.dataset.status = 'fade';
        timer = setTimeout(function () {
            ele.parentNode.removeChild(ele);
        }, duration);
    }
}
//# sourceMappingURL=notification.js.map