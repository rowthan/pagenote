import confetti from 'canvas-confetti'

export function showConfetti(target: HTMLElement) {
    const position = target.getBoundingClientRect();
    confetti({
        particleCount: 60,
        spread: 70, //横向扩展
        // decay: 0.94, 速度丢失
        // drift: 0.8, 风向横向吹动
        // gravity: 0.5, 重力
        ticks: 80, // 显示时间
        startVelocity: 30, // 运行速度
        origin: {
            y: (position.y + position.height / 2 ) / window.innerHeight,
            x: (position.x + position.width / 2) / window.innerWidth,
        }
    });
}
