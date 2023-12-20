export function calculateOptimalPosition(targetElement:Element, popupElement:HTMLElement) {
    const targetRect = targetElement.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const popupWidth = popupElement.offsetWidth;
    const popupHeight = popupElement.offsetHeight;

    const positions = [
        { left: targetRect.right, top: targetRect.top + targetRect.height }, // 右下
        { left: targetRect.right, top: targetRect.top + (targetRect.height - popupHeight) / 2 }, // 右中
        { left: targetRect.right, top: targetRect.top - popupHeight }, // 右上

        { left: targetRect.left - (popupWidth - targetRect.width) / 2, top: targetRect.top + targetRect.height }, // 下边
        { left: targetRect.left - (popupWidth - targetRect.width) / 2, top: targetRect.top - popupHeight }, // 上边

        { left: targetRect.left - popupWidth, top: targetRect.top - popupHeight }, // 左上
        { left: targetRect.left - popupWidth, top: targetRect.top + (targetRect.height - popupHeight) / 2 }, // 左中
        { left: targetRect.left - popupWidth, top: targetRect.top + targetRect.height }, // 左下

    ];


    const popupArea = popupWidth * popupHeight;
    let optimalPosition = positions[0];
    let maxVisibleArea = 0;

    for (let i =0; i<positions.length; i++) {
        const position = positions[i]
        const visibleLeft = Math.max(position.left, 0);
        const visibleTop = Math.max(position.top, 0);
        const visibleRight = Math.min(position.left + popupWidth, viewportWidth);
        const visibleBottom = Math.min(position.top + popupHeight, viewportHeight);

        const visibleWidth = visibleRight - visibleLeft;
        const visibleHeight = visibleBottom - visibleTop;
        const visibleArea = visibleWidth * visibleHeight;

        /**
         * 面积完全可见
         * */
        if(visibleArea >= popupArea){
            optimalPosition = position;
            break;
        }

        /**
         * 面积部分可见，取最大值
         * */
        if (visibleArea > maxVisibleArea) {
            maxVisibleArea = visibleArea;
            optimalPosition = position;
        }
    }

    return optimalPosition;
}
